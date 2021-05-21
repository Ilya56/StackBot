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
  constructor(subscribe, scheduler, id = 'menu') {
    super(['Select position in stack', 'About lab', 'Subscribe', 'Unsubscribe', 'Settings'], id, false);
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
    let buttons = [['Select position in stack'], ['About lab', 'Settings']];
    // let buttons = [['Select position in stack'], ['About lab'], ['Change name to display']];
    if (this._subscribe.isSubscribed(userId)) {
      buttons[1].push('Unsubscribe');
    } else {
      buttons[1].push('Subscribe');
    }
    return buttons;
  }

  async onData(context) {
    const message = context.getMessageText();
    const userId = context.getUserId();
    if (context.isEqual(message, 'Select position in stack')) {
      return 'select-position';
    } else if (context.isEqual(message, 'About lab')) {
      await context.sendButtons(this.getInfoAsString(), this.getButtons(userId));
      return 'menu';
    } else if (context.isEqual(message, 'Subscribe')) {
      if (this._subscribe.isSubscribed(userId)) {
        await context.sendButtons('You are already subscribed', this.getButtons(userId));
      } else {
        this._subscribe.subscribe(context.getUser());
        await context.sendText('Subscribed!');
        return 'menu';
      }
    } else if (context.isEqual(message, 'Unsubscribe')) {
      if (this._subscribe.isSubscribed(userId)) {
        this._subscribe.unsubscribe(context.getUser());
        await context.sendText('Unsubscribed!');
        return 'menu';
      } else {
        await context.sendButtons('You are already unsubscribed', this.getButtons(userId));
      }
    } else if (context.isEqual(message, 'Settings')) {
      return 'settings';
    }
  }

  getInfoAsString() {
    let info = this._scheduler.activeLabInfo;
    if (info) {
      return {
        message: 'Current lab info',
        context: info.toObject()
      };
    } else {
      info = this._scheduler.getInfoAboutNextLab();
      if (info) {
        return {
          message: 'Now there is no active lab',
          context: info.toObject()
        };
      } else {
        return 'There is no next lab'
      }
    }
  }
}

module.exports = MenuState;
