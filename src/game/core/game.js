const Timer = require('./timer.js');

class Game{
  constructor(){
    this.teams = [];
    this.bullets = [];
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