const Control = require('common/control.js');
const GamePanel = require('./gamePanel.js');
const PlayPanel = require('./playPanel.js');
const MainMenu = require('./mainMenu.js');
const Renderer = require('common/renderer.js');
const Vector = require('common/vector.js');
const Preloader = require('./preloader.js');

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

/*class Weapon{
  constructor(){
    this.bullet = new GraphicPoint(new Vector(0, 0), 5, '#000');
  }

  shot(){

  }
}
*/
class PhysicPoint {
  constructor (position){
    this.position = position.clone();
    this.speed = new Vector(0,0);
    this.acceleration = new Vector(0,0);
    this.forceList = [];
    this.friction = 1;
  }

  get x(){
    return this.position.x;
  }
  get y(){
    return this.position.y;
  }
  set x(value){
    this.position.x = value;
  }
  set y(value){
    this.position.y = value;
  }

  getNextPosition(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach(it=>resultAcceleration.add(it));
    this.speed.clone().add(resultAcceleration.clone().scale(deltaTime)).scale(this.friction);
    return this.position.clone().add(this.speed.clone().scale(deltaTime));  
  }

  process(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach(it=>resultAcceleration.add(it));
    this.speed.add(resultAcceleration.clone().scale(deltaTime)).scale(this.friction);
    this.position.add(this.speed.clone().scale(deltaTime));  
  }
}

class Physical{
  constructor(pos, radius, color){
    this.graphic = new GraphicPoint(pos, radius, color);
    this.physic = new PhysicPoint(pos); 
    this.timer = new Timer();
    this.timer.start(10);
  }

  render(context, deltaTime){
    this.timer.tick(deltaTime);
    this.physic.process(deltaTime);
    this.graphic.position = this.physic.position;
    this.graphic.render(context, deltaTime);
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
    this.angle = 0;
    this.target = new GraphicPoint(pos, 5, color);
    
    this.bullets = [];
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

    let bullet = new Physical(this.graphic.position, 5, '#000');
    bullet.physic.speed = new Vector(Math.cos(this.angle / 100), Math.sin(this.angle / 100)).scale(10.1);
    this.bullets.push(bullet);
    bullet.timer.onTimeout=()=>{
      this.bullets = this.bullets.filter(it=>it!==bullet);
    }
  }

  render(context, deltaTime){
    this.target.position = new Vector(Math.cos(this.angle / 100), Math.sin(this.angle / 100)).scale(100).add(this.graphic.position)
    this.graphic.render(context, deltaTime);
    this.bullets.forEach(it=>it.render(context, deltaTime));
    if (this.isActive){
      this.target.render(context, deltaTime);
    }
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
    this.afterTimer = new Timer();
    this.timer.onTimeout = ()=>{
      this.next();
    }
    this.pow=0;
  }

  addTeam(team){
    this.teams.push(team);
  }

  start(){
    if (this.teams.length>1){
      this.timer.start(45);
      this.currentTeam = this.teams[0];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.teams.forEach(it=>it.players.forEach(jt=>{
        jt.graphic.radius=10;
        jt.isActive = false;
      }));
      currentPlayer.graphic.radius = 15;
      currentPlayer.isActive = true;
      console.log('start turn to ',this.currentTeam.name, currentPlayer);
    }
  }

  next(){
    if (this.teams.length>1){
      this.timer.start(45);

      
      
      let nextTeamIndex = (this.teams.indexOf(this.currentTeam)+1) % this.teams.length;
      this.currentTeam = this.teams[nextTeamIndex];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.teams.forEach(it=>it.players.forEach(jt=>{
        jt.graphic.radius=10;
        jt.isActive = false;
      }));
      currentPlayer.graphic.radius = 15;
      currentPlayer.isActive = true;
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
    this.afterTimer.tick(deltaTime);
  }

  render(context, deltaTime){
    this.teams.forEach(it=>{
      it.render(context, deltaTime);
    })
  }

  processKeyboard(keyboardState, deltaTime){
    let c = this.currentTeam.currentPlayer.graphic.position;
    let t = this.currentTeam.currentPlayer;

    if (keyboardState['KeyW']){c.y+=-1;}
    if (keyboardState['KeyS']){c.y+=1;}
    if (keyboardState['KeyA']){c.x+=-1;}
    if (keyboardState['KeyD']){c.x+=1;}

    if (keyboardState['KeyQ']){t.angle+=-1;}
    if (keyboardState['KeyE']){t.angle+=1;}
    
    
    if (!this.nextLock && keyboardState['Space']){
      this.nextLock = true;
      this.pow+=deltaTime;
    }
    if (this.nextLock && !keyboardState['Space']){
      this.timer.pause();
      this.nextLock = false; 
      if (!this.shoted){
        this.shoted = true;
        this.currentTeam.currentPlayer.shot(this.pow);
      }
      this.pow = 0;
      this.afterTimer.start(10);
      this.afterTimer.onTimeout = ()=>{
        this.afterTimer.pause();
        this.shoted = false;
        this.next();  
      }
      
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
    this.renderer = new Renderer();

    this.preloader = new Preloader(this.panel.node);
    this.preloader.onStart = ()=>{
      this.panel.node.innerHTML = '';
      let menu = new MainMenu(this.panel.node);
      menu.onFight = () =>{
        this.panel.node.innerHTML = '';
        let playPanel = new PlayPanel(this.panel.node);
        this.game = newGame();
      
        this.renderer.onRenderFrame = (deltaTime) =>{
          this.game.tick(deltaTime/100);
          playPanel.timeIndicator.node.textContent = Math.trunc(this.game.timer.counter);
          this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height);
          this.game.render(this.context, deltaTime/100);
          this.game.processKeyboard(this.keyboardState, deltaTime/100);
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