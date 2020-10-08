const Server = require('../models/Server.model');

module.exports = async ({ cache, args, msg }) => {
  if (args.length < 2) {
    await msg.channel.send('Yo type the first and last string of the replacement you want to remove');
    return;
  }

  const existingIndex = cache[msg.guild.id].findIndex(({ fromStr, toStr }) => fromStr === args[0] && toStr === args[1]);

  if (existingIndex === -1) {
    await msg.channel.send('Oi, you haven\'t even added that replacement');
    return;
  }

  // Now we know this replacement already exists at `existingIndex`
  const server = await Server.findOne({ guildId: msg.guild.id });
  cache[msg.guild.id].splice(existingIndex, 1);
  server.replacements.splice(existingIndex, 1);
  await server.save();

  await msg.channel.send(`Ok, guess we aren't turning \`${args[0]}\` into \`${args[1]}\` anymore`);
}
