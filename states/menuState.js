const State = require("../core/state");

/**
 * Main menu state
 */
class MenuState extends State {

  /**
   * Creates menu state
   * @param {Subscribe} subscribe subscribe class instance
   * @param {Scheduler} scheduler scheduler class instance
   * @param {String} [id='menu'] state id
   */
  constructor(subscribe, scheduler, id='menu') {
    super(['Select position in stack', 'About lab', 'Subscribe', 'Unsubscribe', 'Change name to display'], id, false);
    this._subscribe = subscribe;
    this._scheduler = scheduler;
  }

  /**
   * Offers to learn more about the lab, subscribe to stack creation notifications and select a position in the current queue
   * @param context
   * @returns {Promise}
   */
  async onStart(context) {
    return context.sendButtons('How can I help you?', this.getButtons(context.getUserId()));
  }

  getButtons(userId) {
    let buttons = [['Select position in stack'], ['About lab']];
    // let buttons = [['Select position in stack'], ['About lab'], ['Change name to display']];
    if (this._subscribe.isSubscribed(userId)) {
      buttons[1].push('Unsubscribe');
    } else {
      buttons[1].push('Subscribe');
    }
    return buttons;
  }

  async onData(context) {
    const message = context.getMessageData().text;
    const userId = context.getUserId();
    if (message === 'Select position in stack') {
      return 'select-position';
    } else if (message === 'About lab') {
      await context.sendButtons(this.getInfoAsString(), this.getButtons(userId));
      return 'menu';
    } else if (message === 'Subscribe') {
      if (this._subscribe.isSubscribed(userId)) {
        await context.sendButtons('You are already subscribed', this.getButtons(userId));
      } else {
        this._subscribe.subscribe(context.getUser());
        await context.sendText('Subscribed!');
        return 'menu';
      }
    } else if (message === 'Unsubscribe') {
      if (this._subscribe.isSubscribed(userId)) {
        this._subscribe.unsubscribe(context.getUser());
        await context.sendText('Unsubscribed!');
        return 'menu';
      } else {
        await context.sendButtons('You are already unsubscribed', this.getButtons(userId));
      }
    // } else if (message === 'Change name to display') {
    //   return 'change-name';
    }
  }

  getInfoAsString() {
    let info = this._scheduler.activeLabInfo;
    if (info) {
      return `Lab name: ${info.name}\nTeacher: ${info.teacher}\nRoom: ${info.room}\n` +
        `Started at ${info.date} ${info.time}\nIt takes place ${info.eachWeek} time for a week`;
    } else {
      info = this._scheduler.getInfoAboutNextLab();
      if (info) {
        return `Now there is no active lab. The next lab is ${info.name} at ${info.date} ${info.time}`;
      } else {
        return 'There is no next lab'
      }
    }
  }
}

module.exports = MenuState;
