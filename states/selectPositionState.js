const State = require('../core/state');
const Context = require('../bot/context');

/**
 * Select position state
 */
class SelectPositionState extends State {

  /**
   * Creates select position state
   * @param {Scheduler} scheduler scheduler class instance
   * @param {String} [id='select-position'] state id
   */
  constructor(scheduler, id='select-position') {
    super([/^\d+$/, 'Stack', 'Refresh keyboard', 'Back to menu'], id, false);
    this._scheduler = scheduler;
  }

  /**
   * Propose to choose position in stack if it exists
   * @param context
   * @returns {Promise}
   */
  async onStart(context) {
    const stack = this._scheduler.activeStack;
    if (stack) {
      if (stack.isRegistered(context.getUserId)) {
        return context.sendButtons('You already choose position', this.generateNavButtons());
      } else {
        return context.sendButtons('Please choose position', this.generateButtonsArray(stack));
      }
    } else {
      return context.sendButtons('There is no active stack', ['Refresh keyboard', 'Back to menu']);
    }
  }

  /**
   * Returns array of strings that contains only empty stack positions
   * @param {Stack} stack current stack
   * @returns {string[][]}
   */
  generateButtonsArray(stack) {
    let buttons = [];
    let j = 0;
    for (let i = 0; i < stack.maxCount; i++) {
      if (!stack.stack[i].user) {
        buttons[Math.floor(j / 6)] = buttons[Math.floor(j / 6)] || [];
        buttons[Math.floor(j / 6)][j % 6] = stack.stack[i].number;
        j++;
      }
    }
    if (buttons[Math.floor(j / 6)])
      j += 6;
    buttons[Math.floor(j / 6)] = this.generateNavButtons();
    return buttons;
  }

  /**
   * Returns additional buttons on bottom of keyboard
   * @returns {string[]}
   */
  generateNavButtons() {
    return ['Stack', 'Refresh keyboard', 'Back to menu'];
  }

  /**
   * Refresh keyboard - reload this state
   * Stack - go to stack state
   * any number - select position and go to stack state
   * @param {Context} context
   * @returns {Promise<string>} go to stack if position selected correct
   */
  async onData(context) {
    const answer = context.getMessageData().text
    const stack = this._scheduler.activeStack;
    if (context.isEqual(answer, 'Refresh keyboard')) {
      return 'select-position';
    } else if (context.isEqual(answer, 'Back to menu')) {
      return 'menu';
    } else {
      if (!context.isEqual(answer, 'Stack')) {
        if (stack) {
          if (stack.isRegistered(context.getUserId())) {
            return 'stack';
          }
          try {
            this.addUserToStack(context, stack, context.getUserData(), answer);
          } catch (e) {
            if (e.message === 'This number is already taken') {
              return context.sendText(e.message);
            }
            console.error('Error while processing select position', e);
            return context.sendText('Some error: ' + e.message);
          }
        }
      }
      return 'stack';
    }
  }

  /**
   * Add user to stack on given position
   * @param {Context} context context
   * @param {Stack} stack current stack
   * @param {UserData} user telegraf user data
   * @param {Number|String} number position
   */
  addUserToStack(context, stack, user, number) {
    stack.addUser(user, number);
  }

}

module.exports = SelectPositionState;
