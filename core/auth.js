const User = require("./user");

class Auth {

  /**
   *
   * @param {Bot} bot
   * @param {UserDbHelper} userBdHelper
   */
  constructor(bot, userBdHelper) {
    this._bot = bot;
    this._userBdHelper = userBdHelper;
    this._users = {};

    this.loadUsers()
      .catch(err => console.error('Error while loading users from db', err));
  }

  async loadUsers() {
    const users = await this._userBdHelper.loadUsers();
    for (let user of users) {
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

  /**
   *
   * @param {Context} ctx
   * @param {Function} next
   * @private
   */
  _addUserContext(ctx, next) {
    this._users[ctx.from.id] = this._users[ctx.from.id] || new User(this._userBdHelper, {
      id: ctx.from.id,
      state: this._bot.firstStateId
    }).save();

    ctx.user = this._users[ctx.from.id];
    return next();
  }

}

module.exports = Auth;
