const mongoose = require('mongoose');
const User = require("../core/user");

class UserDbHelper {

  constructor() {
    this._schema = new mongoose.Schema({
      _id: String,
      state: String,
      subscribed: Boolean
    });
    this._user = mongoose.model('User', this._schema);
  }

  get User() {
    return this._user;
  }

  /**
   *
   * @returns {Promise<User[]>}
   */
  async loadUsers() {
    let users = await this._user.find({});
    return users.map(u => this._userFromModel(u));
  }

  async saveUser(user) {
    const userId = user.id;
    delete user.id;
    const result = await this._user.updateOne({_id: userId}, {$set: user}, {upsert: true});
    if (!result.ok) {
      throw new Error(`Error in mongoose while updates user with id ${user.id}`);
    }
  }

  _userFromModel(user) {
    return new User(this, user);
  }
}

module.exports = UserDbHelper;
