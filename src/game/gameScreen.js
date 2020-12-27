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
//let bullets = [];




/*class Player{
  constructor(name, health, pos, color){
    this.name = name;
    this.health = health;
    this.weapons = [new Weapon(10)];
    this.currentWeapon = this.weapons[0];
    this.angle = 0;

    this.graphic = new GraphicPlayer(pos, 10, color);
    this.target = new GraphicPoint(pos, 5, color);
    
  }

  hurt(damage){
    this.health -= damage;
    if (this.health <= 0 ){
      this.health = 0;
      this.onKilled();
    }
  }

  cure(damage){
    this.health += damage;
  }

  shot(bullets){
    let direction = new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30));
    if (this.currentWeapon){
      this.currentWeapon.shot(bullets, this.graphic.position, direction);
      this.onShot && this.onShot();
    }
  }

  react(bullets, deltaTime){
    bullets.forEach(it=>{
      if (it.graphic.position.clone().sub(this.graphic.position).abs()<10){
        if (!it.isDeleted){
          it.isDeleted = true;
          this.hurt(70);
        }
      }
    });  
  }

  render(context, deltaTime){
    this.target.position = new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30)).scale(100).add(this.graphic.position)
    this.graphic.render(context, deltaTime, {health:this.health});
    
    if (this.isActive){
      this.target.render(context, deltaTime);
    }
  }
}

*/



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
    this.preloader.onStart = ()=>{
      this.panel.node.innerHTML = '';
      let menu = new MainMenu(this.panel.node);
      menu.onFight = () =>{
        this.panel.node.innerHTML = '';
        let playPanel = new PlayPanel(this.panel.node);
        this.game = newGame();
        this.game.onFinish = ()=>{
          //this.panel.node.innerHTML = '';
          //this.preloader = new Preloader(this.panel.node);  
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
        this.game.start();
      }
    }

    this.renderer.start();

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