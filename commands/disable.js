const Server = require('../models/Server.model');

// prevents the bot from responding to the sender's messages.
// if any mentions are passed, those users will be muted
// if "server" is passed as an argument, this server will be muted
// if "channel" is passed as an arg, the channel will be muted
// otherwise, it'll mute the sender of the message
module.exports = async ({ args, cache, msg }) => {
  const server = await Server.findOne({ guildId: msg.guild.id }).exec();

  if (args[0] === 'all') {
    server.disabledChannels.add(msg.channel.id);
    return;
  }

  // if the sneder is not already disabled, add it to the list of disabled users
  if (!cache[msg.guild.id].disabledUsers.includes(msg.author.id)) {
    server.disabledUsers.push(...(
      msg.mentions.members ? msg.mentions.members.map(member => member.id) : [])
    );
    await server.save();
    cache[msg.guild.id].disabledUsers.push(msg.author.id);
  }

};