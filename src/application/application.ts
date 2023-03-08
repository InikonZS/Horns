import Control from 'common/control';
import PageManager from './pageManager';
import GameScreen from 'game/gameScreen';
import AboutScreen from './about/aboutPage';
import AnotherScreen from './another/anotherPage';

class Application extends Control {
  pageManager: PageManager;
  gameScreen: GameScreen;
  aboutScreen: AboutScreen;
  footer: Control;

  constructor(parentNode:HTMLElement, config?:any) {
    super(parentNode);
    // this.logo = new Control(this.node, 'div', 'logo', 'Horns');
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

export default Application;