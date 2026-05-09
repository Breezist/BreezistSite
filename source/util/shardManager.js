/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name shardManager.js, @class shardManager
 * @since May 8th, 2026
 * @description The shardManager class is responsible for the creation of Discord shards. 
*/
import { ShardingManager } from 'discord.js';
import { EventEmitter } from 'node:events';
import express, {Router} from 'express';

export default class shardManager extends EventEmitter {
    manager; web;
    #shards = [];

    static events = {
        router: `routerConnected`
    }

    constructor(path = `/`, token = process.env.token) {
        super();
        
        console.log(`Constructed new manager`)
        let manager = new ShardingManager(path, {
            token: token,
            totalShards: 'auto',
            shardArgs: [
                token,
            ]
        });

        let router = this.web = Router();
        router.get(`/`, async (req, res) => {
            const results = await manager.broadcastEval(client => {
                return client.guilds.cache.map(g => ({
                    id: g.id,
                    name: g.name,
                    memberCount: g.memberCount
                }));
            });
            const guilds = results.flat();

            res.json(guilds);
        })

        manager.on(`shardCreate`, (shard) => {
            this.#shards.push(shard);
            shard.on(`message`, async (message) => {
                let {type, shardId} = message;
                if(type == `ping`) {
                    shard.send({
                        type: `pong`,
                        data: `You have been ponged!`
                    })
                }
            })
        });

        this.manager = manager;
    }

    async init() {
        return await this.manager.spawn({timeout: -1});
    }

    get status() {
        return this.#shards.map(shard => ({
            id: shard.id,
            ready: shard.ready,
            pid: shard.process?.pid,
        }));
    }
}