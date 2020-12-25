const Control = require('common/control.js');
const GamePanel = require('./gamePanel.js');
const Renderer = require('common/renderer.js');
const Vector = require('common/vector.js');

class Timer{
  constructor(){
    this.counter = 0;
    this.isPaused = true;
  }

  tick(deltaTime){
    if (this.isPaused == false){
      this.counter-=deltaTime;
      if (this.counter<=0){
        this.onTimeout();
      }
    }
  }

  pause(){
    this.isPaused = true;
  }

  resume(){
    this.isPaused = false;
  }

  start(counter){
    this.isPaused = false;
    this.counter = counter;
  }
}

class Player{
  constructor(name, health, pos, color){
    this.name = name;
    this.health = health;
    this.weapons = [];
    this.currentWeapon = null;
    this.shotDirection;

    this.graphic = new GraphicPoint(pos, 10, color);
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

  shot(){
    if (this.currentWeapon){
      this.currentWeapon.shot();
      this.onShot();
    }
  }

  render(context, deltaTime){
    this.graphic.render(context, deltaTime);
  }
}

class Team{
  constructor(name){
    this.players = [];
    this.name = name;
    this.currentPlayer = null;
  }

  nextPlayer(){
    if (this.currentPlayer!==null){
      let nextIndex = (this.players.indexOf(this.currentPlayer)+1) % this.players.length;
      this.currentPlayer = this.players[nextIndex]; 
    } else {
      this.currentPlayer = this.players[0];
    }
    return this.currentPlayer;
  }

  getSumHealth(){
    return this.players.reduce((a, it)=>a+=it.health);
  }

  addPlayer(player){
    this.players.push(player);
  }

  render(context, deltaTime){
    this.players.forEach(it=>{
      it.render(context, deltaTime);
    })
  }
}

class Game{
  constructor(){
    this.teams = [];
    this.currentTeam = null;
    this.timer = new Timer();
    this.timer.onTimeout = ()=>{
      this.next();
    }
  }

  addTeam(team){
    this.teams.push(team);
  }

  start(){
    if (this.teams.length>1){
      this.timer.start(45);
      this.currentTeam = this.teams[0];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.teams.forEach(it=>it.players.forEach(jt=>jt.graphic.radius=10));
      currentPlayer.graphic.radius = 15;
      console.log('start turn to ',this.currentTeam.name, currentPlayer);
    }
  }

  next(){
    if (this.teams.length>1){
      this.timer.start(45);
      
      let nextTeamIndex = (this.teams.indexOf(this.currentTeam)+1) % this.teams.length;
      this.currentTeam = this.teams[nextTeamIndex];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.teams.forEach(it=>it.players.forEach(jt=>jt.graphic.radius=10));
      currentPlayer.graphic.radius = 15;
      //this.currentPlayer = this.currentTeam.players
      console.log('turn to ',this.currentTeam.name, currentPlayer);
    } else {
      this.finish();
    }
  }

  finish(){
    this.timer.pause();
  }

  tick(deltaTime){
    this.timer.tick(deltaTime);
  }

  render(context, deltaTime){
    this.teams.forEach(it=>{
      it.render(context, deltaTime);
    })
  }

  processKeyboard(keyboardState){
    let c = this.currentTeam.currentPlayer.graphic.position;
    if (keyboardState['KeyW']){c.y+=-1;}
    if (keyboardState['KeyS']){c.y+=1;}
    if (keyboardState['KeyA']){c.x+=-1;}
    if (keyboardState['KeyD']){c.x+=1;}

    
    if (!this.nextLock && keyboardState['Space']){
      this.nextLock = true;
      this.currentTeam.currentPlayer.shot();
      this.next();
    }
    if (this.nextLock && !keyboardState['Space']){
      this.nextLock = false; 
    }
  }
}

function newGame(){
  let colors = ['#f00', '#fc0', '#090', '#00f', '#909'];
  let game = new Game();
  for (let j=0; j<3; j++){
    let team = new Team('team'+j);
    for (let i=0; i<5; i++){
      let pl = new Player('pl'+i+'team'+j, 100, new Vector(Math.random()*700+50, Math.random()*500+50), colors[j]);  
      team.addPlayer(pl);
    }
    game.addTeam(team);
  }
  return game;
}

class GraphicPoint {
  constructor(position, radius, color = '#f00') {
    //super();
    this.position = position.clone();
    //this.physic = new PhysicPoint(position);
    this.radius = radius;
    this.color = color;
  }

  render(context, deltaTime) {

    context.fillStyle = this.color;
    context.strokeStyle = '#FFF';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.stroke();
    //super.render(context, deltaTime);
  }
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
    this.game = newGame();
    this.renderer = new Renderer();
    this.renderer.onRenderFrame = (deltaTime) =>{
      this.game.tick(deltaTime/100);
      this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height);
      this.game.render(this.context, deltaTime/100);
      this.game.processKeyboard(this.keyboardState);
    }
    this.game.start();
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