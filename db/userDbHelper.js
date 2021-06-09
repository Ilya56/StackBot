const mongoose = require('mongoose');
const User = require("../core/user");

/**
 * User db model representation
 */
class UserDbHelper {

  /**
   * Creates new use database helper
   */
  constructor() {
    this._schema = new mongoose.Schema({
      _id: String,
      state: String,
      name: String,
      phone: String,
      subscribed: Boolean,
      isTeacher: Boolean,
      username: String
    });
    this._user = mongoose.model('User', this._schema);
  }

  /**
   * Returns all users from db
   * @returns {Promise<User[]>}
   */
  async loadUsers() {
    let users = await this._user.find({});
    return users.map(u => this._userFromModel(u));
  }

  /**
   * Save new user or update existing in db
   * @param {User} user new user or updated user
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

  /**
   * Return true if user exists
   * @param {String} phone user phone
   * @returns {Promise<Boolean>}
   */
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
