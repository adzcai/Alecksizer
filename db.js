const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database')
  } catch (err) {
    console.log('error connecting to database:', err);
    process.exit(1);
  }
}
