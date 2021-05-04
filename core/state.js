const Context = require('../bot/context');

/**
 * The state contains the request or question of what the bot asks when it hits this event and the possible actions of the bot,
 * depending on the answer. This class is not valid for use, it must be inherited and onStart and onData methods must be override in it
 */
class State {

  /**
   * Creates new state
   * @param {String|RegExp|Object} trigger A state trigger is a string, regex, or an object described in Telegraf api,
   * which the bot considers valid as a response to a request for this state.
   * @param {String} id state unique id
   * @param {Boolean} [isFirst=false] state that is called first, that is, after the /start command,
   * must have isFirst=true, all others are false
   */
  constructor(trigger, id, isFirst=false) {
    this.trigger = trigger;
    this.id = id;
    this.isFirst = isFirst;
    this._isActive = {};
  }

  /**
   * This method is calls after the user responds in a previous state. It takes a context object,
   * so it can give the user a new request and read the user's previous message
   * @param {Context} context
   * @returns {Promise}
   */
  async onStart(context) {
    return context.showText('Default state text');
  }

  /**
   * This method is called when the user responds in the current state. It takes a context object, so it can read
   * the user's response and respond to the message if needed
   * @param {Context} context
   * @returns {Promise<string>} returns id of the next state which will be called
   */
  async onData(context) {
    // logic
    return 'nextId';
  }

  /**
   * This method initializes state and protects other states. This means that the user cannot reply to any state other
   * than the current state
   */
  onInit() {
    const state = this;

    const onStart = this.onStart;
    this.onStart = function(context) {
      const userId = context.getUserId();
      state._isActive[userId] = true;
      return onStart.call(state, context);
    }

    const onData = this.onData;
    this.onData = async function(context) {
      const userId = context.getUserId();
      if (state._isActive[userId]) {
        const nextId = await onData.call(state, context);
        delete state._isActive[userId];
        return nextId;
      }
    }
  }

}

module.exports = State;
