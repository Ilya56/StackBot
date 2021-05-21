const State = require("../core/state");

class SettingsState extends State {

  constructor(id='settings') {
    super(['Change display name', 'Change language', 'Back'], id, false);
  }

  async onStart(context) {
    return context.sendButtons('You can change the display name or language of the bot',
      [['Change display name', 'Change language'], ['Back']]);
  }

  async onData(context) {
    const message = context.getMessageText();
    if (context.isEqual(message, 'Change display name')) {
      return 'change-name';
    } else if (context.isEqual(message, 'Change language')) {
      return 'change-language';
    } else if (context.isEqual(message, 'Back')) {
      return 'menu';
    }
  }
}

module.exports = SettingsState;
