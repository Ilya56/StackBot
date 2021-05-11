const { Telegraf } = require('telegraf');
const path = require('path');

const Bot = require('./bot/core');
const AuthState = require('./states/authState');
const SelectPositionState = require('./states/selectPositionState');
const StackState = require('./states/stackState');
const SelectPositionWithExtraButtonsState = require('./states/selectPositionWithExtraButtonsState');
const MenuState = require('./states/menuState');

const Scheduler = require('./core/scheduler');
const Subscribe = require('./core/subscribe')
const Auth = require('./core/auth');

const Database = require("./db/core");

const globalConfig = require('./config/global');
const schedule = require('./config/schedule');
const UserDbHelper = require("./db/userDbHelper");

const tgBot = new Telegraf(globalConfig.token);

!async function() {
  const database = new Database('mongodb://localhost:27017/stackBot');
  await database.init();
  const userDbHelper = new UserDbHelper();

  const bot = new Bot(tgBot);
  const auth = new Auth(bot, userDbHelper, globalConfig);
  const scheduler = new Scheduler(20, globalConfig, schedule);
  const subscribe = new Subscribe(path.join(__dirname, 'subscribers.json'), scheduler, bot, userDbHelper);

  const authState = new AuthState(auth);
  const menuState = new MenuState(subscribe, scheduler);
  // const selectPositionState = new SelectPositionState(scheduler);
  const selectPositionState = new SelectPositionWithExtraButtonsState(scheduler);
  const stackState = new StackState(scheduler);

  tgBot.use(auth.addUserContext);

  bot.addState(authState);
  bot.addState(menuState);
  bot.addState(selectPositionState);
  bot.addState(stackState);
  bot.initStates();

  tgBot.launch();
}();
