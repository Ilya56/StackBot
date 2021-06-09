const Context = require('../bot/context');
const User = require('./user');

class Auth {

  /**
   *
   * @param {Bot} bot
   * @param {UserDbHelper} userBdHelper
   * @param {Object} config
   */
  constructor(bot, userBdHelper, config) {
    this._bot = bot;
    this._userBdHelper = userBdHelper;
    this._config = config;
    this._users = {};
    this._teachers = {};
    this._phoneByUserId = {};

    this.loadUsers()
      .catch(err => console.error('Error while loading users from db', err));
  }

  /**
   * Load user from db after bot started
   * @returns {Promise<void>}
   */
  async loadUsers() {
    const users = await this._userBdHelper.loadUsers();
    for (let user of users) {
      if (user.isTeacher) {
        this._teachers[user.id] = user;
      }
      this._users[user.id] = user;
    }
  }

  /**
   * Returns middleware that add user object from db in user field to context
   * @returns {function(ctx: Context, next: Function)}
   */
  get addUserContext() {
    return this._addUserContext.bind(this);
  }

  /**
   * Return true if user has access to this bot
   * @param {String} userId user id
   * @param {String} phone user phone
   * @returns {Promise<boolean>}
   */
  async canConnect(userId, phone) {
    const exists = await this._userBdHelper.checkUserExistsByPhone(phone);
    const result = !exists && (this._config.allowedPhones || []).includes(phone);
    if (result) {
      this._users[userId].phone = phone;
    }
    return result;
  }

  /**
   * Middleware that add user object from db
   * @param {Context} ctx telegraf context
   * @param {Function} next next function
   * @private
   */
  _addUserContext(ctx, next) {
    const context = new Context(ctx);
    const userId = context.getUserId();
    const user = context.getUserData();
    this._users[userId] = this._users[userId] || new User(this._userBdHelper, {
      id: userId,
      state: this._bot.firstStateId,
      name: user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
      username: user.username
    }).save();

    ctx.user = this._users[userId];
    return next();
  }

}

module.exports = Auth;
