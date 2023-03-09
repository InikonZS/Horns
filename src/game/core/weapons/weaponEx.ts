import Vector from 'common/vector';
import BulletList from '../bulletList';
import { Bullet } from '../bullet';
import { GameMap } from '../map';
import { IWeapon } from './IWeapon';

export class WeaponEx implements IWeapon {
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
  
      bullets.add(bullet);
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
          bullets.add(bull);
          bull.timer.counter = 80;
          bull.timer.onTimeout = () => {
            bull.isDeleted = true;
          };
          //console.log(bullets);
        }
        bullet.isDeleted = true;
      };
    }
  
    trace(map: GameMap, camera: Vector): Vector {
      return this.tracer.trace(map, camera);
    }
  }