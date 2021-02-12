const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Vector = require('common/vector.js');
const Animation = require('./animation');

class Box{
  constructor(pos){
    this.graphic = new GraphicPoint(pos, 0, '#999');
    this.physic = new PhysicPoint(pos);
    this.physic.acceleration.y=1;
    this.animation = new Animation('./assets/aid-100.png', 4000, 100, 40, 1.5);
    this.animation.start();
  }

  render(context, deltaTime, camera, map, players){
    if (this.physic.position.y>map.waterLineX){ this.isDeleted = true; return;}
    if (this.isDeleted){ return false;}
    players.forEach(it=>{
      let lvec = this.physic.position.clone().sub(it.graphic.position);
      if (lvec.abs()<10){
        it.cure(10);
        this.isDeleted = true;
        //this.graphic.radius=3;
      }
    });
    let nearest = map.getNearIntersection(this.physic.position.clone(), this.physic.getNextPosition(deltaTime));
    if (!nearest){//map.isEmptyByVector(this.physic.getNextPosition(deltaTime))){
      this.physic.process(deltaTime);
    } else {
      this.physic.speed.y=0;
      this.physic.speed.x=0;
      this.animation.stop();
    }
    //this.physic.process(deltaTime);
    this.graphic.position = this.physic.position;
    this.graphic.render(context, deltaTime, camera);
    this.animation.render(context, deltaTime, this.physic.position.clone().add(camera));
  }
}

module.exports = Box;