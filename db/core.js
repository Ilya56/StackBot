const mongoose = require('mongoose');

class Database {

  constructor(url) {
    this._url = url;
  }

  async init() {
    try {
      await mongoose.connect(this._url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
    } catch (e) {
      console.error('Error while connect to database', e);
    }
  }

}

module.exports = Database;
