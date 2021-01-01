const Timer = require('./timer.js');
const GameMap = require('./map.js');
const Vector = require('common/vector.js');

class Game{
  constructor(){
    this.teams = [];
    this.bullets = [];
    this.currentTeam = null;
    this.timer = new Timer();
    this.afterTimer = new Timer();
    this.map = new GameMap();
    this.timer.onTimeout = ()=>{
      this.next();
    }
    this.pow=0;
  }

  addTeam(team){
    this.teams.push(team);
    team.onKilled = ()=>{
      this.teams = this.teams.filter(it=>it!=team);
      if (this.teams.length<=1){
        console.log('win');
        this.onFinish && this.onFinish();
      }
    }
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

  react(bullets, deltaTime){
    this.teams.forEach(it=>{
      it.react(bullets, deltaTime);
      
    })  
    
  }

  render(context, deltaTime){
    this.bullets.forEach(it=>{
      
      if (!this.map.isEmptyByVector(it.graphic.position)){//(this.map.map[Math.trunc(it.graphic.position.y/this.map.size)] && this.map.map[Math.trunc(it.graphic.position.y/this.map.size)][Math.trunc(it.graphic.position.x/this.map.size)]){
        //this.map.map[Math.trunc(it.graphic.position.y/10)][Math.trunc(it.graphic.position.x/10)] = 0; 
        this.map.round(it.graphic.position, 30);
        it.isDeleted = true;
      }
    });
    this.map.render(context);
    this.teams.forEach(it=>{
      it.render(context, deltaTime);
    });
    
  }

  processKeyboard(keyboardState, deltaTime){
    let c = this.currentTeam.currentPlayer.graphic.position.clone();
    let t = this.currentTeam.currentPlayer;

    let move = false;
    if (keyboardState['KeyW']){c.y+=-1;}
    if (keyboardState['KeyS']){c.y+=1;}
    if (keyboardState['KeyA']){c.x+=-1; move = true}
    if (keyboardState['KeyD']){c.x+=1; move = true}

    if (keyboardState['KeyQ']){t.angle+=-1;}
    if (keyboardState['KeyE']){t.angle+=1;}
    
    let size = this.map.size;
    if (this.map.isEmptyByVector(c)){//(!this.map.map[Math.trunc(c.y/size)] || (this.map.map[Math.trunc(c.y/size)] && !this.map.map[Math.trunc(c.y/size)][Math.trunc(c.x/size)])){
      this.currentTeam.currentPlayer.graphic.position = c;  
    } else {
      if (this.map.isEmptyByVector(c.clone().add(new Vector(0,-size)))){//(move && this.map.map[Math.trunc(c.y/size)-1] && !this.map.map[Math.trunc(c.y/size)-1][Math.trunc(c.x/size)]){
        this.currentTeam.currentPlayer.graphic.position = c.add(new Vector(0,-size));  
      }
    }
    
    if (!this.nextLock && keyboardState['Space']){
      this.nextLock = true;
      this.pow+=deltaTime;
    }
    if (this.nextLock && !keyboardState['Space']){ 
      this.nextLock = false; 
      if (!this.shoted){
        this.timer.pause();
       
        
        this.shoted = true;
        this.currentTeam.currentPlayer.shot(this.bullets, this.pow);
        
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
}

module.exports = Game;