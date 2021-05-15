const mongoose = require('mongoose');
const User = require("../core/user");

class UserDbHelper {

  constructor() {
    this._schema = new mongoose.Schema({
      _id: String,
      state: String,
      name: String,
      phone: String,
      subscribed: Boolean,
      isTeacher: Boolean
    });
    this._user = mongoose.model('User', this._schema);
  }

  /**
   *
   * @returns {Promise<User[]>}
   */
  async loadUsers() {
    let users = await this._user.find({});
    return users.map(u => this._userFromModel(u));
  }

  /**
   *
   * @param {User} user
   * @returns {Promise<void>}
   */
  async saveUser(user) {
    const userId = user.id;
    delete user.id;
    const result = await this._user.updateOne({_id: userId}, {$set: user}, {upsert: true});
    if (!result.ok) {
      throw new Error(`Error in mongoose while updates user with id ${user.id}`);
    }
  }

  async checkUserExistsByPhone(phone) {
    return !!await this._user.findOne({phone});
  }

  /**
   * @typedef {Object} UserDB
   * @property {String} _id
   * @property {String} state
   * @property {String} name
   * @property {Boolean} subscribed
   * @property {Boolean} isTeacher
   */

  /**
   *
   * @param {UserDB} user
   * @returns {User}
   * @private
   */
  _userFromModel(user) {
    return new User(this, user);
  }
}

module.exports = UserDbHelper;
