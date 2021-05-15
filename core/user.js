class User {

  constructor(userBdHelper, userData) {
    this._userBdHelper = userBdHelper;
    this._id = userData.id;
    this._state = userData.state;
    this._subscribed = userData.subscribed || false;
    this._isTeacher = userData.isTeacher || false;
    this._phone = userData.phone;

    this.name = userData.name;
  }

  get id() {
    return this._id;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
    this.save();
  }

  get subscribed() {
    return this._subscribed;
  }

  set subscribed(subscribed) {
    this._subscribed = subscribed;
    this.save();
  }

  get isTeacher() {
    return this._isTeacher;
  }

  get phone() {
    return this._phone;
  }

  save() {
    this._userBdHelper.saveUser(this._toSaveObj())
      .catch(err => console.error('Error while saving user state', err));
    return this;
  }

  makeItTeacher(name) {
    this._isTeacher = true;
    this.name = name;
    this.save();
  }

  /**
   *
   * @returns {User}
   * @private
   */
  _toSaveObj() {
    return {
      id: this._id,
      state: this._state,
      name: this.name,
      subscribed: this._subscribed,
      isTeacher: this._isTeacher,
      phone: this._phone
    }
  }

}

module.exports = User;
