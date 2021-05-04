const State = require("../core/state");
const Context = require('../bot/context');

/**
 * In this state, the user sees the current stack, can reload stack and cancel his own selection
 */
class StackState extends State {

  /**
   * Creates stack state
   * @param {Scheduler} scheduler scheduler class instance
   * @param {String} [id='stack'] state id
   */
  constructor(scheduler, id='stack') {
    super(['Back', 'Refresh', 'Cancel choice'], id);
    this._scheduler = scheduler;
  }

  /**
   * Show current stack as multiple string and propose to reload stack or cancel current choice
   * @param context
   * @returns {Promise}
   */
  async onStart(context) {
    const stack = this._scheduler.activeStack;
    if (stack) {
      let buttons = ['Refresh'];
      if (!stack.isRegistered(context.getUserId())) {
        buttons.push('Back');
      } else {
        buttons.push('Cancel choice');
      }
      return context.showButtons(stack.getStackAsString(), buttons);
    } else {
      return context.showButtons('There is no active stack', ['Back']);
    }
  }

  async onData(context) {
    const message = context.getMessageData().text;
    const stack = this._scheduler.activeStack;
    if (message === 'Back' && !stack.isRegistered(context.getUserId())) {
      return 'select-position';
    } if (message === 'Cancel choice' && stack.isRegistered(context.getUserId())) {
      stack.removeUser(context.getUserId());
      return 'select-position';
    } else {
      return this.id;
    }
  }
}

module.exports = StackState;