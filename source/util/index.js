/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name util/index.js
 * @since May 8th, 2026
 * @description Retrieves all utility modules to return when imported.
*/
import fs from 'node:fs';
import path from 'node:path';

export default async function() {
    const modules = {};
    const files = await fs.promises.readdir('./source/util');
    for (const file of files) {
        if (file.endsWith('.js')) {
            const name = file.replace('.js', '');
            if(name != `index`) {
                let data = await import(`./${file}`)
                modules[name] = (data.default) ? data.default : data;
            }
        }
    }
    return modules;
}