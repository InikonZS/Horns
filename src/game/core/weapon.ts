import { GraphicPoint, PhysicPoint, Physical } from './primitives';
import Vector from 'common/vector';
import Timer from './timer';
import BulletList from './bulletList';
import { GameMap } from './map';

export class Bullet {
  graphic: GraphicPoint;
  physic: PhysicPoint;
  timer: Timer;
  isReflectable: boolean;
  magnitude: number;
  isDeleted: boolean;
  constructor(pos: Vector, radius: number, color: string) {
    this.graphic = new GraphicPoint(pos, radius, color);
    this.physic = new PhysicPoint(pos);
    this.timer = new Timer();
    this.timer.start(10);
    this.isReflectable = false;
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector, proc: any) {
    this.timer.tick(deltaTime);
    !proc && this.physic.process(deltaTime);
    this.graphic.position = this.physic.position;
    this.graphic.render(context, deltaTime, camera);

    context.fillStyle = '#000';
    let position = this.graphic.position.clone().add(camera);
    context.fillText(
      Math.trunc(this.timer.counter).toFixed(0),
      position.x - context.measureText(Math.trunc(this.timer.counter).toFixed(0)).width / 2,
      position.y - 15,
    );
  }

  trace(map: GameMap, camera: Vector, context: CanvasRenderingContext2D) {
    if (context) {
      context.strokeStyle = '#000';
      context.beginPath();
    }

    let prev = this.physic.position.clone();
    for (let i = 1; i < 100; i += 1) {
      let current = this.physic.getPosition(i);
      let c = current.clone().add(camera.position);
      context && context.lineTo(c.x, c.y);
      let nearest = map.getNearIntersection(prev, current);
      if (nearest) {
        // console.log(nearest);
        context && context.stroke();
        return nearest;
      }
      prev = current;
    }
    context && context.stroke();
  }
}

export class Weapon {
  bulletSpeed: number;
  gravitable: boolean;
  isDeleted: boolean;
  constructor(bulletSpeed: number, gravitable = false) {
    this.bulletSpeed = bulletSpeed;
    this.gravitable = gravitable;
    this.isDeleted = false;
    //this.reflectable = true;
  }

  shot(bullets: BulletList, point: Vector, direction: Vector, power = 5) {
    const makeBullet = (cnt: number) => {
      let bullet = new Bullet(
        point.clone().add(direction.clone().scale(11)),
        5,
        '#000',
      );
      if (this.gravitable) {
        bullet.physic.acceleration.y = 0.5;
      }
      bullet.physic.speed = direction
        .clone()
        .scale(this.bulletSpeed * ((5 + 1 + Math.random() * 3) / 2));
      bullets.list.push(bullet);
      bullet.timer.counter = 40;
      bullet.magnitude = 5;
      bullet.timer.onTimeout = () => {
        bullet.isDeleted = true;
      };
      bullet.timer.onTick = (counter) => {
        if (cnt > 0 && counter < 39) {
          bullet.timer.onTick = null;
          makeBullet(cnt - 1);
        }
      };
    };
    makeBullet(5);
  }
}

export class WeaponS {
  bulletSpeed: number;
  gravitable: boolean;
  isDeleted: boolean;
  constructor(bulletSpeed: number, gravitable = false) {
    this.bulletSpeed = bulletSpeed;
    this.gravitable = gravitable;
    this.isDeleted = false;
  }

  shot(bullets: BulletList, point: Vector, direction: Vector, power = 5) {
    let bullet = new Bullet(
      point.clone().add(direction.clone().scale(11)),
      5,
      '#000',
    );
    bullet.isReflectable = true;
    if (this.gravitable) {
      bullet.physic.acceleration.y = 1;
    }
    bullet.physic.speed = direction
      .clone()
      .scale(this.bulletSpeed * ((power + 1) / 2));
    bullets.list.push(bullet);
    bullet.timer.counter = 30;
    bullet.magnitude = 50;
    bullet.timer.onTimeout = () => {
      bullet.isDeleted = true;
    };
  }
}

export class WeaponEx {
  bulletSpeed: number;
  gravitable: boolean;
  isDeleted: boolean;
  tracer: Bullet;
  timerTime: number;
  constructor(bulletSpeed: number, gravitable = false, timer: number) {
    this.bulletSpeed = bulletSpeed;
    this.gravitable = gravitable;
    this.isDeleted = false;
    this.tracer = new Bullet(new Vector(0, 0), 3, 'red');
    this.timerTime = timer;
  }

  setShotOptions(point: Vector, direction: Vector, power = 0, wind: number) {
    this.tracer.physic.position.from(point);
    if (this.gravitable) {
      this.tracer.physic.acceleration.y = 3;
      this.tracer.physic.acceleration.x = wind / 3;
    }
    this.tracer.physic.speed = direction
      .clone()
      .scale(this.bulletSpeed * (power + 1));
  }

  shot(bullets: BulletList, point: Vector, direction: Vector, power = 5, wind: number) {
    let bullet = new Bullet(
      point.clone().add(direction.clone().scale(11)),
      5,
      '#000',
    );
    if (this.gravitable) {
      bullet.physic.acceleration.y = 3;
      bullet.physic.acceleration.x = wind / 3;
    }
    bullet.physic.speed = direction
      .clone()
      .scale(this.bulletSpeed * (power + 1));

    bullets.list.push(bullet);
    bullet.timer.counter = this.timerTime;
    bullet.timer.onTimeout = () => {
      for (let i = 0; i < 5; i++) {
        //let bull = new Physical(point.clone().add(direction.clone().scale(11)), 5, '#000');
        let bull = new Bullet(
          bullet.graphic.position.clone().add(direction.clone().scale(11)),
          5,
          '#000',
        );
        bull.magnitude = 15;
        bull.physic.acceleration.y = 1;
        // bull.physic.acceleration.x = wind/3;
        bull.physic.speed = direction.clone().scale(0.1 + 2 * i);
        bullets.list.push(bull);
        bull.timer.counter = 80;
        bull.timer.onTimeout = () => {
          bull.isDeleted = true;
        };
        //console.log(bullets);
      }
      bullet.isDeleted = true;
    };
  }
}

//export default { WeaponEx, Weapon, WeaponS };
