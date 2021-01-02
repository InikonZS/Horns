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
const GameMap = require('./core/map.js');

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

class SceneManager extends Control{
  constructor (parentNode){
    super(parentNode);
    this.node.style.position = 'relative';
    this.scenes = [];
    this.currentScene = null;
    this.currentIndex = -1;
  }

  add(scene){
    scene.hide();
    this.scenes.push(scene);
  }

  selectByName(name){
    let index = this.scenes.findIndex(it=>it.name == name);
    this.select(index);
  }

  selectByScene(scene){
    let index = this.scenes.indexOf(scene);
    this.select(index);
  }

  select(index){
    this.scenes.forEach((it, i)=>{
      if (i!=index){
        it.hide();
      } else {
        it.show();
        this.currentScene = it;
        this.currentIndex = i;
      }
    });
  }
}


class GameScreen extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', 'gamescreen_wrapper');
  //this.node.style.position = 'relative';
   // this.node.style.height = 'calc(100vh - 134px);';
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.style.position = 'absolute';
    this.autoSize();
    this.context = this.canvas.node.getContext('2d');
    this.renderer = new Renderer();
    this.panel = new SceneManager(this.node);//new GamePanel(this.node, 'div');
    
    this.preloader = new Preloader(this.panel.node);
    this.panel.add(this.preloader);
    this.preloader.onStart = ()=>{
      this.panel.selectByScene(this.menu);
    }

    this.playPanel = new PlayPanel(this.panel.node);
    this.panel.add(this.playPanel);
    this.menu = new MainMenu(this.panel.node);
    this.panel.add(this.menu);
    this.menu.onFight = () =>{
      this.panel.selectByScene(this.playPanel);
      this.game = newGame();
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
    }

    this.keyboardState = {};
    window.addEventListener('keydown', ev=>{
      this.keyboardState[ev.code] = true;  
    });

    window.addEventListener('keyup', ev=>{
      this.keyboardState[ev.code] = false;  
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