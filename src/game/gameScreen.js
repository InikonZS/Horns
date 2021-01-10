const Control = require('common/control.js');
const SceneManager = require('./sceneManager.js');
const PlayPanel = require('./playPanel.js');
const MainMenu = require('./mainMenu.js');

const SettingsMenu = require('./settingsMenu.js');
//const EditorMenu = require('./editorMenu.js');
const EditorScreen = require('./editorScreen.js');
const Renderer = require('common/renderer.js');
const Vector = require('common/vector.js');
const Preloader = require('./preloader.js');

const Team = require('./core/team.js');
const Game = require('./core/game.js');
const Player = require('./core/player.js');
const { Physical } = require('./core/primitives.js');

const names = 'Lorem Ipsum Dolor Sit Amet Erat Morbi Lectus Finibus Mollis Mauris Eros Sed Felis Dabi     us Turpis Elemus Genus Proin Covan Grat Coin Jaggo Netus Inos Beler Ogos Frago'.split(' ');
const colors = ['#f00', '#fc0', '#090', '#00f', '#909', '#099'];

const defaultGameConfig = {
  format: 'easycount',
  mapURL: './assets/bitmap3.png',
  nameList: names,
  colorList: colors,
  teams:[
    {
      name: 'Progers',
      avatar: 'PG',
      playersNumber: 1,
      playersHealts: 100,
    },
    {
      name: 'Killers',
      avatar: 'KI',
      playersNumber: 1,
      playersHealts: 50,
    },
    {
      name: 'Cloners',
      avatar: 'CR',
      playersNumber: 1,
      playersHealts: 200,
    },
  ]
}
/*function newGame(){
  //let colors = ['#f00', '#fc0', '#090', '#00f', '#909'];
  let game = new Game();
  for (let j = 0; j < 4; j++) {
    let team = new Team('team' + j);
    for (let i = 0; i < 4; i++) {
      let pl = new Player(names[i + j * 2], 100, new Vector(Math.random() * 700 + 50, Math.random() * 500 + 50), colors[j]);
      team.addPlayer(pl);
    }
    game.addTeam(team);
  }
  return game;
}*/

class GameScreen extends Control {
  constructor(parentNode, config) {
    super(parentNode, 'div', 'gamescreen_wrapper');
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.style.position = 'absolute';
    this.autoSize();

    // this.canvas.node.addEventListener('click', (e) => {
    //   console.log(e);
    //   this.game.currentTeam.currentPlayer.createTargetPoint(e);
    // });

    this.context = this.canvas.node.getContext('2d');
    this.renderer = new Renderer();
    this.panel = new SceneManager(this.node);

    this.fps =0;


    this.preloader = new Preloader(this.panel.node);
    this.panel.add(this.preloader);
    this.preloader.onStart = () => {
      this.panel.selectByScene(this.menu);
    }

    this.playPanel = new PlayPanel(this.panel.node, this.panel);
    this.playPanel.openWeapon.onSelect = index => {
      this.game.currentTeam.currentPlayer.setWeapon(index);
    }
    this.playPanel.onBack = ()=>{
      this.game.onFinish();
    }
    this.panel.add(this.playPanel);

    this.editorScreen = new EditorScreen(this.panel.node, this.panel);
    this.editorScreen.onSave = (dataURL)=>{
      defaultGameConfig.mapURL = dataURL;
    }
    this.panel.add(this.editorScreen);

    this.menu = new MainMenu(this.panel.node);
    this.panel.add(this.menu);

    this.menu.onEditor = () =>{
      this.panel.selectByScene(this.editorScreen);
    }

    this.menu.onFight = () =>{
      this.panel.selectByScene(this.playPanel);
      this.game = new Game();//newGame();
      this.game.onNext = (player)=>{
        this.playPanel.openWeapon.select(player.weapons.indexOf(player.currentWeapon), true);
        this.playPanel.windIndicator.node.textContent = this.game.wind.toFixed(2);
      }

      this.game.onFinish = ()=>{
        this.panel.selectByScene(this.menu);
        this.renderer.stop();
      }
      this.game.start(defaultGameConfig);
      this.playPanel.teamIndicator.clear();
      this.game.teams.forEach((it, i)=>{
        this.playPanel.teamIndicator.addTeam({name:it.name, avatar:it.avatar||i, color: colors[i]});
      })
      this.renderer.start();
    }
    this.settings = new SettingsMenu(this.panel.node, this.panel);
    this.panel.add(this.settings);
    this.menu.onSettings = () => {
      this.panel.selectByScene(this.settings);
    }

   /* this.editor = new EditorMenu(this.panel.node);
    this.panel.add(this.editor);
    this.menu.onEditor = () => {
      this.panel.selectByScene(this.editor);
    }*/

   /* this.editor.onExit = () => {
      this.panel.selectByScene(this.menu);
    }*/

    /*this.settings.onExit = () => {
      this.panel.selectByScene(this.menu);
    }*/

    this.panel.selectByScene(this.preloader);

    this.renderer.onRenderFrame = (deltaTime) => {
      this.game.tick(deltaTime / 100);
      this.playPanel.timeIndicator.node.textContent = Math.trunc(this.game.timer.counter);

      this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height);
      this.game.render(this.context, deltaTime/100);
      this.game.processKeyboard(this.context, this.keyboardState, deltaTime/100);
      this.game.react(this.game.bullets, deltaTime);

      let allHealth = 0;
      this.game.teams.forEach(team=>allHealth+=team.getSumHealth());
      if (this.allHealth!=allHealth){
        this.allHealth = allHealth;
        this.game.teams.forEach((it, i)=>{
          let tm = this.playPanel.teamIndicator.teams.find(jt=>jt.name == it.name);
          //console.log(it.getSumHealth(), allHealth);
          tm.setHealth(100* it.getSumHealth()/allHealth, ''+it.getSumHealth()+'/'+ allHealth);
        });
      }
     // this.context.stroke();
     /* this.playPanel.teamIndicator.teams = this.playPanel.teamIndicator.teams.filter(it=>{
        this.game.teams.find(jt=>jt.name == it.name);
      });*/
      let averager = 128;
      this.fps = (this.fps*(averager-1) + deltaTime) / averager;
      this.playPanel.windIndicator.node.textContent = this.game.wind.toFixed(2) + ' ' + (1/this.fps*1000).toFixed(2);
    }

    this.keyboardState = {};
    window.addEventListener('keydown', ev => {
      this.keyboardState[ev.code] = true;
    });

    window.addEventListener('keyup', ev => {
      this.keyboardState[ev.code] = false;
    });

    window.addEventListener('resize', () => {
      this.autoSize();
    });

    window.addEventListener('click', (e) => {
      if (this.canvas) {
        console.log(e);
      this.game.createTargetPoint(new Vector(e.clientX, e.layerY - this.canvas.node.offsetTop)
        .scale(this.canvas.node.width / this.canvas.node.clientWidth));
      }
    });

  }

  autoSize(){
    let scaler = 1.4;
    this.canvas.node.height = this.node.clientHeight/scaler;
    this.canvas.node.width = this.node.offsetWidth/scaler;
    this.canvas.node.style.width = '100%';
    this.canvas.node.style.height = '100%';
  }

}

module.exports = GameScreen;