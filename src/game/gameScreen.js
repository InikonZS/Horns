const Control = require('common/control.js');
const SceneManager = require('./sceneManager.js');
const PlayPanel = require('./playPanel.js');
const MainMenu = require('./mainMenu.js');
const Renderer = require('common/renderer.js');
const Vector = require('common/vector.js');
const Preloader = require('./preloader.js');

const Team = require('./core/team.js');
const Game = require('./core/game.js');
const Player = require('./core/player.js');

const names = 'Lorem Ipsum Dolor Sit Amet Erat Morbi Lectus Finibus Mollis Mauris Eros Sed Felis Dabius Turpis Elemus Genus Proin Covan Grat Coin Jaggo Netus Inos Beler Ogos Frago'.split(' ');
const colors = ['#f00', '#fc0', '#090', '#00f', '#909', '#099'];

function newGame(){
  let colors = ['#f00', '#fc0', '#090', '#00f', '#909'];
  let game = new Game();
  for (let j=0; j<2; j++){
    let team = new Team('team'+j);
    for (let i=0; i<2; i++){
      let pl = new Player(names[i+j*2], 100, new Vector(Math.random()*700+50, Math.random()*500+50), colors[j]);
      team.addPlayer(pl);
    }
    game.addTeam(team);
  }
  return game;
}

class GameScreen extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', 'gamescreen_wrapper');
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.style.position = 'absolute';
    this.autoSize();
    this.context = this.canvas.node.getContext('2d');
    this.renderer = new Renderer();
    this.panel = new SceneManager(this.node);

    this.preloader = new Preloader(this.panel.node);
    this.panel.add(this.preloader);
    this.preloader.onStart = ()=>{
      this.panel.selectByScene(this.menu);
    }

    this.playPanel = new PlayPanel(this.panel.node);
    this.playPanel.weaponMenu.onSelect=index=>{
      this.game.currentTeam.currentPlayer.setWeapon(index);
    }


    this.panel.add(this.playPanel);
    this.menu = new MainMenu(this.panel.node);
    this.panel.add(this.menu);
    this.menu.onFight = () =>{
      this.panel.selectByScene(this.playPanel);
      this.game = newGame();
      this.game.onNext = (player)=>{
        this.playPanel.weaponMenu.select(player.weapons.indexOf(player.currentWeapon), true);
        this.playPanel.windIndicator.node.textContent = this.game.wind.toFixed(2);
      }
      this.playPanel.teamIndicator.clear();
      this.game.teams.forEach((it, i)=>{
        this.playPanel.teamIndicator.addTeam({name:it.name, avatar:i, color: ['#f00', '#fc0', '#090', '#00f', '#909'][i]});
      })

      this.game.onFinish = ()=>{
        this.panel.selectByScene(this.menu);
        this.renderer.stop();
      }
      this.game.start();
      this.renderer.start();
    }
    this.panel.selectByScene(this.preloader);

    this.renderer.onRenderFrame = (deltaTime) =>{
      this.game.tick(deltaTime/100);
      this.playPanel.timeIndicator.node.textContent = Math.trunc(this.game.timer.counter);

      this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height);
      this.game.render(this.context, deltaTime/100);
      this.game.processKeyboard(this.keyboardState, deltaTime/100);
      this.game.react(this.game.bullets, deltaTime);

      let allHealth = 0;
      this.game.teams.forEach(team=>allHealth+=team.getSumHealth());
      this.game.teams.forEach((it, i)=>{
        let tm = this.playPanel.teamIndicator.teams.find(jt=>jt.name == it.name);
        //console.log(it.getSumHealth(), allHealth);
        tm.setHealth(100* it.getSumHealth()/allHealth, ''+it.getSumHealth()+'/'+ allHealth);
      })
    }

    this.keyboardState = {};
    window.addEventListener('keydown', ev=>{
      this.keyboardState[ev.code] = true;
      this.game.currentTeam.currentPlayer.animation.start();
    });

    window.addEventListener('keyup', ev=>{
      this.keyboardState[ev.code] = false;
      this.game.currentTeam.currentPlayer.animation.stop()
    });

    window.addEventListener('resize', ()=>{
      this.autoSize();
    })
  }

  autoSize(){
    this.canvas.node.height = this.node.clientHeight;
    this.canvas.node.width = this.node.offsetWidth;
  }
}

module.exports = GameScreen;