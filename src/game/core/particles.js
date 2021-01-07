const Vector = require('common/vector.js');
const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');

class Particles{
  constructor(count){
    this.parts = [];
    for (let i=0; i<count; i++){
      let part = new Physical(new Vector(Math.random()*2500, Math.random()*1000), 5, "#0f0");
      part.physic.speed.y=5;
      this.parts.push(part);
    }
  }

  render(context, deltaTime, camera, wind){
    this.parts.forEach(it=>{
      if (it.physic.position.y>1000){
        it.physic.position.y=0;
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

module.exports = Particles;