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

const globalConfig = require('./config/global');
const schedule = require('./config/schedule');

const tgBot = new Telegraf('866752777:AAFcxuUZVjDfN_2qVkpo1euPmnyk_GEVqtU');

const bot = new Bot(tgBot);
const scheduler = new Scheduler(30, globalConfig, schedule);
const subscribe = new Subscribe(path.join(__dirname, 'subscribers.json'), scheduler, bot);
const authState = new AuthState();
const menuState = new MenuState(subscribe, scheduler);
// const selectPositionState = new SelectPositionState(scheduler);
const selectPositionState = new SelectPositionWithExtraButtonsState(scheduler);
const stackState = new StackState(scheduler);

bot.addState(authState);
bot.addState(menuState);
bot.addState(selectPositionState);
bot.addState(stackState);
bot.initStates();

tgBot.launch();
