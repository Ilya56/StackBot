const { Markup } = require('telegraf');

/**
 * Contains information about the message, provides response functions, and the original telegraf context
 */
class Context {

  /**
   * Constructs context instance with telegraf context object
   * @param {Context} ctx telegraf context object
   */
  constructor(ctx) {
    this._ctx = ctx;
    if (!ctx.session) {
      ctx.session = {};
    }
  }

  /**
   * Returns original telegraf context
   * @returns {Context}
   */
  get ctx() {
    return this._ctx;
  }

  /**
   * Reply with text with markdown options
   * @param {String|{message:String, context:Object}} text reply text
   * @returns {Promise}
   */
  sendText(text) {
    if (typeof text === 'object') {
      return this._ctx.replyWithMarkdown(this._ctx.i18n.t(text.message, text.context));
    }
    return this._ctx.replyWithMarkdown(this._ctx.i18n.t(text));
  }

  /**
   * Reply with text with bottom keyboard
   * @param {String|{message:String, context:Object}} text reply text
   * @param {Array<String|Object>|Array<Array<String|Object>>} buttons buttons on the bottom keyboard as an
   * array of strings and button objects or an array of arrays of strings and button objects
   * @returns {Promise}
   */
  sendButtons(text, buttons) {
    for (let i = 0; i < buttons.length; i++) {
      if (Array.isArray(buttons[i])) {
        for (let j = 0; j < buttons[i].length; j++) {
          buttons[i][j] = this._ctx.i18n.t(buttons[i][j]);
        }
      }
      if (typeof buttons[i] === 'string') {
        buttons[i] = this._ctx.i18n.t(buttons[i]);
      }
    }
    if (typeof text === 'object') {
      return this._ctx.replyWithMarkdown(this._ctx.i18n.t(text.message, text.context),
        Markup.keyboard(buttons)
          .resize());
    }
    return this._ctx.replyWithMarkdown(this._ctx.i18n.t(text),
      Markup.keyboard(buttons)
        .resize());
  }

  /**
   * @typedef {Object} UserData Telegraf user data simple type
   * @property {Number} id
   * @property {String} first_name
   * @property {String} last_name
   * @property {String} username
   */

  /**
   * Returns full user data
   * @returns {UserData}
   */
  getUserData() {
    return this._ctx.from;
  }

  /**
   * Returns user id
   * @returns {String}
   */
  getUserId() {
    return String(this._ctx.from.id);
  }

  /**
   * @typedef {Object} MessageData Telegraf message data simple type
   * @property {String} text
   */

  /**
   * Returns full message data
   * @returns {MessageData}
   */
  getMessageData() {
    return this._ctx.update.message;
  }

  /**
   * Returns message text
   * @returns {String}
   */
  getMessageText() {
    return this._ctx.update.message.text;
  }

  /**
   * Returns button object that require user contacts
   * @param {String} text text in require contact button
   * @returns {Object}
   */
  getContactRequestButton(text) {
    return Markup.button.contactRequest(this._ctx.i18n.t(text));
  }

  getUserState() {
    return this._ctx.user.state;
  }

  setUserState(state) {
    this._ctx.user.state = state;
  }

  getUserName() {
    return this._ctx.user.name;
  }

  getUser() {
    return this._ctx.user;
  }

  isEqual(message, text) {
    return this._ctx.i18n.t(text) === message || text === message;
  }

  setLocale(locale) {
    this._ctx.i18n.locale(locale);
  }

}

module.exports = Context;
