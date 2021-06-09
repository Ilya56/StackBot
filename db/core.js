const mongoose = require('mongoose');

/**
 * Database core object. It just create connection
 */
class Database {

  /**
   * Creates new db instance
   * @param url
   */
  constructor(url) {
    this._url = url;
  }

  /**
   * Create db connection
   * @returns {Promise<void>}
   */
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
