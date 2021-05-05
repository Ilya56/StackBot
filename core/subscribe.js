const fs = require('fs-extra');

class Subscribe {

  /**
   *
   * @param {String} storageFileName
   * @param {Scheduler} scheduler
   * @param {Bot} bot
   */
  constructor(storageFileName, scheduler, bot) {
    this._storageFileName = storageFileName;
    this._scheduler = scheduler;
    this._bot = bot;
    this._subsribers = [];

    this.loadSubscribes().catch(e => console.error(`Failed while load subscribers from ${this._storageFileName} file`, e));

    this._scheduler.addOnStackStartListener('subscribe', this.onStackStart.bind(this));
  }

  async loadSubscribes() {
    const exists = await fs.exists(this._storageFileName);
    if (exists) {
      this._subsribers = await fs.readJson(this._storageFileName);
    }
  }

  async saveSubscribers() {
    try {
      await fs.writeJson(this._storageFileName, this._subsribers);
    } catch (e) {
      console.error(`Failed while save subscribers to ${this._storageFileName} file`, e)
    }
  }

  /**
   *
   * @param {String} userId
   */
  subscribe(userId) {
    console.log('subscribed');
    this._subsribers.push(userId);
    this.saveSubscribers();
  }

  /**
   *
   * @param {String} userId
   */
  unsubscribe(userId) {
    console.log('unsubscribed');
    this._subsribers = this._subsribers.filter(s => s !== userId);
    this.saveSubscribers();
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
