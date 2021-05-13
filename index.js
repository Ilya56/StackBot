const { Telegraf } = require('telegraf');
const path = require('path');

const Bot = require('./bot/core');
const Scheduler = require('./core/scheduler');
const Subscribe = require('./core/subscribe')
const Auth = require('./core/auth');

const AuthState = require('./states/authState');
const SelectPositionState = require('./states/selectPositionState');
const StackState = require('./states/stackState');
const SelectPositionWithExtraButtonsState = require('./states/selectPositionWithExtraButtonsState');
const MenuState = require('./states/menuState');

const Database = require('./db/core');
const UserDbHelper = require('./db/userDbHelper');
const ScheduleDbHelper = require('./db/scheduleDbHelper');
const ExpirationDbHelper = require("./integration/expirationDbHelper");

const KpiSchedule = require("./integration/kpiSchedule");

const globalConfig = require('./config/global');
const kpiConfig = require('./config/kpiSchedule');

const tgBot = new Telegraf(globalConfig.token);

!async function() {
  try {
    // init db
    const database = new Database('mongodb://localhost:27017/stackBot');
    await database.init();
    const userDbHelper = new UserDbHelper();
    const scheduleDbHelper = new ScheduleDbHelper();
    const expirationDbHelper = new ExpirationDbHelper();

    // init services
    const bot = new Bot(tgBot);
    const auth = new Auth(bot, userDbHelper, globalConfig);

    const kpiSchedule = new KpiSchedule(kpiConfig, scheduleDbHelper, expirationDbHelper);
    await kpiSchedule.execute();

    const scheduler = new Scheduler(20, globalConfig, scheduleDbHelper);
    const subscribe = new Subscribe(path.join(__dirname, 'subscribers.json'), scheduler, bot, userDbHelper);

    // init states
    const authState = new AuthState(auth);
    const menuState = new MenuState(subscribe, scheduler);
    // const selectPositionState = new SelectPositionState(scheduler);
    const selectPositionState = new SelectPositionWithExtraButtonsState(scheduler);
    const stackState = new StackState(scheduler);

    // use middlewares
    tgBot.use(auth.addUserContext);

    // add states to bot context
    bot.addState(authState);
    bot.addState(menuState);
    bot.addState(selectPositionState);
    bot.addState(stackState);
    bot.initStates();

    // start
    tgBot.launch();
  } catch (e) {
    console.error('Error while loading bot', e);
  }
}();
