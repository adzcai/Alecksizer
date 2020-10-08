module.exports = class Server {
  constructor({
    guildId,
    replacements,
    disabledUsers,
    disabledChannels
  }) {
    this.guildId = guildId;
  }
}