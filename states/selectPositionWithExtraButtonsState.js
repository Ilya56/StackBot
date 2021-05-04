const SelectPositionState = require("./selectPositionState");

/**
 * Adds to the select position class the quick selection buttons, namely the selection of the first free position,
 * the last free and random free position
 */
class SelectPositionWithExtraButtonsState extends SelectPositionState {

  /**
   * Creates select position with extra buttons state
   * @param {Scheduler} scheduler scheduler class instance
   * @param {String} [id='select-position'] state id
   */
  constructor(scheduler, id='select-position') {
    super(scheduler, id);
    this.trigger = [this.trigger];
    this.trigger.push('First', 'Last', 'Random');
  }

  generateButtonsArray(stack) {
    const buttons = super.generateButtonsArray(stack);
    buttons.unshift(['First', 'Last', 'Random']);
    return buttons;
  }

  addUserToStack(stack, user, number) {
    if (number === 'First') {
      number = stack.getFirstEmptyNumber();
    } else if (number === 'Last') {
      number = stack.getLastEmptyNumber();
    } else if (number === 'Random') {
      number = stack.getRandomPosition();
    }
    super.addUserToStack(stack, user, number);
  }
}

module.exports = SelectPositionWithExtraButtonsState;
