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
  
    trace(map: GameMap, camera: Vector, context?: CanvasRenderingContext2D) {
      if (context) {
        context.strokeStyle = '#000';
        context.beginPath();
      }
  
      let prev = this.physic.position.clone();
      for (let i = 1; i < 100; i += 1) {
        let current = this.physic.getPosition(i);
        let c = current.clone().add(camera);
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