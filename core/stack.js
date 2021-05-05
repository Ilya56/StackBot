/**
 * This class represents a queue of students
 */
class Stack {

  /**
   * Creates new stack
   * @param {Number} maxCount max number of students
   */
  constructor(maxCount) {
    this._maxCount = maxCount;
    this.active = true;
    /**
     *
     * @type {{number:Number, user:UserData}[]}
     * @private
     */
    this._stack = [];
    for (let i = 0; i < maxCount; i++) {
      this._stack[i] = {
        number: String(i + 1),
        user: null
      }
    }
  }

  /**
   * Returns max number of students
   * @returns {Number}
   */
  get maxCount() {
    return this._maxCount;
  }

  /**
   * Returns this stack object
   * @returns {{number: Number, user: UserData}[]}
   */
  get stack() {
    return this._stack;
  }

  /**
   * Returns true if user is on stack
   * @param {String} userId user id
   * @returns {boolean}
   */
  isRegistered(userId) {
    return !!this._stack.find(s => s.user && s.user.id === +userId);
  }

  /**
   * Close this stack
   */
  close() {
    this.active = false;
    delete this._stack;
  }

  /**
   * Add user to stack
   * @param {UserData} user user data
   * @param {Number|String} number number in stack
   */
  addUser(user, number) {
    number = +number;
    if (number <= 0 || number > this._maxCount) {
      throw new Error('invalid number range');
    }
    if (number) {
      this._stack[number - 1].user = user;
    } else {
      throw new Error('Stack.addUser: Invalid number argument');
    }
  }

  /**
   * Remove user from stack
   * @param {String} userId user id
   */
  removeUser(userId) {
    const userPos = this._stack.find(s => s.user && s.user.id === +userId);
    delete userPos.user;
  }

  /**
   * Returns stack as multiple string
   * @returns {String}
   */
  getStackAsString() {
    let result = '';
    let j = 0;
    for (let i = 0; i < this._maxCount; i++) {
      const user = this._stack[i].user;
      if (user) {
        result += `${++j}. ${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` +
          `${user.username ? ` (@${user.username})` : ` ([${user.first_name}](tg://user?id=${user.id}))`}\n`
      }
    }
    result = result || 'Stack is empty';
    return result;
  }

  /**
   * Returns first empty number in this stack
   * @returns {Number}
   */
  getFirstEmptyNumber() {
    return this._stack.find(s => !s.user).number;
  }

  /**
   * Returns last empty number in this stack
   * @returns {Number}
   */
  getLastEmptyNumber() {
    return this._stack.slice().reverse().find(s => !s.user).number;
  }

  /**
   * Returns random empty number in this stack
   * @returns {Number}
   */
  getRandomPosition() {
    const emptyPositions = this._stack.filter(s => !s.user);
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)].number;
  }

}

module.exports = Stack;
