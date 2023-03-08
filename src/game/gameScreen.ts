import Control from 'common/control';
import SceneManager from './sceneManager';
import PlayPanel from './playpanel/playPanel';
import MainMenu from './mainMenu';

import SettingsMenu from './settingsMenu1';
import EditorScreen from './editorScreen';
import Renderer from 'common/renderer';
import Vector from 'common/vector';
import Preloader from './preloader';

import Game from './core/game';

const names = `Lorem Ipsum Dolor Sit Amet Erat Morbi Lectus Finibus Mollis Mauris Eros Sed Felis Dabius Turpis Elemus Genus Proin Covan Grat Coin Jaggo Netus Inos Beler Ogos Frago`.split(
  ' ',
);
const colors = ['#fd434f', '#ffe00d', '#40d04f', '#007bff', '#7b5dfa', '#1abcff', '#f8468d', '#ff7a51'];

import { IPage } from "src/application/IPage";
import av1 from "../assets/avatar_1.jpg";
import av2 from "../assets/avatar_2.jpg";
import av3 from "../assets/avatar_3.jpg";
import Player from './core/player.js';
import { IKeyboardState } from './core/IKeyboardState.js';

const defaultGameConfig = {
  format: 'easycount',
  mapURL: './assets/bitmap3.png',

  nameList: names,
  colorList: colors,
  teams: [
      {
          name: 'Progers',
          avatar: av1,
          playersNumber: 1,
          playersHealts: 100,
          isComputer: false,
          color: '#fd434f',
      },
      {
          name: 'Killers',
          avatar: av2,
          playersNumber: 1,
          playersHealts: 50,
          isComputer: true,
          color: '#ffe00d',
      },
      {
          name: 'Cloners',
          avatar: av3,
          playersNumber: 1,
          playersHealts: 200,
          isComputer: true,
          color: '#40d04f',
      },
  ]
}
export default class GameScreen extends Control implements IPage{
  canvas: Control;
  context: CanvasRenderingContext2D;
  renderer: Renderer;
  panel: SceneManager;
  fps: number;
  preloader: Preloader;
  playPanel: PlayPanel;
  game: Game;
  editorScreen: EditorScreen;
  settings: SettingsMenu;
  allHealth: any;
  menu: MainMenu;
  keyboardState: IKeyboardState;

  constructor(parentNode:HTMLElement, config?:any) {
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

    this.playPanel = new PlayPanel(this.panel.node, this.panel, this.node, this.renderer);
    this.playPanel.openWeapon.onSelect = (index) => {
      this.game.getCurrentPlayer().setWeapon(index);
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
      this.game.onNext = (player: Player, timerSpan) => {
        this.playPanel.openWeapon.select(player.weapons.indexOf(player.currentWeapon), true);
        this.playPanel.windIndicator.node.textContent = this.game.wind.toFixed(2);
        this.playPanel.timeIndicator.setTimerDuration(timerSpan);
      }

      this.game.onFinish = () => {
        this.panel.selectByScene(this.menu);
        this.renderer.stop();
      };
      this.playPanel.teamIndicator.clear();
      this.game.start(defaultGameConfig, ()=>{
        this.game.teams.list.forEach((it, i) => {
          this.playPanel.teamIndicator.addTeam({ name: it.name, avatar: it.avatar || i, color: it.color });
        })
        this.renderer.start();
      });
    };

    this.settings = new SettingsMenu(this.panel.node, this.panel, defaultGameConfig);
    this.settings.map.onChange = (data) => {
      defaultGameConfig.mapURL = data.url;
    };
    this.panel.add(this.settings);
    this.menu.onSettings = () => {
      this.panel.selectByScene(this.settings);
    }


    this.settings.onEditor = () => {
      this.panel.selectByScene(this.editorScreen);
    }

    this.settings.onFight = (config) => {
      this.panel.selectByScene(this.playPanel);
      this.game = new Game();//newGame();
      this.game.onNext = (player) => {
        this.playPanel.openWeapon.select(player.weapons.indexOf(player.currentWeapon), true);
        this.playPanel.windIndicator.node.textContent = this.game.wind.toFixed(2);
      }

      this.game.onFinish = () => {
        this.panel.selectByScene(this.menu);
        this.renderer.stop();
      }
      defaultGameConfig.teams = config;

      this.game.start(defaultGameConfig, ()=>{
        this.playPanel.teamIndicator.clear();
        this.game.teams.list.forEach((it, i) => {
          this.playPanel.teamIndicator.addTeam({ name: it.name, avatar: it.avatar || i, color: it.color });
        })
        this.renderer.start();
      });
    }

    this.panel.selectByScene(this.preloader);

    this.renderer.onRenderFrame = (deltaTime) => {
      this.game.tick(deltaTime / 100);
      this.playPanel.timeIndicator.update(Math.trunc(this.game.timer.counter));

      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.game.render(this.context, deltaTime / 100);
      this.game.processKeyboard(this.context, this.keyboardState, deltaTime / 100);

      this.setTeamValues();
      this.getTeamIndicatorItems().forEach(it => {
        it.teamAvatar.render();
      });

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

  getTeamIndicatorItems() {
    let list = [];
    this.game.teams.list.forEach((it, i) => {
      let tm = this.playPanel.teamIndicator.teams.find(jt => jt.name == it.name);
      list.push(tm);
    });
    return list;
  }

  setTeamValues(){
    let allHealth = this.game.teams.getSumHealth();
    if (this.allHealth != allHealth) {
      this.allHealth = allHealth;
      this.game.teams.list.forEach((it, i) => {
        let tm = this.playPanel.teamIndicator.teams.find(jt => jt.name == it.name);
        tm.setHealth(100 * it.getSumHealth() / allHealth, '' + it.getSumHealth() + '&nbsp;/&nbsp;' + allHealth);
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

//module.exports = GameScreen;
