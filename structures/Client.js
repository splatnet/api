const Discord = require('discord.js');
const config = require('../config.json');
const client = new Discord.Client({ autoReconnect: true, fetchAllMembers: true, disableEveryone: true });

client.login(config.botToken);

module.exports = client;