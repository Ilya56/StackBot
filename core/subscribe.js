class Subscribe {

  /**
   *
   * @param {String} storageFileName
   * @param {Scheduler} scheduler
   * @param {Bot} bot
   * @param {UserDbHelper} userDbHelper
   */
  constructor(storageFileName, scheduler, bot, userDbHelper) {
    this._storageFileName = storageFileName;
    this._scheduler = scheduler;
    this._bot = bot;
    this._userDbHelper = userDbHelper;
    this._subsribers = [];

    this.loadSubscribes().catch(e => console.error(`Failed while load subscribers from ${this._storageFileName} file`, e));

    this._scheduler.addOnStackStartListener('subscribe', this.onStackStart.bind(this));
  }

  async loadSubscribes() {
    const users = await this._userDbHelper.loadUsers();
    this._subsribers = users.filter(u => u.subscribed).map(u => u.id);
  }

  /**
   *
   * @param {User} user
   */
  subscribe(user) {
    this._subsribers.push(user.id);
    user.subscribed = true;
  }

  /**
   *
   * @param {User} user
   */
  unsubscribe(user) {
    this._subsribers = this._subsribers.filter(s => s !== user.id);
    user.subscribed = false
  }

  /**
   *
   * @param {String} userId
   * @returns {boolean}
   */
  isSubscribed(userId) {
    return !!this._subsribers.find(s => s === userId);
  }

  async onStackStart() {
    for (let subscriber of this._subsribers) {
      await this._bot.sendDirectMessage(subscriber, `Stack for ${this._scheduler.activeLabInfo.name} just created`);
    }
  }

}

module.exports = Subscribe;
