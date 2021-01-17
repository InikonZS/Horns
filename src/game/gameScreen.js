const Control = require('common/control.js');
const SceneManager = require('./sceneManager.js');
const PlayPanel = require('./playPanel.js');
const MainMenu = require('./mainMenu.js');

const SettingsMenu = require('./settingsMenu1.js');
const EditorScreen = require('./editorScreen.js');
const Renderer = require('common/renderer.js');
const Vector = require('common/vector.js');
const Preloader = require('./preloader.js');

const Game = require('./core/game.js');

const names = `Lorem Ipsum Dolor Sit Amet Erat Morbi Lectus Finibus Mollis Mauris Eros Sed Felis Dabius Turpis Elemus Genus Proin Covan Grat Coin Jaggo Netus Inos Beler Ogos Frago`.split(
  ' ',
);
const colors = ['#fd434f', '#ffe00d', '#40d04f', '#007bff', '#7b5dfa', '#1abcff', '#f8468d', '#ff7a51'];

const defaultGameConfig = {
  format: 'easycount',
  mapURL: './assets/bitmap3.png',
  nameList: names,
  colorList: colors,
  teams: [
    {
      name: 'Progers',
      avatar: 'PG',
      playersNumber: 1,
      playersHealts: 100,
      isComputer: false,
    },
    {
      name: 'Killers',
      avatar: 'KI',
      playersNumber: 1,
      playersHealts: 50,
      isComputer: true,
    },
    {
      name: 'Cloners',
      avatar: 'CR',
      playersNumber: 1,
      playersHealts: 200,
      isComputer: true,
    },
  ],
};

class GameScreen extends Control {
  constructor(parentNode, config) {
    super(parentNode, 'div', 'gamescreen_wrapper');
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.style.position = 'absolute';
    this.autoSize();
    this.context = this.canvas.node.getContext('2d');
    this.renderer = new Renderer();
    this.panel = new SceneManager(this.node);

    this.fps = 0;

    this.preloader = new Preloader(this.panel.node);
    this.panel.add(this.preloader);
    this.preloader.onStart = () => {
      this.panel.selectByScene(this.menu);
    };

    this.playPanel = new PlayPanel(this.panel.node, this.panel);
    this.playPanel.openWeapon.onSelect = (index) => {
      this.game.currentTeam.currentPlayer.setWeapon(index);
    };
    this.playPanel.onBack = () => {
      this.game.onFinish();
    };
    this.panel.add(this.playPanel);

    this.editorScreen = new EditorScreen(this.panel.node, this.panel);
    this.editorScreen.onSave = (dataURL) => {
      defaultGameConfig.mapURL = dataURL;
    };
    this.panel.add(this.editorScreen);

    this.menu = new MainMenu(this.panel.node);
    this.panel.add(this.menu);

    this.menu.onEditor = () => {
      this.panel.selectByScene(this.editorScreen);
    };

    this.menu.onFight = () => {
      this.panel.selectByScene(this.playPanel);
      this.game = new Game();
      this.game.onNext = (player, timerSpan) => {
        this.playPanel.openWeapon.select(player.weapons.indexOf(player.currentWeapon), true);
        this.playPanel.windIndicator.node.textContent = this.game.wind.toFixed(2);
        this.playPanel.timeIndicator.setTimerDuration(timerSpan);
      }

      this.game.onFinish = () => {
        this.panel.selectByScene(this.menu);
        this.renderer.stop();
      };

      this.game.start(defaultGameConfig);
      this.playPanel.teamIndicator.clear();
      this.game.teams.list.forEach((it, i) => {
        this.playPanel.teamIndicator.addTeam({ name: it.name, avatar: it.avatar || i, color: colors[i] });
      })

      this.renderer.start();
    };
    
    this.settings = new SettingsMenu(this.panel.node, this.panel);
    this.panel.add(this.settings);
    this.menu.onSettings = () => {
      this.panel.selectByScene(this.settings);
    };

    this.panel.selectByScene(this.preloader);

    this.renderer.onRenderFrame = (deltaTime) => {
      this.game.tick(deltaTime / 100);
      this.playPanel.timeIndicator.update(Math.trunc(this.game.timer.counter));

      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.game.render(this.context, deltaTime / 100);
      this.game.processKeyboard(this.context, this.keyboardState, deltaTime / 100);
      
      this.setTeamValues();

      let averager = 128;
      this.fps = (this.fps * (averager - 1) + deltaTime) / averager;
      this.playPanel.windIndicator.node.textContent = this.game.wind.toFixed(2) + ' ' + (1 / this.fps * 1000).toFixed(2);
    }

    this.keyboardState = {};
    window.addEventListener('keydown', (ev) => {
      this.keyboardState[ev.code] = true;
    });

    window.addEventListener('keyup', (ev) => {
      this.keyboardState[ev.code] = false;
    });

    window.addEventListener('resize', () => {
      this.autoSize();
    });
  }

  setTeamValues(){
    let allHealth = this.game.teams.getSumHealth();
    if (this.allHealth != allHealth) {
      this.allHealth = allHealth;
      this.game.teams.list.forEach((it, i) => {
        let tm = this.playPanel.teamIndicator.teams.find(jt => jt.name == it.name);
        tm.setHealth(100 * it.getSumHealth() / allHealth, '' + it.getSumHealth() + '/' + allHealth);
      });
    }
  }

  autoSize() {
    let scaler = 1.4;
    this.canvas.node.height = this.node.clientHeight / scaler;
    this.canvas.node.width = this.node.offsetWidth / scaler;
    this.canvas.node.style.width = '100%';
    this.canvas.node.style.height = '100%';
  }
}

module.exports = GameScreen;
