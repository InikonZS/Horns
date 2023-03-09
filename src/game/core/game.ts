import Timer from './timer';
import { GameMap } from './map';
import Player from './player';
import Camera from './camera';
import Vector from 'common/vector';
import Particles from './particles';

import Team from './team';
import BoxList from './boxList';
import BulletList from './bulletList';
import TeamList from './teamList';
import { IKeyboardState } from './IKeyboardState';
import { IStartOptions } from './IStartOptions';

const freeMovement = false;

class SilentWatcher {
  events: any[];
  constructor() {
    this.events = [];
  }

  add(event: ()=>void) {
    this.events.push(event);
  }
}

function getRandomSpawnVector(){
  return new Vector(Math.random() * 1700 + 50, /*Math.random() * 500 + 50*/0)
}

class Game {
  camera: Camera;
  wind: number;
  teams: TeamList;
  boxes: BoxList;
  bullets: BulletList;
  //currentTeam: any;
  timer: Timer;
  afterTimer: Timer;
  computerShotTimer: Timer;
  map: GameMap;
  silentWatcher: SilentWatcher;
  parts: Particles;
  onNext: (player:Player, timer: number)=>void;
  shoted: boolean;
  nextLock: boolean;
  onFinish: () => void;

  constructor() {
    this.camera = new Camera(new Vector(0, 0));
    this.wind = 0;
    this.teams = new TeamList();
    this.teams.onLastTeam = ()=>{this.onFinish();}
    this.boxes = new BoxList();
    this.bullets = new BulletList();
    //this.currentTeam = null;
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

  start(options: IStartOptions, onStart:()=>void) {
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

  next(teamIndex?: number) {
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
        .setTargetPoint(this.teams.getPlayersToHit(), this.camera.position, this.map, this.wind);
      this.computerShotTimer.start(15);
    }
  }

  finish() {
    this.timer.pause();
  }

  tick(deltaTime: number) {
    this.timer.tick(deltaTime);
    this.afterTimer.tick(deltaTime);
    this.computerShotTimer.tick(deltaTime);
  }

  /*react(bullets: BulletList, deltaTime: number) {
    this.teams.forEach((it) => {
      it.react(bullets, deltaTime);
    });
  }*/

  private cameraTargetLogic(context: CanvasRenderingContext2D){
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
  }

  render(context: CanvasRenderingContext2D, deltaTime: number) {
    this.cameraTargetLogic(context);
    this.camera.process(deltaTime);
    this.camera.limit(context);

    this.map.renderGradient(context, deltaTime, this.camera.position);
    this.parts.render(context, deltaTime, this.camera.position, this.wind);
    this.map.render(context, deltaTime, this.camera.position);

    this.bullets.process(deltaTime, this.map, this.teams.getPlayerList());
    this.bullets.render(context, deltaTime, this.map, this.camera.position, false);

    this.boxes.render(context, deltaTime, this.camera.position, this.map, this.teams.getPlayerList()),

    this.teams.process(this.map, deltaTime);
    this.teams.render(context, deltaTime, this.camera.position);
  }

  processKeyboard(context: CanvasRenderingContext2D, keyboardState: IKeyboardState, deltaTime: number) {
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
        if (this.bullets.isEmpty()) {
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

  getCenterVector(context: CanvasRenderingContext2D) {
    return new Vector(context.canvas.width / 2, context.canvas.height / 2);
  }
}

export default Game;
