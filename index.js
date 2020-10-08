require('dotenv').config();
const Discord = require('discord.js');
const express = require('express');
const yargs = require('yargs-parser');
const Server = require('./models/Server.model');
const commands = require('./commands');

const cmdRegexp = /^&(.+?)(?:\s|$)/;
const regexpize = text => new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'ig');

require('./db')()
  .then(main)
  .catch(err => console.log('An unexpected error occurred:', err));

function main() {
  // express app setup for keepalive
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.get('/', (_, res) => res.send('Alecksization complete!'));
  app.listen(PORT, () => console.log(`Express app up at port ${PORT}`));


  const cache = {};

  const client = new Discord.Client();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! All systems go.`);

    // Load in the replacements for each guild into a cache
    client.guilds.cache.forEach(async (guild) => {
      const server = await Server.findOne({ guildId: guild.id }).lean().exec();

      if (server) {
        cache[server.guildId] = {
          guildId,
          replacements: new Set(server.replacements),
          disabledUsers: new Set(server.disabledUsers),
          disabledChannels: new Set(server.disabledChannels),
        };
      } else {
        cache[guild.id] = {
          guildId: guild.id,
          replacements: new Set(),
          disabledUsers: new Set(),
          disabledChannels: new Set(),
        };
        const newServer = new Server(cache[guild.id]);
        await newServer.save();
      }
    });
  });

  client.on('message', async (msg) => {
    if (msg.author.bot) return;

    // Check if the message is a command
    const results = cmdRegexp.exec(msg.cleanContent);
    if (results) {
      if (results[1] in commands) {
        const args = yargs(msg.cleanContent.slice(results[1].length + 1))._;
        commands[results[1]]({ client, cache, args, msg });
      } else {
        await msg.channel.send('That isn\'t a command! I\'ve been prank\'d! (`&help`)');
      }
      return;
    }

    // escape characters with special meaning in a regex
    let newMsg = msg.cleanContent;
    cache[msg.guild.id].replacements.forEach(({ fromStr, toStr }) => {
      newMsg = newMsg.replace(regexpize(fromStr), toStr);
    });

    // break if there's no character replacements
    if (newMsg === msg.cleanContent) return;

    // If we should update the bot's avatar, try to do so within 250 ms
    if (msg.author.avatarURL() !== client.user.avatarURL()) {
      try {
        await Promise.race([
          client.user.setAvatar(msg.author.avatarURL()),
          new Promise((_, reject) => {
            setTimeout(reject('Couldn\'t change avatar in time'), 250);
          }),
        ]);
      } catch (err) {
        console.log('Error changing avatar:', err);
      }
    }

    if (newMsg.startsWith('!')) {
      try {
        await msg.delete();
      } catch (err) {
        console.log('Error deleting message:', err);
      }
      newMsg = newMsg.slice(1);
    }

    try {
      await msg.channel.send(msg.member.displayName + ': ' + newMsg);
    } catch (err) {
      console.log('An error occurred while trying to send a message:', err);
    }
  });

  client.login(process.env.DISCORD_TOKEN);
}
