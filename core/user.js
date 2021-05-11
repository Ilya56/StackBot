class User {

  constructor(userBdHelper, userData) {
    this._userBdHelper = userBdHelper;
    this._id = userData.id;
    this._state = userData.state;
    this._subscribed = userData.subscribed || false;
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

  save() {
    this._userBdHelper.saveUser(this._toSaveObj())
      .catch(err => console.error('Error while saving user state', err));
    return this;
  }

  _toSaveObj() {
    return {
      id: this._id,
      state: this._state,
      subscribed: this._subscribed
    }
  }

}

module.exports = User;
