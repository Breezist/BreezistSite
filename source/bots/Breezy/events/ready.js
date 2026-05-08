import { Events, ActivityType, PresenceUpdateStatus, REST, Routes, CommandInteraction, Client } from 'discord.js';

let changeInterval = 3;
const activities = [
    {name: `hello`, type: ActivityType.Playing},
    {name: `test2`, type: ActivityType.Listening},
]

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