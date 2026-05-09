/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name bot.js
 * @since May 8th, 2026
 * @description This is the main Discord bot file. It creates the Client and then sets up the commands from /commands. It also 
 * creates listeners for the events in /events. 
*/
import { 
  Client, 
  GatewayIntentBits, Partials, Collection, 
  SlashCommandBuilder, ChatInputCommandInteraction,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const token = process.argv.slice(2)[0];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message, Partials.Channel, Partials.Reaction, 
        Partials.GuildMember, Partials.User, Partials.ThreadMember
    ],
});

client.commands = new Collection();

let commands = path.join(__dirname, `./commands`);
for (let file of fs.readdirSync(commands)) {
    const mod = (await import(pathToFileURL(path.join(commands, `/${file}`))))
    let command = mod.default || mod; 
    let data = command.data ?? {name: `undefined`};
    client.commands.set(data.name, command);
}

let events = path.join(__dirname, `./events`);
for (let file of fs.readdirSync(events)) {
    const mod = (await import(pathToFileURL(path.join(events, `/${file}`))))
    let event = mod.default || mod; 
    client.on(event.event, (...args) => event.execute(...args, client));
}

client.shard.send({
    type: `routing`,
    shardId: client.shard.ids[0],
    routerPath: pathToFileURL(path.join(__dirname, `./web.js`)),
});

await client.login(token);
export default client;