import Vector from 'common/vector';
import { IKeyboardState } from './IKeyboardState';
import { GraphicPoint, PhysicPoint, Physical } from './primitives';

class Camera extends PhysicPoint{
  targetVector: Vector;
  cameraAutoMode: number;
  enableAutoMove: boolean;
  scaler: number;

  constructor (pos: Vector){
    super(pos);
    this.targetVector = null;
    this.cameraAutoMode = 0;
    this.enableAutoMove = true;
    this.scaler = 1;
  }

  setTargetVector(targetVector: Vector, mode: number, scaler: number){
    this.targetVector = targetVector.add(new Vector(0, 100));
    this.cameraAutoMode = mode;
    this.scaler = scaler;
  }

  move(context: CanvasRenderingContext2D, keyboardState: IKeyboardState, moveSpeed=8, deltaTime: number){
    let moveVector = new Vector(0, 0);
    if (keyboardState['ArrowUp']){moveVector.y=-4;}
    if (keyboardState['ArrowDown']){moveVector.y=4;}
    if (keyboardState['ArrowLeft']){moveVector.x=-4;}
    if (keyboardState['ArrowRight']){moveVector.x=4;}
    if (moveVector.abs()>0){
      let nextPosition = this.position.sub(moveVector.normalize().scale(moveSpeed*deltaTime));
      this.limit(context, nextPosition);
      this.enableAutoMove = false;
    }
  }

  limit(context: CanvasRenderingContext2D, nextPosition: Vector){
      let minX = 800;
      if (nextPosition.x>minX){ nextPosition.x = minX }
      let limX = -800-2000+context.canvas.width;
      if (nextPosition.x<limX){ nextPosition.x = limX }
      let limY = -1000+context.canvas.height
      if (nextPosition.y<limY){ nextPosition.y = limY}
      let minY = 500;
      if (nextPosition.y>minY){ nextPosition.y = minY}
      this.position.from(nextPosition);
  }

  process(context: CanvasRenderingContext2D, deltaTime: number){
    if (this.enableAutoMove && this.targetVector){
      let cameraAutoMode = this.cameraAutoMode;
      let toTarget = this.position.clone().scale(-1).sub(this.targetVector);
      if (toTarget.abs()<20+this.scaler){
        this.speed.scale(0.9);
      } else {
        if (cameraAutoMode == 1){
          this.speed = toTarget.normalize().scale(this.scaler);
        } else if (cameraAutoMode == 2) {
          this.speed = toTarget.scale(this.scaler);
        } else {
          this.speed.scale(0);
        }
      }
    } else {
      this.speed.scale(0);
    }
    super.process(deltaTime);
    this.limit(context, this.position);
  }
}

export default Camera;