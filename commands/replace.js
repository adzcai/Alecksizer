const Server = require('../models/Server.model');

module.exports = async ({ cache, args, msg }) => {
  if (args.length < 2) {
    await msg.channel.send('Bruh you need to pass two things to replace, like this:\n```\n&add robert bob```');
  } else {
    console.log(args);
    const server = await Server.findOne({ guildId: msg.guild.id });
    const replacement = {
      fromStr: args[0],
      toStr: args[1]
    }
    cache[msg.guild.id].push(replacement)
    server.replacements.push(replacement);
    await server.save();
    await msg.channel.send(`Alright, now \`${args[0]}\` will be replaced with \`${args[1]}\``);
  }
}
