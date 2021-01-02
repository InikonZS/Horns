const Timer = require('./timer.js');
const GameMap = require('./map.js');
const Vector = require('common/vector.js');

class SilentWatcher{
  constructor(){
    this.events = [];
  }

  add(event){

  }
}

class Game{
  constructor(){
    this.camera = new Vector(0, 0);
    this.teams = [];
    this.bullets = {list:[]};
    this.currentTeam = null;
    this.timer = new Timer();
    this.afterTimer = new Timer();
    this.map = new GameMap();
    this.timer.onTimeout = ()=>{
      this.next();
    }
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
      //console.log('turn to ',this.currentTeam.name, currentPlayer);
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
    this.bullets.list.forEach(it=>{
      if (!it.isDeleted && !this.map.isEmptyByVector(it.graphic.position)){
        this.map.round(it.graphic.position, 30);
        it.isDeleted = true;
      }
    });

    this.bullets.list.forEach(it=>{
      if (!it.isDeleted){
        it.render(context, deltaTime, this.camera);
      }
    })

    this.bullets.list = this.bullets.list.filter(it=>!it.isDeleted);
    this.map.render(context, deltaTime, this.camera);
    this.teams.forEach(it=>{
      it.render(context, deltaTime, this.camera);
    });
    
  }

  processKeyboard(keyboardState, deltaTime){
    if (keyboardState['ArrowUp']){this.camera.y-=-1;}
    if (keyboardState['ArrowDown']){this.camera.y-=1;}
    if (keyboardState['ArrowLeft']){this.camera.x-=-1;}
    if (keyboardState['ArrowRight']){this.camera.x-=1;}

    //let c = this.currentTeam.currentPlayer.graphic.position.clone();
    
    let t = this.currentTeam.currentPlayer;
    let c = new Vector(0,0);
    let move = false;
    if (keyboardState['KeyW']){c.y+=-1;}
    if (keyboardState['KeyS']){c.y+=1;}
    if (keyboardState['KeyA']){c.x+=-1; move = true}
    if (keyboardState['KeyD']){c.x+=1; move = true}

    if (keyboardState['KeyQ']){t.angle+=-1;}
    if (keyboardState['KeyE']){t.angle+=1;}
    
    let size = this.map.size;
    let freeMovement = false;
    if (freeMovement){
      let physic = this.currentTeam.currentPlayer.physic;
      let s = physic.position.clone().add(c);
      if (this.map.isEmptyByVector(s)){
        physic.position = s;  
      } else {
        if (this.map.isEmptyByVector(s.clone().add(new Vector(0,-size*2)))){
          physic.position = s.clone().add(new Vector(0,-size*2));  
        }
      }  
    } else {
      let physic = this.currentTeam.currentPlayer.physic;
      physic.acceleration.y=1;
      physic.speed.x = c.normalize().scale(5).x;
      let s = physic.getNextPosition(deltaTime);
      if (this.map.isEmptyByVector(s)){
        physic.process(deltaTime); 
      } else {
        if (move && this.map.isEmptyByVector(s.clone().add(new Vector(0,-size*2)))){
          physic.process(deltaTime);
          physic.position.add(new Vector(0,-size*2)); 
        } else {
          physic.speed.y=0;  
        }
      }
    }
    
    const shotFunc =()=>{
      this.nextLock = false; 
      if (!this.shoted){
        this.timer.pause();

        this.shoted = true;
        this.currentTeam.currentPlayer.shot(this.bullets, this.pow);
        
        this.afterTimer.start(10);
        this.afterTimer.onTimeout = ()=>{
          this.afterTimer.pause();
          this.shoted = false;
          this.next();  
        }
      }  
    }

    if (!this.shoted && !this.nextLock && keyboardState['Space']){
      this.nextLock = true;
      this.currentTeam.currentPlayer.powerStart();
    }
    if (this.nextLock && (!keyboardState['Space']||this.currentTeam.currentPlayer.power>5)){ 
      shotFunc();  
    }
  }
}

module.exports = Game;