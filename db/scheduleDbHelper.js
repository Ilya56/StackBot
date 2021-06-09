const mongoose = require('mongoose');

/**
 * Scheduler db model representation
 */
class ScheduleDbHelper {

  /**
   * Creates new schedule database helper
   */
  constructor() {
    this._schema = new mongoose.Schema({
      _id: String,
      date: String,
      time: String,
      eachWeek: String,
      name: String,
      teacher: String,
      room: String
    });
    this._lab = mongoose.model('Lab', this._schema);
  }

  /**
   * Returns lab mongoose document
   * @returns {Model<Document>}
   * @constructor
   */
  get Lab() {
    return this._lab;
  }

  /**
   * Saves many labs objects
   * @param {Lab[]} labs labs object in array
   * @returns {Promise<void>}
   */
  async saveMany(labs) {
    const result = await this._lab.insertMany(labs);
    if (!result.ok) {
      throw new Error('Error in mongoose while insert many labs');
    }
  }

  /**
   * Returns true if at least on lab exists in db
   * @returns {Promise<boolean>}
   */
  async checkRecordsExisted() {
    const lab = await this._lab.find({}).limit(1);
    return !!lab[0];
  }

  /**
   * Returns list of all labs
   * @returns {Promise<Lab[]>}
   */
  getAll() {
    return this._lab.find({});
  }

}

module.exports = ScheduleDbHelper;
