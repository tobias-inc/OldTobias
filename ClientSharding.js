require("dotenv").config();

const { ShardingManager } = require("discord.js");

const manager = new ShardingManager('./index.js', {
    respawn: true,
    totalShards: process.env.NUM_SHARDS || 1
});

manager.spawn().catch(() => process.exit(1));