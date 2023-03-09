import { getWeaponList } from './weaponList';
import { GraphicPoint, PhysicPoint, Physical } from './primitives';
import Vector from 'common/vector';
import Animation from './animation';
import { GameMap } from './map';
import BulletList from './bulletList';
import walksAni from '../../assets/worm-walks-100.png';
import { IWeapon } from './weapons/IWeapon';

class GraphicPlayer extends GraphicPoint {
  animation: Animation;
  health: number;
  name: string;

  constructor(position: Vector, radius: number, color = '#f00') {
    super(position, radius, color);
    this.animation = new Animation(
      walksAni,
      1442,
      100,
      15,
      3,
    );
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector) {
    context.fillStyle = this.color;
    let position = this.position.clone().add(camera);
    context.font = '12px bold "Arial"';
    context.fillText(
      this.health.toString(),
      position.x - context.measureText(this.health.toString()).width / 2,
      position.y - 20,
    );
    context.fillText(
      this.name,
      position.x - context.measureText(this.name).width / 2,
      position.y - 33,
    );
    super.render(context, deltaTime, camera);
    this.animation.render(
      context,
      deltaTime,
      this.position.clone().add(camera),
    );
  }
}

class Player {
  name: string;
  health: number;
  weapons: (IWeapon)[];
  currentWeapon: IWeapon;
  angle: number;
  angleSpeed: number;
  physic: PhysicPoint;
  graphic: GraphicPlayer;
  target: GraphicPoint;
  powerIndicator: GraphicPoint;
  power: number;
  jumped: boolean;
  isActive: boolean;
  isPower: boolean;
  onShot: () => void;
  onKilled: () => void;

  constructor(name: string, health: number, pos: Vector, color: string) {
    this.name = name;
    this.health = health;
    this.weapons = getWeaponList();
    this.currentWeapon = this.weapons[0];
    this.angle = 0;
    this.angleSpeed = 0;

    this.physic = new PhysicPoint(pos);
    this.graphic = new GraphicPlayer(pos, 1, color);
    this.target = new GraphicPoint(pos, 5, color);
    this.powerIndicator = new GraphicPoint(pos, 0, color);
    this.power = 0;
    this.jumped = false;
  }

  setActive(isActive: boolean) {
    this.graphic.radius = isActive ? 15 : 10;
    !isActive && this.setMoveAnimation(false);
    this.isActive = isActive;
  }

  setMoveAnimation(value: boolean, keyCode?: string) {
    if (value) {
      if (!this.graphic.animation.isStarted) {
        this.graphic.animation.start(keyCode);
      }
    } else {
      this.graphic.animation.stop();
    }
  }

  setWeapon(index: number) {
    this.currentWeapon = this.weapons[index];
  }

  hurt(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.onKilled();
    }
  }

  cure(damage: number) {
    this.health += damage;
  }

  powerStart() {
    this.isPower = true;
    this.power = 0;
  }

  powerEnd() {
    this.isPower = false;
    this.power = 0;
  }

  powerUp(deltaTime: number) {
    if (this.isPower) {
      this.power += deltaTime;
    }
    this.powerIndicator.radius = this.power*2;
    this.powerIndicator.position = this.getDirectionVector()
      .scale(this.power * 20)
      .add(this.graphic.position);
  }

  getDirectionVector() {
    return new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30));
  }

  shot(bullets: BulletList, wind: number) {
    let direction = this.getDirectionVector();
    if (this.currentWeapon) {
      this.currentWeapon.shot(
        bullets,
        this.graphic.position,
        direction,
        this.power,
        wind,
      );
      this.onShot && this.onShot();
      this.powerEnd();
    }
  }

  setShotOptions(wind: number) {
    let direction = this.getDirectionVector();
    if (this.currentWeapon) {
      this.currentWeapon.setShotOptions(
        this.graphic.position,
        direction,
        this.power,
        wind,
      );
    }
  }

  react(bullets: BulletList, deltaTime: number) {
    bullets.list.forEach((it) => {
      if (it.graphic.position.clone().sub(this.graphic.position).abs() < 10) {
        if (!it.isDeleted) {
          //it.isDeleted = true;
          it.timer.counter = 0;
          this.hurt(70);
        }
      }
    });
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector) {
    this.graphic.position = this.physic.position;
    this.powerUp(deltaTime);

    if (Math.abs(this.angleSpeed) > 10) {
      this.angleSpeed = Math.sign(this.angleSpeed) * 10;
    }
    this.angle = this.angle + this.angleSpeed * deltaTime;
    this.target.position = this.getDirectionVector()
      .scale(100)
      .add(this.graphic.position);
    this.graphic.health = this.health;
    this.graphic.name = this.name;
    this.graphic.render(context, deltaTime, camera);
    this.powerIndicator.render(context, deltaTime, camera);
    if (this.isActive) {
      this.target.render(context, deltaTime, camera);
    }
  }

  move(freeMode: boolean, moveVector: Vector, map: GameMap, move: boolean, tryJump: boolean, deltaTime: number, keyCode: string) {
    if (freeMode) {
      movePlayerFree(this, moveVector, map);
    } else {
      movePlayer(this, moveVector, map, move, tryJump, deltaTime, keyCode);
    }
  }

  fall(map: GameMap, deltaTime: number) {
    fallPlayer(this, map, deltaTime);
  }

  setTargetPoint(playersToHit: Player[], camera: Vector, map: GameMap, wind: number) {
    let minGap = Number.MAX_VALUE;
    let target = 0;
    let speed = 0;
    for (let p = 0; p < playersToHit.length; p++) {
      let player = playersToHit[p];
      for (let s = 0; s <= 5; s += 1) {
        this.power = s;
        for (let i = 0; i < Math.PI * 30 * 2; i += (Math.PI * 30 * 2) / 190) {
          this.moveTarget(i);
          this.setShotOptions(wind);
          let targetPoint = this.currentWeapon.trace(map, camera);

          if (targetPoint) {

            let gap = player.physic.position.clone().sub(targetPoint).abs();
            if (gap < minGap) {
              minGap = gap;
              target = i;
              speed = s;
            }
          }
        }
      }
    }
    this.moveTarget(target);
    this.power = speed;
  }

  moveTarget(angle: number) {
    this.angle = angle;
  }
}

function fallPlayer(player: Player, map: GameMap, deltaTime: number) {
  let it = player;
  if (it.physic.position.y > map.waterLineX) {
    it.hurt(1000);
  }
  it.physic.acceleration.y = 1;
  let nearest = map.getNearIntersection(
    it.physic.position.clone(),
    it.physic.getNextPosition(deltaTime),
    true
  );
  if (!nearest){//(map.isEmptyByVector(it.physic.getNextPosition(deltaTime))) {
    it.physic.process(deltaTime);
  } else {
    it.physic.position.from(nearest);
    it.physic.speed.y = 0;
    it.physic.speed.x = 0;
    it.physic.acceleration.y = 0;
  }
}

function movePlayerFree(player: Player, moveVector: Vector, map: GameMap) {
  let size = map.size;
  let physic = player.physic;
  let s = physic.position.clone().add(moveVector);
  if (map.isEmptyByVector(s)) {
    physic.position = s;
  } else {
    let nextPoint = s.clone().add(new Vector(0, -size * 2));
    if (map.isEmptyByVector(nextPoint)) {
      physic.position.from(nextPoint);
    }
  }
}

function movePlayer(
  player: Player,
  moveVector: Vector,
  map: GameMap,
  move: boolean,
  tryJump: boolean,
  deltaTime: number,
  keyCode: string,
) {
  let size = map.size;
  let physic = player.physic;
  physic.acceleration.y = 1;
  physic.speed.x = moveVector.normalize().scale(5).x;
  if (tryJump && !player.jumped) {
    player.jumped = true;
    physic.speed.y = moveVector.y * 2;
  }
  let s = physic.getNextPosition(deltaTime);

  let nearest = map.getNearIntersection(
    physic.position.clone(),
    s,
    true
  );
  if (!nearest){//map.isEmptyByVector(s)) {
  } else {
    let nextPoint = s.clone().add(new Vector(0, -size * 2));
    if (move && map.isEmptyByVector(nextPoint)){//s.clone().add(new Vector(0, -size * 2)))) {
      physic.position.from(nextPoint);//.add(new Vector(0, -size * 2));
    } else {
      physic.acceleration.y = 0;

      physic.speed.y = 0;
      physic.speed.x = 0;
      player.jumped = false;
    }
  }
  player.setMoveAnimation(move || tryJump, keyCode);
}

export default Player;
