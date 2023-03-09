import Vector from 'common/vector';
import BulletList from '../bulletList';
import { GameMap } from '../map';

export interface IWeapon {
    shot(bullets: BulletList, point: Vector, direction: Vector, power: number, wind:number): void;
    setShotOptions(point: Vector, direction: Vector, power: number, wind: number): void;
    trace(map: GameMap, camera: Vector): Vector;
}