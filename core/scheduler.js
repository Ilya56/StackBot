const Stack = require("./stack");

/**
 * The scheduler manages the stacks. It creates and contains a stack before the lesson starts and
 * closes the stack after the lesson ends. It also contains information about the lesson
 */
class Scheduler {

  /**
   * @typedef {Object} Lab lab lesson object
   * @property {String} date date one of lesson
   * @property {String} time time one of lesson
   * @property {String} eachWeek can be 'one' or 'two'
   * @property {String} name lab name
   */

  /**
   * Create scheduler instance. No need to create it twice
   * @param {Number} maxCount
   * @param {Object} config
   * @param {Array<Lab>} schedule
   */
  constructor(maxCount, config, schedule) {
    this._maxCount = maxCount;
    this.config = config;
    this.schedule = schedule;

    this._activeStack = {};

    this._startTimers();
  }

  /**
   * Returns max number of students
   * @returns {Number}
   */
  get maxCount() {
    return this._maxCount;
  }

  /**
   * Returns active stack if it exists
   * @returns {Stack|null}
   */
  get activeStack() {
    return this._activeStack && this._activeStack.stack;
  }

  /**
   * Returns active lab info if it exists
   * @returns {Object|null}
   */
  get activeLabInfo() {
    return this._activeStack && this._activeStack.lab;
  }

  /**
   * Starts timers for each lesson. Here's a simplest setTimeout method that creates a timer for each lesson.
   * @private
   */
  _startTimers() {
    this.schedule.forEach(lab => {
      const date = new Date(lab.date.split('.').reverse().join('-'));
      const time = lab.time.split(':');
      date.setHours(+time[0]);
      date.setMinutes(+time[1]);
      const now = new Date();

      const timer = date.getTime() - now.getTime() - this.config.noticeBeforeStart * 60000;
      console.log('timer', timer);

      if (timer > 0) {
        setTimeout(this._createStack.bind(this), timer, lab);
      }

      const inLesson = date.getTime() - now.getTime() + (this.config.timeOfLesson + this.config.noticeBeforeStart) * 60000 > 0;
      if (inLesson) {
        this._createStack(lab);
      }
    });
  }

  /**
   * Creates stack for a given lab object
   * @param {Lab} lab
   * @private
   */
  _createStack(lab) {
    console.log('start stack');
    this._activeStack = {
      stack: new Stack(this._maxCount),
      lab
    };

    setTimeout(this._closeStack.bind(this), (this.config.timeOfLesson + this.config.noticeBeforeStart) * 60000);
  }

  /**
   * Closes and deletes active stack
   * @private
   */
  _closeStack() {
    console.log('close stack');
    this._activeStack.stack.close();
    this._activeStack = {};
  }

}

module.exports = Scheduler;
