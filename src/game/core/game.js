const Timer = require('./timer.js');
const Box = require('./box.js');
const GameMap = require('./map.js');
const Vector = require('common/vector.js');
const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');

class SilentWatcher{
  constructor(){
    this.events = [];
  }

  add(event){
    this.events.push(event);
  }
}

class Game{
  constructor(){
    this.camera = new Vector(0, 0);
    this.wind = 0;
    this.teams = [];
    this.boxes = [];
    this.bullets = {list:[]};
    this.currentTeam = null;
    this.timer = new Timer();
    this.afterTimer = new Timer();
    this.map = new GameMap();
    this.silentWatcher = new SilentWatcher();
    this.timer.onTimeout = ()=>{
      this.next();
    }
    this.parts = [];
    for (let i=0;i<100; i++){
      let part = new Physical(new Vector(Math.random()*2500, Math.random()*1000), 5, "#0f0");
      part.physic.speed.y=5;
      this.parts.push(part);
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

      this.timer.start(85);
      this.currentTeam = this.teams[0];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.teams.forEach(it=>it.players.forEach(jt=>{
        jt.graphic.radius=10;
        jt.isActive = false;
      }));
      currentPlayer.graphic.radius = 15;
      currentPlayer.isActive = true;
      console.log('start turn to ',this.currentTeam.name, currentPlayer);

      this.onNext && this.onNext(currentPlayer);
    }
  }

  next(){
    if (this.teams.length>1){
      this.boxes.push (new Box(new Vector(Math.random()*700+50, Math.random()*500+50)));
      this.timer.start(85);
      this.wind = Math.random()*11-5;
      let nextTeamIndex = (this.teams.indexOf(this.currentTeam)+1) % this.teams.length;
      this.currentTeam = this.teams[nextTeamIndex];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.teams.forEach(it=>it.players.forEach(jt=>{
        jt.graphic.radius=10;
        jt.isActive = false;
        jt.setMoveAnimation(false);
      }));
      currentPlayer.graphic.radius = 15;
      currentPlayer.isActive = true;
      //console.log('turn to ',this.currentTeam.name, currentPlayer);
      this.onNext && this.onNext(currentPlayer);
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
    this.parts.forEach(it=>{
      if (it.physic.position.y>1000){
        it.physic.position.y=0;
      }
      if (it.physic.position.x>2500){
        it.physic.position.x=0;
      }
      if (it.physic.position.x<-100){
        it.physic.position.x=2400;
      }
      it.physic.speed.x = 5*this.wind+Math.random()*4;
      it.render(context, deltaTime, this.camera);
    });

    this.map.render(context, deltaTime, this.camera);
    this.bullets.list.forEach(it=>{
      let nearest = this.map.getNearIntersection(it.physic.position, it.physic.getNextPosition(deltaTime));
      if (!it.isDeleted && nearest){//this.map.isEmptyByVector(it.graphic.position)){
        this.map.round(/*it.graphic.position*/nearest, it.magnitude || 30);
        it.isDeleted = true;
        this.teams.forEach(team=>team.players.forEach(jt=>{
          let lvec = jt.physic.position.clone().sub(/*it.graphic.position*/nearest);
          if (lvec.abs()<20){
            jt.physic.speed.add(lvec.normalize().scale(7));
            jt.hurt(20);
          } else if (lvec.abs()<40){
            jt.physic.speed.add(lvec.normalize().scale(4));
            jt.hurt(10);
          } else if (lvec.abs()<80){
            jt.physic.speed.add(lvec.normalize().scale(3));
            jt.hurt(3);
          }
        }));
      }
    });

    this.bullets.list.forEach(it=>{
      if (!it.isDeleted){
        it.render(context, deltaTime, this.camera);
      }
    })

    this.teams.forEach(team=>team.players.forEach(it=>{
      it.physic.acceleration.y=1;
      if (this.map.isEmptyByVector(it.physic.getNextPosition(deltaTime))){
        it.physic.process(deltaTime);
       // this.map.round(it.graphic.position, 30);
       // it.isDeleted = true;
      } else {
        it.physic.speed.y=0;
        it.physic.speed.x=0;
        it.physic.acceleration.y=0;
      }
    }));

    this.bullets.list = this.bullets.list.filter(it=>!it.isDeleted);

    this.boxes.forEach(it=>it.render(context, deltaTime, this.camera, this.map, this.teams));
    this.teams.forEach(it=>{
      it.render(context, deltaTime, this.camera);
    });

  }

  processKeyboard(keyboardState, deltaTime){
    if (keyboardState['ArrowUp']){this.camera.y-=-4;}
    if (keyboardState['ArrowDown']){this.camera.y-=4;}
    if (keyboardState['ArrowLeft']){this.camera.x-=-4;}
    if (keyboardState['ArrowRight']){this.camera.x-=4;}

    //let c = this.currentTeam.currentPlayer.graphic.position.clone();

    let t = this.currentTeam.currentPlayer;
    let c = new Vector(0,0);
    let move = false;
    let tryJump = false;
    let keyCode = '';
    if (keyboardState['KeyW']){c.y+=-1; tryJump = true; keyCode = 'KeyW';}
    if (keyboardState['KeyS']){c.y+=1;}
    if (keyboardState['KeyA']){c.x+=-1; move = true; keyCode = 'KeyA';}
    if (keyboardState['KeyD']){c.x+=1; move = true; keyCode = 'KeyD';}

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
      if (tryJump && !this.jumped){
        this.jumped = true;
        physic.speed.y=c.y*2;
      }
      let s = physic.getNextPosition(deltaTime);
      if (this.map.isEmptyByVector(s)){
       // physic.process(deltaTime);
      } else {
        if (move && this.map.isEmptyByVector(s.clone().add(new Vector(0,-size*2)))){
          //physic.process(deltaTime);
          physic.position.add(new Vector(0,-size*2));
        } else {
          physic.acceleration.y=0;
          physic.speed.y=0;
          physic.speed.x=0;
          this.jumped=false;
        }
      }
      this.currentTeam.currentPlayer.setMoveAnimation(move || tryJump, keyCode);
    }

    const shotFunc =()=>{
      this.nextLock = false;
      if (!this.shoted){
        //this.timer.pause();

        this.shoted = true;
        this.currentTeam.currentPlayer.shot(this.bullets, this.wind);

        this.afterTimer.start(10);
        this.afterTimer.onTimeout = ()=>{
          if (!this.bullets.list.length){
            this.afterTimer.pause();
            this.shoted = false;
            this.next();
          } else {
            this.afterTimer.start(10);
          }
        }
      }
    }

    if (!this.shoted && !this.nextLock && keyboardState['Space']){
      this.nextLock = true;
      this.currentTeam.currentPlayer.powerStart();
      this.timer.pause();
    }
    if (this.nextLock && (!keyboardState['Space']||this.currentTeam.currentPlayer.power>5)){
      shotFunc();
    }
  }
}

module.exports = Game;