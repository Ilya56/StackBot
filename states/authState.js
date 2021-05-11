const State = require('../core/state');

/**
 * Auth state
 */
class AuthState extends State {

  /**
   * Creates auth state
   * @param {Auth} auth
   * @param {String} [id='auth'] state id
   */
  constructor(auth, id='auth') {
    super([/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, {type: 'event', event: 'contact'}], id, true);
    this._auth = auth;
  }

  /**
   * Requests user phone. Sends requests contact button
   * @param context
   * @returns {Promise}
   */
  async onStart(context) {
    return context.showButtons('Send your phone please', [
      context.getContactRequestButton('Send phone')
    ]);
  }

  /**
   * Saves user contact info
   * @param context
   * @returns {Promise<string>} goes to the menu state
   */
  async onData(context) {
    let phone = ((context.getMessageData() || {}).contact || {}).phone_number || context.getMessageData().text;
    if (phone[0] === '+') {
      phone = phone.slice(1);
    }
    if (this._auth.canConnect(phone)) {
      return 'menu';
    }
    context.ctx.reply('You do not have access to this bot');
    return 'auth';
  }

}

module.exports = AuthState;
