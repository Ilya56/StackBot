const request = require('request-promise');

class KpiSchedule {

  /**
   * @typedef {Object} kpiScheduleConfig
   * @property {String} type unique for objects that can expire
   * @property {Boolean} periodic if true data will be loaded periodic
   * @property {Number} periodInDays period of update data in days
   */

  /**
   *
   * @param {Object} config
   * @param {ScheduleDbHelper} scheduleDbHelper
   * @param {ExpirationDbHelper} expirationDbHelper
   */
  constructor(config, scheduleDbHelper, expirationDbHelper) {
    this._config = config;
    this._scheduleDbHelper = scheduleDbHelper;
    this._expirationDbHelper = expirationDbHelper;
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async execute() {
    const type = this._config.type || 'kpiSchedule';
    const updatedPeriodic = this._config.periodic;
    if (updatedPeriodic) {
      if (await this._expirationDbHelper.isExpired(type)) {
        await this._loadAndSave();
        const period = this._config.periodInDays || 30;
        await this._expirationDbHelper.updateExpire(type, new Date(Date.now() + period * 24 * 60 * 60 * 1000));
      }
    } else {
      const existed = await this._scheduleDbHelper.checkRecordsExisted();
      if (!existed) {
        await this._loadAndSave();
      }
    }
  }

  async _loadAndSave() {
    const labs = await this._loadSchedule();
    await this._scheduleDbHelper.saveMany(labs);
  }

  /**
   * @typedef {Object} Lesson
   * @property {String} lesson_full_name
   * @property {String} lesson_name
   * @property {String} lesson_type
   * @property {String} teacher_name
   * @property {String} time_start
   * @property {String} lesson_week
   * @property {String} day_number
   * @property {String} lesson_room
   */

  /**
   *
   * @returns {Promise<Lesson[]>}
   * @private
   */
  async _loadSchedule() {
    try {
      /**
       * @type {{data: Lesson[]}}
       */
      const data = await request({
        uri: encodeURI(`${this._config.url}/v2/groups/${this._config.groupName}/lessons`),
        json: true
      });

      const result = [];
      for (let lesson of (data || {}).data || []) {
        if (lesson.lesson_type === this._config.typeLab) {

          const eachWeek = !!data.data.find(l => l.lesson_full_name === lesson.lesson_full_name &&
            l.teacher_name === lesson.teacher_name && l.lesson_type === lesson.lesson_type &&
            l.time_start === lesson.time_start && l.lesson_week !== lesson.lesson_week);

          const dayOfWeek = lesson.day_number;
          const dayDate = new Date();
          dayDate.setDate(dayDate.getDate() + dayOfWeek - dayDate.getDay() - 14);

          result.push({
            date: `${this._makeTwoDigit(dayDate.getDate())}.${this._makeTwoDigit(dayDate.getMonth())}.${dayDate.getFullYear()}`,
            time: lesson.time_start.slice(0, 5),
            eachWeek: eachWeek ? 'one' : 'two',
            name: lesson.lesson_name,
            teacher: lesson.teacher_name,
            room: lesson.lesson_room
          });
        }
      }

      return result;
    } catch (e) {
      console.error('Cannot load data from KPI schedule', e);
    }
  }

  /**
   * Make number or string two digit
   * @param {String|Number}number
   * @returns {String}
   * @private
   */
  _makeTwoDigit(number) {
    return String(number).length === 1 ? `0${number}` : String(number);
  }

}

module.exports = KpiSchedule;
