const Control = require('common/control.js');
const PageManager = require('./pageManager.js');
const GameScreen = require('game/gameScreen.js');
const AboutScreen = require('./about/aboutPage.js');
const AnotherScreen = require('./another/anotherPage.js');

class Application extends Control {
  constructor(parentNode, config) {
    super(parentNode);
    // this.pageManager = new PageManager(parentNode);
    this.logo = new Control(this.node, 'div', 'logo', 'Horns');
    //this.menu = new Control(this.node, 'div', 'navi', 'типо меню навигации Игра / About');
    //const gamePage = new GamePage();
    this.pageManager = new PageManager(this.node, 'navi');
    this.gameScreen = new GameScreen(this.node);
    this.pageManager.add(this.gameScreen, 'Game');
    this.aboutScreen = new AboutScreen(this.node);
    this.pageManager.add(this.aboutScreen, 'About');
    this.anotherScreen = new AnotherScreen(this.node);
    this.pageManager.add(this.anotherScreen, 'Something');

    this.pageManager.select(0);
    //<a href="https://github.com/InikonZS">Inikon</a>
    this.footer = new Control(this.node, 'div', 'footer', 'Inikon');

  }
}

module.exports = Application;