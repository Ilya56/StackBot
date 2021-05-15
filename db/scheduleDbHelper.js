const mongoose = require('mongoose');

class ScheduleDbHelper {

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

  get Lab() {
    return this._lab;
  }

  async saveMany(labs) {
    const result = await this._lab.insertMany(labs);
    if (!result.ok) {
      throw new Error('Error in mongoose while insert many labs');
    }
  }

  async checkRecordsExisted() {
    const lab = await this._lab.find({}).limit(1);
    return !!lab[0];
  }

  getAll() {
    return this._lab.find({});
  }

}

module.exports = ScheduleDbHelper;
