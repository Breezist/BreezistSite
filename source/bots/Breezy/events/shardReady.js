/**
 *  _____ _____                 _     _   
 * |  __ | __  |___ ___ ___ ___|_|___| |_ 
 * | |___| __ -|  _| -_| -_|- _| |_ -|  _|
 * |_____|_____|_| |___|___|___|_|___|_|  
 * @name shardReady.js
 * @since May 8th, 2026
 * @description Executes when the Discord client's shards are ready. 
*/
import { Events, Shard } from 'discord.js';

export default {
  event: Events.ShardReady,
  async execute(shardId) {
    console.log(`🌌 Shard ${shardId} has been launched!`);
  },
};