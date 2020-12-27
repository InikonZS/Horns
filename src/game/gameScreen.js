const Control = require('common/control.js');
const GamePanel = require('./gamePanel.js');
const PlayPanel = require('./playPanel.js');
const MainMenu = require('./mainMenu.js');
const Renderer = require('common/renderer.js');
const Vector = require('common/vector.js');
const Preloader = require('./preloader.js');

const Timer = require('./core/timer.js');
const Team = require('./core/team.js');
const Game = require('./core/game.js');
const Player = require('./core/player.js');


function newGame(){
  let colors = ['#f00', '#fc0', '#090', '#00f', '#909'];
  let game = new Game();
  for (let j=0; j<2; j++){
    let team = new Team('team'+j);
    for (let i=0; i<2; i++){
      let pl = new Player('pl'+i+'team'+j, 100, new Vector(Math.random()*700+50, Math.random()*500+50), colors[j]);  
      team.addPlayer(pl);
    }
    game.addTeam(team);
  }
  return game;
}


class GameScreen extends Control{
  constructor(parentNode, config){
    super(parentNode);
    this.node.style.position = 'relative';
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.style.position = 'absolute';
    this.canvas.node.width = 800;
    this.canvas.node.height = 600;
    this.context = this.canvas.node.getContext('2d');
    this.panel = new GamePanel(this.node, 'div');
    this.renderer = new Renderer();

    this.preloader = new Preloader(this.panel.node);
    //this.preloader.hide()
    this.preloader.onStart = ()=>{
     // this.panel.node.innerHTML = '';
     this.preloader.hide();
     this.menu.show();
    }
    let playPanel = new PlayPanel(this.panel.node);
    this.playPanel = playPanel;
    this.playPanel.hide();
    
    this.game = newGame();
    this.game.onFinish = ()=>{
      this.playPanel.hide();
      this.preloader.show();
      //this.panel.node.innerHTML = '';
      //this.preloader = new Preloader(this.panel.node);  
    }

    let menu = new MainMenu(this.panel.node);
    this.menu=menu;
    this.menu.hide();
      menu.onFight = () =>{
        this.menu.hide();
        this.playPanel.show();
        this.game.start();

        this.renderer.start();
      }

      this.renderer.onRenderFrame = (deltaTime) =>{
          this.game.tick(deltaTime/100);
          playPanel.timeIndicator.node.textContent = Math.trunc(this.game.timer.counter);
          this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height);
          this.game.render(this.context, deltaTime/100);
          this.game.processKeyboard(this.keyboardState, deltaTime/100);
          this.game.react(this.game.bullets, deltaTime);
          this.game.bullets.forEach(it=>{
            it.render(this.context, deltaTime/100);
          })
          this.game.bullets = this.game.bullets.filter(it=>!it.isDeleted);
        }

    console.log('fgdfg')

    this.keyboardState = {};
    window.addEventListener('keydown', ev=>{
      this.keyboardState[ev.code] = true;  
    });

    window.addEventListener('keyup', ev=>{
      this.keyboardState[ev.code] = false;  
    });

  }
}

module.exports = GameScreen;