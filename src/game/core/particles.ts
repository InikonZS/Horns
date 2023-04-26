import Vector from 'common/vector';
import Camera from './camera';
import { GraphicPoint, PhysicPoint, Physical } from './primitives';

class Particles{
  private parts: Array<Physical>;
  
  constructor(count: number){
    this.parts = [];
    for (let i=0; i<count; i++){
      let part = new Physical(new Vector(Math.random()*2500, Math.random()*2000-1000), 5, "#0f0");
      part.physic.speed.y=5;
      this.parts.push(part);
    }
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector, wind: number){
    this.parts.forEach(it=>{
      if (it.physic.position.y>1000){
        it.physic.position.y=-1000;
      }
      if (it.physic.position.x>2500){
        it.physic.position.x=0;
      }
      if (it.physic.position.x<-100){
        it.physic.position.x=2400;
      }
      it.physic.speed.x = 5*wind+Math.random()*4;
      it.render(context, deltaTime, camera);
    });
  }
}

export default Particles;