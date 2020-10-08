const mongoose = require('mongoose');

const Server = mongoose.model('Server', {
  guildId: String,
  replacements: [{
    fromStr: String,
    toStr: String
  }],
  disabledUsers: [String],
});

module.exports = Server;
