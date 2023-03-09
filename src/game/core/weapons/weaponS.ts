import Vector from 'common/vector';
import BulletList from '../bulletList';
import { Bullet } from '../bullet';
import { GameMap } from '../map';
import { IWeapon } from './IWeapon';

export class WeaponS implements IWeapon {
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
  
    setShotOptions(point: Vector, direction: Vector, power: number, wind: number): void {
      console.warn('Not tracable weapon');
    }
  
    trace(map: GameMap, camera: Vector): Vector {
      console.warn('Not tracable weapon');
      return null;
    }
}
  