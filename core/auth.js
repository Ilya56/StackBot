const User = require("./user");

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
   *
   * @returns {function(ctx: Context, next: Function)}
   */
  get addUserContext() {
    return this._addUserContext.bind(this);
  }

  async canConnect(userId, phone) {
    const exists = await this._userBdHelper.checkUserExistsByPhone(phone);
    const result = !exists && (this._config.allowedPhones || []).includes(phone);
    if (result) {
      this._phoneByUserId[userId] = phone;
    }
    return result;
  }

  /**
   *
   * @param {Context} ctx
   * @param {Function} next
   * @private
   */
  _addUserContext(ctx, next) {
    const userId = ctx.from.id;
    this._users[userId] = this._users[userId] || new User(this._userBdHelper, {
      id: ctx.from.id,
      state: this._bot.firstStateId,
      name: ctx.from.first_name + ctx.from.last_name,
      phone: this._phoneByUserId[userId]
    }).save();

    ctx.user = this._users[userId];
    return next();
  }

}

module.exports = Auth;
