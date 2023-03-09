import Vector from 'common/vector';
import BulletList from '../bulletList';
import { Bullet } from '../bullet';
import { GameMap } from '../map';
import { IWeapon } from './IWeapon';

export class Weapon implements IWeapon {
    private bulletSpeed: number;
    private gravitable: boolean;
    private isDeleted: boolean;

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
        bullets.add(bullet);
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
  
    setShotOptions(point: Vector, direction: Vector, power: number, wind: number): void {
      console.warn('Not tracable weapon');
    }
  
    trace(map: GameMap, camera: Vector): Vector {
      console.warn('Not tracable weapon');
      return null;
    }
}
