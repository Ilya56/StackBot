/**
 * Class that represents user object in this system
 */
class User {

  /**
   * Constructs new instance
   * @param {UserDbHelper} userBdHelper
   * @param {Object} userData
   */
  constructor(userBdHelper, userData) {
    this._userBdHelper = userBdHelper;
    this._id = userData.id;
    this._state = userData.state;
    this._subscribed = userData.subscribed || false;
    this._isTeacher = userData.isTeacher || false;
    this._phone = userData.phone;
    this._name = userData.name;
  }

  /**
   * Returns user id
   * @returns {String}
   */
  get id() {
    return this._id;
  }

  /**
   * Returns current user state id
   * @returns {String}
   */
  get state() {
    return this._state;
  }

  /**
   * Saves new user state id
   * @param {String} state
   */
  set state(state) {
    this._state = state;
    this.save();
  }

  /**
   * Returns true if user is subscribed
   * @returns {Boolean}
   */
  get subscribed() {
    return this._subscribed;
  }

  /**
   * Saves new subscription check
   * @param {Boolean} subscribed
   */
  set subscribed(subscribed) {
    this._subscribed = subscribed;
    this.save();
  }

  /**
   * Returns true is user is teacher
   * @returns {Boolean}
   */
  get isTeacher() {
    return this._isTeacher;
  }

  /**
   * Returns user phone
   * @returns {String}
   */
  get phone() {
    return this._phone;
  }

  /**
   * Saves new user phone
   * @param {String} phone
   */
  set phone(phone) {
    this._phone = phone;
    this.save();
  }

  /**
   * Returns user name
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Saves new user name
   * @param {String} name
   */
  set name(name) {
    this._name = name;
    this.save();
  }

  /**
   * Save current user asynchronous
   * @returns {User}
   */
  save() {
    this._userBdHelper.saveUser(this._toSaveObj())
      .catch(err => console.error('Error while saving user state', err));
    return this;
  }

  /**
   * Mark user as teacher
   * @param {String} name teacher name
   */
  makeThisUserTeacher(name) {
    this._isTeacher = true;
    this._name = name;
    this.save();
  }

  /**
   * Returns user object to save it in db
   * @returns {User}
   * @private
   */
  _toSaveObj() {
    return {
      id: this._id,
      state: this._state,
      name: this._name,
      subscribed: this._subscribed,
      isTeacher: this._isTeacher,
      phone: this._phone
    }
  }

}

module.exports = User;
