const State = require("../core/state");

class TeacherState extends State {

  /**
   *
   * @param {Scheduler} scheduler
   * @param id
   */
  constructor(scheduler, id='teacher') {
    super(['Call first student', 'Refresh', /^[1-5]$/, 'Next student', 'Show stack'], id, false);
    this._scheduler = scheduler;
    this._markByUserId = {};
  }

  async onStart(context) {
    const teacher = context.ctx.user.name;
    if (this._scheduler.activeLabInfo && this._scheduler.activeLabInfo.teacher === teacher) {
      if (this._scheduler.activeStack && this._scheduler.activeStack.currentIndex === -1) {
        return context.showButtons('You can start stack motion', ['Call first student', 'Show stack']);
      } else {
        return context.showButtons('Choice mark or just call next student', [['1', '2', '3', '4', '5'], ['Next student', 'Show stack']]);
      }
    } else {
      return context.showButtons('There is no active lab lesson', ['Refresh']);
    }
  }

  async onData(context) {
    const message = context.getMessageData().text;
    const userId = context.getUserId();
    const stack = this._scheduler.activeStack;
    try {
      if (message === 'Call first student') {
        await stack.callFirst();
      } else if (message === 'Next student') {
        await stack.callNext();
      } else if (message === 'Show stack') {
        await context.showText(stack.getStackAsString());
      } else if (message.match(/[1-5]/)) {
        this._markByUserId[userId] = message;
      }
    } catch (e) {
      if (e.message === 'There is no next user') {
        await context.showText(e.message);
      } else {
        console.error(e);
      }
    }

    return 'teacher';
  }
}

module.exports = TeacherState;
