module.exports = ({ msg }) => {
  msg.channel.send(`\`&help\` - show this message
\`&replace word1 word2\` - make word1 turn into word2
\`&info\` - show what replacements are currently on this server
\`&remove word1 word2\` - remove the replacement of word1 into word2
\`&disable\` - prevent the bot from responding to your messages
\`&invite\` - invite me to another server`)
}
