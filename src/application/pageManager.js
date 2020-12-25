const Control = require('common/control.js');
const AboutPage = require('./about/aboutPage.js');
const GamePage = require('./game/gamePage.js');

class PageManager extends Control{
  constructor(parentNode, config){
    super(parentNode);
    this.logo = new Control(this.node, 'h1', '', 'Logo');
    this.menu = new Control(this.node, 'div', '', 'типо меню навигации Игра / About');
    const gamePage = new GamePage();
    this.footer = new Control(this.node, 'div', '', 'типо футер, наши гитхабы');
  }
}

module.exports = PageManager;