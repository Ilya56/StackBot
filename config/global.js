// global configs
module.exports = {
  noticeBeforeStart: 1,
  timeOfLesson: 120,
  token: '866752777:AAFcxuUZVjDfN_2qVkpo1euPmnyk_GEVqtU',
  allowedPhones: ['1234567890', '380679960862', '380951234567', '380983648921'],
  teachers: [{
    phone: '0987654321',
    name: 'teacher'
  }],
  adminId: '413296281'
}

/**
 * @typedef {Object} TeacherConfig
 * @property {String} phone
 * @property {String} name
 */

/**
 * @typedef {Object} GeneralConfig
 * @property {Number} noticeBeforeStart
 * @property {Number} timeOfLesson
 * @property {String} token
 * @property {String[]} allowedPhones
 * @property {TeacherConfig[]} teachers
 * @property {String} adminId
 */
