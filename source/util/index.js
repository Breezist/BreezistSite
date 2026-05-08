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