const mongoose = require('mongoose');

class ExpirationDbHelper {

  constructor() {
    this._schema = new mongoose.Schema({
      dataType: String,
      expiredAt: Date
    });
    this._expiration = mongoose.model('Expiration', this._schema);
  }

  get Expiration() {
    return this._expiration;
  }

  async updateExpire(type, expiredAt) {
    const result = await this._expiration.updateOne({dataType: type}, {$set: {expiredAt}}, {upsert: true});
    if (!result.ok) {
      throw new Error(`Error in mongoose while update expiration with type ${type} and expired at ${expiredAt}`);
    }
  }

  async isExpired(type) {
    const expiration = await this._expiration.findOne({dataType: type});
    return expiration && expiration.expiredAt < new Date();
  }

}

module.exports = ExpirationDbHelper;
