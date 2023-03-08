const Timer = require('./timer.js');
const { GameMap } = require('./map.js');
const Player = require('./player.js');
const Camera = require('./camera.js');
const Vector = require('common/vector.js');
const Particles = require('./particles.js');

const Team = require('./team.js');
const BoxList = require('./boxList.js');
const BulletList = require('./bulletList.js');
const TeamList = require('./teamList.js');

const freeMovement = false;

class SilentWatcher {
  constructor() {
    this.events = [];
  }

  add(event) {
    this.events.push(event);
  }
}

function getRandomSpawnVector(){
  return new Vector(Math.random() * 1700 + 50, /*Math.random() * 500 + 50*/0)
}

class Game {
  constructor() {
    this.camera = new Camera(new Vector(0, 0));
    this.wind = 0;
    this.teams = new TeamList();
    this.teams.onLastTeam = ()=>{this.onFinish();}
    this.boxes = new BoxList();
    this.bullets = new BulletList();
    this.currentTeam = null;
    this.timer = new Timer();
    this.afterTimer = new Timer();
    this.computerShotTimer = new Timer();
    this.computerShotTimer.onTimeout = () => {
      this.timer.pause();
      this.shotFunc();
    };
    this.map;
    this.silentWatcher = new SilentWatcher();
    this.timer.onTimeout = () => {
      this.next();
    };
    this.parts = new Particles(100);
  }

  start(options, onStart) {
    this.map = new GameMap(options.mapURL, ()=>{
      for (let j = 0; j < options.teams.length; j++) {
        let jteam = options.teams[j];
        let team = new Team(jteam.name, jteam.avatar, jteam.isComputer, jteam.color);
        for (let i = 0; i < jteam.playersNumber; i++) {
          let pl = new Player(
            options.nameList[i + j * options.teams.length],
            jteam.playersHealts,
            getRandomSpawnVector(),
            options.teams[j].color,
          );
          team.addPlayer(pl);
        }
        this.teams.add(team);
      }
      this.next(0);
      onStart();
    });
  }

  next(teamIndex) {
    let timerSpan = 85;
    this.camera.enableAutoMove = true;
    if (this.teams.getActiveTeams().length > 1) {
      this.boxes.spawnRandom();

      this.timer.start(timerSpan);
      this.wind = Math.random() * 11 - 5;

      let currentPlayer = this.teams.nextTeam(teamIndex);
      this.onNext && this.onNext(currentPlayer, timerSpan);
    } else {
      this.finish();
    }

    if (this.teams.currentTeam.isComputer) {
      this.getCurrentPlayer()
        .setTargetPoint(this.teams.getPlayersToHit(), this.camera, this.map, this.wind);
      this.computerShotTimer.start(15);
    }
  }

  finish() {
    this.timer.pause();
  }

  tick(deltaTime) {
    this.timer.tick(deltaTime);
    this.afterTimer.tick(deltaTime);
    this.computerShotTimer.tick(deltaTime);
  }

  react(bullets, deltaTime) {
    this.teams.forEach((it) => {
      it.react(bullets, deltaTime);
    });
  }

  render(context, deltaTime) {
    if (this.bullets.list[0]) {
      this.camera.setTargetVector(
        this.bullets.list[0].physic.position
          .clone()
          .sub(this.getCenterVector(context)),
        1,
        50,
      );
    } else {
      this.camera.setTargetVector(
        this.getCurrentPlayer()
          .physic.position.clone()
          .sub(this.getCenterVector(context)),
        2,
        0.25,
      );
    }
    this.camera.process(context, deltaTime);

    this.map.renderGradient(context, deltaTime, this.camera);
    this.parts.render(context, deltaTime, this.camera, this.wind);
    this.map.render(context, deltaTime, this.camera);

    this.bullets.process(deltaTime, this.map, this.teams.getPlayerList());
    this.bullets.render(context, deltaTime, this.map, this.camera, false);

    this.boxes.render(context, deltaTime, this.camera, this.map, this.teams.getPlayerList()),

    this.teams.process(this.map, deltaTime);
    this.teams.render(context, deltaTime, this.camera);
  }

  processKeyboard(context, keyboardState, deltaTime) {
    this.camera.move(context, keyboardState, 80, deltaTime);

    if (!this.teams.currentTeam.isComputer) {
      let c = new Vector(0, 0);
      let move = false;
      let tryJump = false;
      let keyCode = '';
      if (keyboardState['KeyW']) {
        c.y += -1;
        tryJump = true;
        keyCode = 'KeyW';
        this.camera.enableAutoMove = true;
      }
      if (keyboardState['KeyA']) {
        c.x += -1;
        move = true;
        keyCode = 'KeyA';
        this.camera.enableAutoMove = true;
      }
      if (keyboardState['KeyD']) {
        c.x += 1;
        move = true;
        keyCode = 'KeyD';
        this.camera.enableAutoMove = true;
      }

      if (keyboardState['KeyQ']) {
        this.getCurrentPlayer().angleSpeed += -1 * deltaTime;
        //this.camera.enableAutoMove = true;
      } else if (keyboardState['KeyE']) {
        this.getCurrentPlayer().angleSpeed += 1 * deltaTime;
        //this.camera.enableAutoMove = true;
      } else {
        this.getCurrentPlayer().angleSpeed = 0;
      }

      this.getCurrentPlayer().move(
        freeMovement,
        c,
        this.map,
        move,
        tryJump,
        deltaTime,
        keyCode,
      );
    }

    if (
      !this.shoted &&
      !this.nextLock &&
      keyboardState['Space'] &&
      !this.teams.currentTeam.isComputer
    ) {
      this.nextLock = true;
      this.getCurrentPlayer().powerStart();
      this.timer.pause();
    }
    if (
      this.nextLock &&
      ((!this.teams.currentTeam.isComputer && !keyboardState['Space']) ||
        this.getCurrentPlayer().power > 5)
    ) {
      this.shotFunc();
    }
  }

  shotFunc() {
    this.nextLock = false;
    if (!this.shoted) {
      this.camera.enableAutoMove = true;
      this.shoted = true;
      this.getCurrentPlayer().shot(this.bullets, this.wind);

      this.afterTimer.start(10);
      this.afterTimer.onTimeout = () => {
        if (!this.bullets.list.length) {
          this.afterTimer.pause();
          this.shoted = false;
          this.next();
        } else {
          this.afterTimer.start(10);
        }
      };
    }
  }

  getCurrentPlayer() {
    return this.teams.getCurrentPlayer();
  }

  getCenterVector(context) {
    return new Vector(context.canvas.width / 2, context.canvas.height / 2);
  }
}

module.exports = Game;
