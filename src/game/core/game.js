const Timer = require('./timer.js');
const Box = require('./box.js');
const GameMap = require('./map.js');
const Player = require('./player.js');
const Camera = require('./camera.js');
const Vector = require('common/vector.js');
const Particles = require('./particles.js');
//const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Team = require('./team.js');

class SilentWatcher {
  constructor() {
    this.events = [];
  }

  add(event) {
    this.events.push(event);
  }
}

class Game {
  constructor() {
    this.camera = new Camera(new Vector(0, 0));
    this.wind = 0;
    this.teams = [];
    this.boxes = [];
    this.bullets = { list: [] };
    this.currentTeam = null;
    this.timer = new Timer();
    this.afterTimer = new Timer();
    this.computerShotTimer = new Timer();
    this.computerShotTimer.onTimeout = () => {
      this.shotFunc();
    };
    this.map; //= new GameMap();
    this.silentWatcher = new SilentWatcher();
    this.timer.onTimeout = () => {
      this.next();
    };
    this.parts = new Particles(100);
  }

  getActiveTeams() {
    return this.teams.filter((it) => it.players.length);
  }

  getPlayersToHit() {
    return this.teams
      .filter((it) => it !== this.currentTeam)
      .reduce((list, it) => list.concat(it.players), []);
  }

  addTeam(team) {
    this.teams.push(team);
    team.onKilled = () => {
      //this.teams = this.teams.filter(it=>it!=team);
      if (this.getActiveTeams().length <= 1) {
        console.log('win');
        this.onFinish && this.onFinish();
      }
    };
  }

  start(options) {
    this.map = new GameMap(options.mapURL);
    for (let j = 0; j < options.teams.length; j++) {
      let team = new Team(options.teams[j].name, options.teams[j].avatar, options.teams[j].isComputer);
      for (let i = 0; i < options.teams[j].playersNumber; i++) {
        let pl = new Player(
          options.nameList[i + j * options.teams.length],
          options.teams[j].playersHealts,
          new Vector(Math.random() * 1700 + 50, Math.random() * 500 + 50),
          options.colorList[j],
        );
        team.addPlayer(pl);
      }
      this.addTeam(team);
    }
    this.next(0);
  }

  next(teamIndex) {
    let timerSpan = 85;
    if (this.getActiveTeams().length > 1) {
      if (Math.random() < 0.2) {
        this.boxes.push(
          new Box(
            new Vector(Math.random() * 1700 + 50, Math.random() * 500 + 50),
          ),
        );
      }
      this.timer.start(timerSpan);
      this.wind = Math.random() * 11 - 5;

      let nextTeamIndex = teamIndex;
      if (teamIndex === undefined) {
        nextTeamIndex =
          (this.teams.indexOf(this.currentTeam) + 1) % this.teams.length;
        while (!this.teams[nextTeamIndex].players.length) {
          nextTeamIndex = (nextTeamIndex + 1) % this.teams.length;
        }
      }

      this.currentTeam = this.teams[nextTeamIndex];
      let currentPlayer = this.currentTeam.nextPlayer();
      this.getPlayerList().forEach((jt) => {
        jt.setActive(false);
      });
      currentPlayer.setActive(true);

      //this.camera.speed = this.camera.position.clone().sub(currentPlayer.physic.position).normalize().scale(123);

      this.onNext && this.onNext(currentPlayer, timerSpan);
    } else {
      this.finish();
    }

    if (this.currentTeam.isComputer) {
      this.getCurrentPlayer()
        .setTargetPoint(this.getPlayersToHit(), this.camera, this.map, this.wind);
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
    this.bullets.list.forEach((it) => {
      let preNearest = this.map.getNearIntersection(
        it.physic.position.clone(),
        it.physic.getNextPosition(deltaTime),
        true,
      );
      let nearest = this.map.getNearIntersection(
        it.physic.position.clone(),
        it.physic.getNextPosition(deltaTime),
      );
      if (!it.isDeleted && nearest) {
        if (it.isReflectable) {
          /* edplode on timeout
         it.timer.onTimeout =()=>{
            it.isDeleted = true;
            this.map.round(it.physic.position, it.magnitude || 30);
          }*/
          let n = this.map.getNormal(preNearest);
          if (n.abs() == 0) {
            it.physic.speed.scale(-1);
            it.render(context, deltaTime, this.camera, false);
          } else {
            //it.physic.position = it.physic.position.sub(it.physic.speed.clone().scale(deltaTime));
            it.physic.speed = it.physic.speed.reflect(n).scale(1);
          }
        } else {
          this.map.round(nearest, it.magnitude || 30);
          it.isDeleted = true;
          this.getPlayerList().forEach((jt) => {
            let lvec = jt.physic.position.clone().sub(nearest);
            if (lvec.abs() < 20) {
              jt.physic.speed.add(lvec.normalize().scale(7));
              jt.hurt(20);
            } else if (lvec.abs() < 40) {
              jt.physic.speed.add(lvec.normalize().scale(4));
              jt.hurt(10);
            } else if (lvec.abs() < 80) {
              jt.physic.speed.add(lvec.normalize().scale(3));
              jt.hurt(3);
            }
          });
        }
      } else {
        it.render(context, deltaTime, this.camera, false);
      }
    });

    // this.getCurrentPlayer().setShotOptions(this.wind);
    // this.getCurrentPlayer().currentWeapon.tracer.trace(this.map, this.camera, context
    //   (prev, current) => {
    //   let nearest = this.map.getNearIntersection(prev, current);
    //   return nearest;
    // }
    // );

    this.bullets.list.forEach((it) => {
      if (!it.isDeleted) {
        it.render(context, deltaTime, this.camera, true);
        // it.trace(context, this.camera, (prev, current) => {
        //   let nearest = this.map.getNearIntersection(prev, current);
        //   return nearest;
        // });
      }
    });

    this.getPlayerList().forEach((player) => {
      player.fall(this.map, deltaTime);
    });

    this.bullets.list = this.bullets.list.filter((it) => !it.isDeleted);

    this.boxes.forEach((it) =>
      it.render(context, deltaTime, this.camera, this.map, this.teams),
    );
    this.teams.forEach((it) => {
      it.render(context, deltaTime, this.camera);
    });
  }

  processKeyboard(context, keyboardState, deltaTime) {
    this.camera.move(context, keyboardState, 80, deltaTime);

    if (!this.currentTeam.isComputer) {
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
        this.camera.enableAutoMove = true;
      } else if (keyboardState['KeyE']) {
        this.getCurrentPlayer().angleSpeed += 1 * deltaTime;
        this.camera.enableAutoMove = true;
      } else {
        this.getCurrentPlayer().angleSpeed = 0;
      }

      let freeMovement = false;
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
      !this.currentTeam.isComputer
    ) {
      this.nextLock = true;
      this.getCurrentPlayer().powerStart();
      this.timer.pause();
    }
    if (
      this.nextLock &&
      ((!this.currentTeam.isComputer && !keyboardState['Space']) ||
        this.getCurrentPlayer().power > 5)
    ) {
      this.shotFunc();
    }
  }

  shotFunc() {
    this.nextLock = false;
    if (!this.shoted) {
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
    return this.currentTeam.currentPlayer;
  }

  getPlayerList() {
    let playerList = [];
    this.teams.forEach((team) =>
      team.players.forEach((it) => {
        playerList.push(it);
      }),
    );
    return playerList;
  }

  getCenterVector(context) {
    return new Vector(context.canvas.width / 2, context.canvas.height / 2);
  }
}

module.exports = Game;
