
/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name app.js
 * @since May 8th, 2026
 * @description The starter file for the website. 
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import util from './source/util/index.js';
const { shardManager, storage } = await util();

import express from 'express';
import subdomains from 'express-subdomain';

const app = express();
const botRouters = new Map();

app.use(subdomains(`*`, (req, res, next) => {
    const host = req.headers.host;
    const parts = host.split(`.`); 
    if (parts.length < 3) return next(); 
    const sub = parts[0].toLowerCase();
    if (botRouters.has(sub)) {
        return botRouters.get(sub)(req, res, next);
    }
    next();
}));

let directory = path.join(__dirname, `./source/bots`);
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
} else {
    for (let bot of fs.readdirSync(directory)) {
        let exists = fs.existsSync(path.join(directory, `/${bot}/bot.js`));
        if (exists) {
            let sM = new shardManager(path.join(directory, `/${bot}/bot.js`), process.env.token)
            await sM.init();

            sM.on(shardManager.events.router, function(router) {
                botRouters.set(bot.toLowerCase(), router);
            });
        }
    }
}

app.listen(8080);