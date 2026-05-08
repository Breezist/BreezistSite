import { Events, Shard } from 'discord.js';

export default {
  event: Events.ShardReady,
  async execute(shardId) {
    console.log(`🌌 Shard ${shardId} has been launched!`);
  },
};