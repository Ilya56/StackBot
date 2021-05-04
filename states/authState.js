const State = require('../core/state');

/**
 * Auth state
 */
class AuthState extends State {

  /**
   * Creates auth state
   * @param {String} [id='auth'] state id
   */
  constructor(id='auth') {
    super([/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, {type: 'event', event: 'contact'}], id, true);
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
    const phone = ((context.getMessageData() || {}).contact || {}).phone_number || context.getMessageData().text;
    console.log(phone);
    return 'menu';
  }

}

module.exports = AuthState;
