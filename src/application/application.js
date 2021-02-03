const Control = require('common/control.js');
const PageManager = require('./pageManager.js');
const GameScreen = require('game/gameScreen.js');
const AboutScreen = require('./about/aboutPage.js');
const AnotherScreen = require('./another/anotherPage.js');

class Application extends Control {
  constructor(parentNode, config) {
    super(parentNode);
    this.logo = new Control(this.node, 'div', 'logo', 'Horns');
    this.pageManager = new PageManager(this.node, 'navi');
    this.gameScreen = new GameScreen(this.node);
    this.pageManager.add(this.gameScreen, 'Game');
    this.aboutScreen = new AboutScreen(this.node);
    this.pageManager.add(this.aboutScreen, 'About');

    this.pageManager.select(0);
    //<a href="https://github.com/InikonZS">Inikon</a>
    this.footer = new Control(this.node, 'div', 'footer',
    `
    <div class="footer-links-wrapper">
      © 2021
      <a href="https://github.com/InikonZS">Inikon</a>
      <a href="https://github.com/snegurova">Inna Snegurova</a>
      <a href="https://github.com/General-m">General-m</a>
    </div>
    <div class="rss-logo"><a href="https://rs.school/js/"><img src="./assets/rs-logo.png"></a>
    </div>
    `);

  }
}

module.exports = Application;