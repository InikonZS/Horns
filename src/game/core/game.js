const Timer = require('./timer.js');
const Box = require('./box.js');
const GameMap = require('./map.js');
const Player = require('./player.js');
const Vector = require('common/vector.js');
const Particles = require('./particles.js');
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
    this.parts = new Particles(100);
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
    this.next(0);
  }

  next(teamIndex){
    if (this.teams.length>1){
      this.boxes.push (new Box(new Vector(Math.random()*700+50, Math.random()*500+50)));
      this.timer.start(85);
      this.wind = Math.random()*11-5;

      let nextTeamIndex = teamIndex;
      if (teamIndex === undefined){
        nextTeamIndex = (this.teams.indexOf(this.currentTeam)+1) % this.teams.length;
      }

      this.currentTeam = this.teams[nextTeamIndex];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.getPlayerList().forEach(jt=>{
        jt.setActive(false);
      });
      currentPlayer.setActive(true);

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
    this.parts.render(context, deltaTime, this.camera, this.wind);

    this.map.render(context, deltaTime, this.camera);
    this.bullets.list.forEach(it=>{
      let nearest = this.map.getNearIntersection(it.physic.position, it.physic.getNextPosition(deltaTime));
      if (!it.isDeleted && nearest){
        this.map.round(nearest, it.magnitude || 30);
        it.isDeleted = true;
        this.getPlayerList().forEach(jt=>{
          let lvec = jt.physic.position.clone().sub(nearest);
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
        });
      }
    });

    this.bullets.list.forEach(it=>{
      if (!it.isDeleted){
        it.render(context, deltaTime, this.camera);
      }
    })

    this.getPlayerList().forEach(player=>{
      player.fall(this.map, deltaTime);  
    });

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

    let c = new Vector(0,0);
    let move = false;
    let tryJump = false;
    let keyCode = '';
    if (keyboardState['KeyW']){c.y+=-1; tryJump = true; keyCode = 'KeyW';}
//    if (keyboardState['KeyS']){c.y+=1;}
    if (keyboardState['KeyA']){c.x+=-1; move = true; keyCode = 'KeyA';}
    if (keyboardState['KeyD']){c.x+=1; move = true; keyCode = 'KeyD';}

    if (keyboardState['KeyQ']){this.getCurrentPlayer().angle+=-1;}
    if (keyboardState['KeyE']){this.getCurrentPlayer().angle+=1;}

    let freeMovement = false;
    this.getCurrentPlayer().move(freeMovement, c, this.map, move, tryJump, deltaTime, keyCode);

    const shotFunc =()=>{
      this.nextLock = false;
      if (!this.shoted){
        this.shoted = true;
        this.getCurrentPlayer().shot(this.bullets, this.wind);

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
      this.getCurrentPlayer().powerStart();
      this.timer.pause();
    }
    if (this.nextLock && (!keyboardState['Space']||this.getCurrentPlayer().power>5)){
      shotFunc();
    }
  }

  getCurrentPlayer(){
    return this.currentTeam.currentPlayer;
  }

  getPlayerList(){
    let playerList = []
    this.teams.forEach(team=>team.players.forEach(it=>{playerList.push(it)}));  
    return playerList;
  }
}

module.exports = Game;