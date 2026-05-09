/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name routing.js
 * @since May 8th, 2026
 * @description The starter file for the website. 
*/
import path from 'node:path';
import express, {Router} from 'express';
import { fileURLToPath } from 'node:url';
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(express.static(path.join(__dirname, 'public')));

router.get(`/`, async(req, res) => {
    res.send(`Hello!`)
});

export default router;