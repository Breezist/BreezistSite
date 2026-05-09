/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name ready.js
 * @since May 8th, 2026
 * @description Executes when the Discord client is ready.
*/
import { Events, ActivityType, PresenceUpdateStatus, REST, Routes, CommandInteraction } from 'discord.js';

let changeInterval = 30;

export default {
    event: Events.ClientReady,
    async execute(client) {
        const rest = new REST().setToken(client.token);

        console.log(`🤖 ${client.user.username} (Shard ${client.shard?.ids}) is now active!\n⏳ Registering ${client.user.username}'s commands, please wait.`)
        try{
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: client.commands.map((cmd) => cmd.data.toJSON()) }
            );
            console.log(`📝 Successfully registered ${client.user.username}'s ${client.commands.size} commands!`)
        }catch(erorr)  {
            console.log(`😢 There was an error registering the commands:\n${erorr}`)
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        while (true) {
            let servers = client.guilds.cache.size;
            const activities = [
                {name: `/help`, type: ActivityType.Watching},
                {name: `${servers} server${servers == 1 ? `` : `s`}`, type: ActivityType.Listening}
            ]

			for (const {name, type} of activities) {
				client.user.setPresence({
                    activities: [{name, type}],
					status: PresenceUpdateStatus.Idle,
				})
				await sleep(changeInterval * 1000)
			}
		}
    }
}