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
    this.trigger.push('First', 'Last', 'Random');
  }

  generateButtonsArray(stack) {
    const buttons = super.generateButtonsArray(stack);
    buttons.unshift(['First', 'Last', 'Random']);
    return buttons;
  }

  addUserToStack(context, stack, user, number) {
    if (context.isEqual(number, 'First')) {
      number = stack.getFirstEmptyNumber();
    } else if (context.isEqual(number, 'Last')) {
      number = stack.getLastEmptyNumber();
    } else if (context.isEqual(number, 'Random')) {
      number = stack.getRandomPosition();
    }
    super.addUserToStack(context, stack, user, number);
  }
}

module.exports = SelectPositionWithExtraButtonsState;
