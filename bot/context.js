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
   * @param {String} text reply text
   * @returns {Promise}
   */
  showText(text) {
    return this._ctx.replyWithMarkdown(text);
  }

  /**
   * Reply with text with bottom keyboard
   * @param {String} text reply text
   * @param {Array<String|Object>|Array<Array<String|Object>>} buttons buttons on the bottom keyboard as an
   * array of strings and button objects or an array of arrays of strings and button objects
   * @returns {Promise}
   */
  showButtons(text, buttons) {
    return this._ctx.replyWithMarkdown(text,
      Markup.keyboard(buttons)
        .oneTime()
        .resize());
  }

  /**
   * @typedef {Object} UserData Telegraf user data simple type
   * @property {String} id
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
   * Returns button object that require user contacts
   * @param {String} text text in require contact button
   * @returns {Object}
   */
  getContactRequestButton(text) {
    return Markup.button.contactRequest(text);
  }

}

module.exports = Context;
