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
   * @property {String} teacher teacher name
   * @property {String} room room number
   */

  /**
   * Create scheduler instance. No need to create it twice
   * @param {Number} maxCount
   * @param {Object} config
   * @param {ScheduleDbHelper} scheduleDbHelper
   */
  constructor(maxCount, config, scheduleDbHelper) {
    this._maxCount = maxCount;
    this._scheduleDbHelper = scheduleDbHelper;
    this.config = config;

    /**
     *
     * @type {{stack: Stack, lab: Lab}}
     * @private
     */
    this._activeStack = {};
    this._onStackStartListeners = {};
    this._onStackFinishListeners = {};
    this._schedule = [];

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
   * @returns {Lab|null}
   */
  get activeLabInfo() {
    return this._activeStack && this._activeStack.lab;
  }

  /**
   *
   * @param {String} id
   * @param {function(stack:Stack):void}listener
   */
  addOnStackStartListener(id, listener) {
    this._onStackStartListeners[id] = listener;
  }

  removeOnStackStartListener(id) {
    delete this._onStackStartListeners[id];
  }

  addOnStackFinishListener(id, listener) {
    this._onStackFinishListeners[id] = listener;
  }

  removeOnStackFinishListener(id) {
    delete this._onStackFinishListeners[id];
  }

  /**
   * Returns next lab info
   * @returns {Lab}
   */
  getInfoAboutNextLab() {
    const copy = Object.assign({}, this._schedule);
    copy.sort((a, b) => {
      if (a.date > b.date) {
        return a.date
      }
      if (a.date === b.date) {
        return a.time - b.time;
      }
      return b.date;
    });
    const now = new Date().toISOString();
    const currentDate = now.slice(0, now.indexOf('T')).split('-').reverse().join('.');
    const currentTime = now.slice(now.indexOf('T') + 1, now.indexOf('T') + 6);
    return copy.find(l => l.date >= currentDate && l.time >= currentTime);
  }

  /**
   * Starts timers for each lesson. Here's a simplest setTimeout method that creates a timer for each lesson.
   * @private
   */
  async _startTimers() {
    this._schedule = await this._scheduleDbHelper.getAll();
    this._schedule.forEach(lab => {
      const date = new Date(lab.date.split('.').reverse().join('-'));
      const time = lab.time.split(':');
      date.setHours(+time[0]);
      date.setMinutes(+time[1]);
      const now = new Date();

      const timer = date.getTime() - now.getTime() - this.config.noticeBeforeStart * 60000;

      if (timer > 0) {
        setTimeout(this._createStack.bind(this), timer, lab);
      }

      const inLesson = timer < 0 &&
        date.getTime() - now.getTime() + (this.config.timeOfLesson + this.config.noticeBeforeStart) * 60000 > 0;
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
    console.debug('start stack');
    this._activeStack = {
      stack: new Stack(this._maxCount),
      lab
    };

    setTimeout(this._closeStack.bind(this), (this.config.timeOfLesson + this.config.noticeBeforeStart) * 60000);

    for (let listener of Object.values(this._onStackStartListeners)) {
      listener(this._activeStack);
    }
  }

  /**
   * Closes and deletes active stack
   * @private
   */
  _closeStack() {
    console.debug('close stack');

    for (let listener of Object.values(this._onStackFinishListeners)) {
      listener(this._activeStack);
    }

    this._activeStack.stack.close();
    this._activeStack = {};
  }

}

module.exports = Scheduler;
