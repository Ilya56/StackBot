const mongoose = require('mongoose');

class UserDbHelper {

  constructor() {
    this._schema = new mongoose.Schema({
      _id: String,
      state: String
    });
    this._user = mongoose.model('User', this._schema);
  }

  get User() {
    return this._user;
  }

  async loadUsers() {
    let users = await this._user.find({});
    return users.map(u => ({id: u.id, state: u.state}));
  }

  async saveUser(user) {
    const userId = user.id;
    delete user.id;
    const result = await this._user.updateOne({_id: userId}, {$set: user}, {upsert: true});
    if (!result.ok) {
      throw new Error(`Error in mongoose while updates user with id ${user.id}`);
    }
  }
}

module.exports = UserDbHelper;
