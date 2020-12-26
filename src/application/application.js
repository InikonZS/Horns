const Control = require('common/control.js');
const PageManager = require('./pageManager.js');
const GameScreen = require('game/gameScreen.js');

class Application extends Control{
  constructor(parentNode, config){
    super(parentNode);
    // this.pageManager = new PageManager(parentNode);
    this.logo = new Control(this.node, 'h1', '', 'Logo');
    this.menu = new Control(this.node, 'div', '', 'типо меню навигации Игра / About');
    //const gamePage = new GamePage();
    this.gameScreen = new GameScreen(this.node);
    this.footer = new Control(this.node, 'div', '', 'типо футер, наши гитхабы');
    
  }
}

module.exports = Application;