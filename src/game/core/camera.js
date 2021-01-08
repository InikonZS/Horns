const Vector = require('common/vector.js');
const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');

class Camera extends PhysicPoint{
  constructor (pos){
    super(pos);
    this.targetVector = null;
    this.cameraAutoMode = 0;
    this.enableAutoMove = true;
    this.scaler = 1;
  }

  setTargetVector(targetVector, mode, scaler){
    this.targetVector = targetVector;  
    this.cameraAutoMode = mode;
    this.scaler = scaler;
  }

  move(keyboardState, moveSpeed=8, deltaTime){
    let moveVector = new Vector(0, 0);
    if (keyboardState['ArrowUp']){moveVector.y=-4;}
    if (keyboardState['ArrowDown']){moveVector.y=4;}
    if (keyboardState['ArrowLeft']){moveVector.x=-4;}
    if (keyboardState['ArrowRight']){moveVector.x=4;}  
    if (moveVector.abs()>0){
      this.position.sub(moveVector.normalize().scale(moveSpeed*deltaTime));
      this.enableAutoMove = false;
    }
  }

  process(deltaTime){
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
  }
}

module.exports = Camera;