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
import { fileURLToPath, pathToFileURL } from 'node:url';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import util from './source/util/index.js';
const { shardManager, storage } = await util();

import express from 'express';
import subdomains from 'express-subdomain';

const app = express();
const botRouters = new Map();
const mainWeb = await import(`./source/web/routing.js`);
let mainRouter = mainWeb.default || mainWeb;

app.use(subdomains(`*`, (req, res, next) => {
    const host = req.headers.host;
    const parts = host.split(`.`); 
    if (parts.length < 3) return next(); 
    const sub = parts[0].toLowerCase();
    if (botRouters.has(sub)) {
        return botRouters.get(sub).handle(req, res, next);
    }
    next();
}));
app.use(`/`, mainRouter);

let directory = path.join(__dirname, `./source/bots`);
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
} else {
    for (let bot of fs.readdirSync(directory)) {
        let exists = fs.existsSync(path.join(directory, `/${bot}/bot.js`));
        if (exists) {
            const jsonPath = path.join(directory, bot, "config.json");
            const raw = await fs.readFileSync(jsonPath, "utf8");
            const data = JSON.parse(raw);


            let manager = new shardManager(path.join(directory, `/${bot}/bot.js`), process.env[data.token])
            await manager.init();
            botRouters.set(bot.toLowerCase(), manager.web);               
        }
    }
}

app.listen(8001);