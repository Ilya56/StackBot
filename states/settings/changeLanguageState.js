const State = require("../../core/state");

class ChangeLanguageState extends State {

  constructor(id='change-language') {
    super(['En', 'Ru', 'Ua', 'Back'], id, false);
  }

  async onStart(context) {
    return context.sendButtons('Please select one of available languages',
      [['En', 'Ua', 'Ru'], ['Back']]);
  }

  async onData(context) {
    const message = context.getMessageText();
    if (context.isEqual(message, 'En')) {
      context.setLocale('en');
      await context.sendText('Language changed on English');
    } else if (context.isEqual(message, 'Ru')) {
      context.setLocale('ru');
      await context.sendText('Language changed on Russian');
    } else if (context.isEqual(message, 'Ua')) {
      context.setLocale('ua');
      await context.sendText('Language changed on Ukraine');
    }
    return 'settings';
  }
}

module.exports = ChangeLanguageState;
