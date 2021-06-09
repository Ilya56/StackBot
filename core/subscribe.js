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
    this._scheduler.subscribe = this;
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

  /**
   * Sends message that new stack is started
   * @returns {Promise<void>}
   */
  async onStackStart() {
    for (let subscriber of this._subsribers) {
      await this._bot.sendDirectMessage(subscriber, `Stack for ${this._scheduler.activeLabInfo.name} just created`);
    }
  }

  /**
   * Calls user to teacher
   * @param {User} user user to call
   * @returns {Promise<void>}
   */
  async callUser(user) {
    if (this._subsribers.includes(String(user.id))) {
      await this._bot.sendDirectMessage(user.id, `It's your turn, go to the teacher`);
    }
  }

}

module.exports = Subscribe;
