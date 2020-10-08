const Server = require('../models/Server.model');

module.exports = async ({ cache, msg }) => {
  const server = await Server.findOne({ guildId: msg.guild.id }).lean().exec();
  cache[msg.guild.id] = server;
  await msg.channel.send(server.replacements.length > 0 ?
    server.replacements.map(({ fromStr, toStr }) => `\`${fromStr}\` is replaced with \`${toStr}\``).join('\n')
  : 'You guys are missing out on the fun! Type `&help` to get started');
}
