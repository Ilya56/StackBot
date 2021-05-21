const State = require("../../core/state");

class ChangeNameState extends State {

  constructor(id='change-name') {
    super(/^([А-Яа-яёЁІіЇїЄєA-Za-z]+)( ([А-Яа-яёЁІіЇїЄєA-Za-z]+)( ([А-Яа-яёЁІіЇїЄєA-Za-z]+))?)?$/, id, false);
  }

  async onStart(context) {
    return context.sendText('Please type new display name');
  }

  async onData(context) {
    const newName = context.getMessageText();
    context.getUser().name = newName;
    await context.sendText({message: 'New name saved', context: {newName}});
    return 'settings';
  }
}

module.exports = ChangeNameState;
