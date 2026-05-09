/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name storage.js
 * @since May 8th, 2026
 * @description Retrieves files from the /storage folder.
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = path.join(__dirname, `../storage`);

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage, { recursive: true });
}

const targetMap = new Map();

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      getFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export default new Proxy(targetMap, {
  get(target, prop, receiver) {
    if (prop === `get`) {
      return (key) => {
        if (target.has(key)) {
          return target.get(key);
        }
        const allFiles = getFiles(storage);
        const match = allFiles.find(f =>
          path.basename(f).includes(key) || f.includes(key)
        );

        if (!match) return undefined;

        const ext = path.extname(match);
        let data = ext === `json` ? JSON.parse(fs.readFileSync(match, `utf8`)) : fs.readFileSync(match);
        const result = { path: match, data };

        target.set(key, result);
        return result;
      };
    }

    if (prop === `set`) {
      return (key, value) => {
        const filePath = path.join(storage, `${key}.json`);
        fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
        return target.set(key, value);
      };
    }

    const value = Reflect.get(target, prop, receiver);
    if (typeof value === `function`) {
      return value.bind(target);
    }
    return value;
  }
});