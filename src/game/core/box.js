const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Vector = require('common/vector.js');

class Box{
  constructor(pos){
    this.graphic = new GraphicPoint(pos, 20, '#999');
    this.physic = new PhysicPoint(pos); 
    this.physic.acceleration.y=1;
  }

  render(context, deltaTime, camera, map, teams){
    if (this.isDeleted){ return false;}
    teams.forEach(team=>team.players.forEach(it=>{
      let lvec = this.physic.position.clone().sub(it.graphic.position);
      if (lvec.abs()<10){
        it.cure(10);
        this.isDeleted = true;
        //this.graphic.radius=3;
      }  
    }));
    if (map.isEmptyByVector(this.physic.getNextPosition(deltaTime))){
      this.physic.process(deltaTime);
    } else {
      this.physic.speed.y=0;
      this.physic.speed.x=0; 
    }
    //this.physic.process(deltaTime);
    this.graphic.position = this.physic.position;
    this.graphic.render(context, deltaTime, camera);
  }
}

module.exports = Box;