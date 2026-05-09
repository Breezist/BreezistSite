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

export default class shardManager extends EventEmitter {
    manager; web;
    #shards = [];

    static events = {
        'router': `routerConnected`
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

        manager.on(`shardCreate`, (shard) => {
            this.#shards.push(shard);
            shard.on(`message`, async (message) => {
                let {type, routerPath} = message;
                if(type == `routing`) {
                    let webModule = await import(routerPath);
                    let router = webModule.default || webModule;
                    this.web = router;
                    this.emit(shardManager.events.router, router)
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