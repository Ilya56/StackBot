const Context = require('./context');
const { match } = require('telegraf-i18n')

/**
 * This is the base class of the bot. This class contains and controls states
 */
class Bot {

  /**
   * Creates bot instance. No need to create it twice
   * @param {Telegraf} bot telegraf bot object
   */
  constructor(bot) {
    this._bot = bot;
    this._states = {};
    this._firstStateId = '';
  }

  get firstStateId() {
    return this._firstStateId;
  }

  /**
   * Add state to bot
   * @param {State} state new state
   */
  addState(state) {
    this._states[state.id] = state;
  }

  /**
   * Remove state from bot by state id
   * @param {String} id state id
   * @returns {boolean} true if state was deleted
   */
  removeState(id) {
    if (this._states[id]) {
      delete this._states[id];
      return true;
    }
    return false;
  }

  /**
   * Initializes states. Notifies telegram which trigger for which state and calls onInit method for each state
   */
  initStates() {
    for (let state of Object.values(this._states)) {
      if (!Array.isArray(state.trigger)) {
        state.trigger = [state.trigger];
      }
      for (let trigger of state.trigger) {
        if (typeof trigger === 'string') {
          this._bot.hears(match(trigger), this._triggerState(state));
        } else if (trigger instanceof RegExp) {
          this._bot.hears(trigger, this._triggerState(state));
        } else if (trigger.type === 'method') {
          this._bot[trigger.method](this._triggerState(state));
        } else if (trigger.type === 'event') {
          this._bot.on(trigger.event, this._triggerState(state));
        } else {
          this._bot[trigger.type](trigger.trigger, this._triggerState(state));
        }
      }
      state.onInit();
    }

    const startState = Object.values(this._states).find(s => s.isFirst);
    this._firstStateId = startState.id;
    this._bot.start(this._startFirstState(startState));
  }

  /**
   * Creates custom context object
   * @param {State} state
   * @param {function(context: Context, next: Function): void} cb
   * @returns {function(context: Context, next: Function)}
   * @private
   */
  _createContextWrapper(state, cb) {
    return function (ctx, next) {
      const context = new Context(ctx);
      return cb(context, next);
    }
  }

  /**
   * Starts first state after /start command. Execute first state onStart method
   * @param {State} state
   * @returns {function(context: Context, next: Function)} call handler
   * @private
   */
  _startFirstState(state) {
    return this._createContextWrapper(state, async function (context, next) {
      try {
        await state.onStart(context);
        return next();
      } catch (e) {
        console.error(`Error while processing onStart event for ${state.id} state`, e);
        await context.sendText('Some error: ' + e.message);
      }
    });
  }

  /**
   * Execute state onData method with user answer and execute next state onStart method
   * @param {State} state
   * @returns {function(context: Context, next: Function)} call handler
   * @private
   */
  _triggerState(state) {
    return this._createContextWrapper(state, async (context, next) => {
      try {
        const nextId = await state.onData(context);
        const nextState = this._states[nextId];
        if (nextState) {
          return nextState.onStart(context);
        }
        return next();
      } catch (e) {
        console.error(`Error while processing onData event for ${state.id} state`, e);
        await context.sendText('Some error: ' + e.message);
      }
    });
  }

  sendDirectMessage(userId, message) {
    return this._bot.telegram.sendMessage(userId, message);
  }

}

module.exports = Bot;
