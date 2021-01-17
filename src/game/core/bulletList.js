const Vector = require('common/vector.js');

class BulletList{
  constructor(){
    this.list = [];
  }

  add(bullet){
    this.list.push(bullet);
  }

  process(deltaTime, map, playerList){
    this.list.forEach((it) => {
      if (it.physic.position.y > 1000) {
        it.isDeleted=true;
      }
      let preNearest = map.getNearIntersection(
        it.physic.position.clone(),
        it.physic.getNextPosition(deltaTime),
        true,
      );
      let nearest = map.getNearIntersection(
        it.physic.position.clone(),
        it.physic.getNextPosition(deltaTime),
      );
      if (!it.isDeleted && nearest) {
        if (it.isReflectable) {
          /* edplode on timeout
         it.timer.onTimeout =()=>{
            it.isDeleted = true;
            this.map.round(it.physic.position, it.magnitude || 30);
          }*/
          let n = map.getNormal(preNearest);
          if (n.abs() == 0) {
            it.physic.speed.scale(-1);
            //it.render(context, deltaTime, this.camera, false);
          } else {
            //it.physic.position = it.physic.position.sub(it.physic.speed.clone().scale(deltaTime));
            it.physic.speed = it.physic.speed.reflect(n).scale(1);
          }
        } else {
          map.round(nearest, it.magnitude || 30);
          it.isDeleted = true;
          playerList.forEach((jt) => {
            let res = damageFromDistance(jt.physic.position, nearest);
            jt.hurt(res.damage);
            jt.physic.speed.add(res.acceleration);
          });
        }
      } else {
        //it.render(context, deltaTime, this.camera, false);
      }
    });
  }

  render(context, deltaTime, camera, process){
    this.list = this.list.filter((it) => !it.isDeleted);
    this.list.forEach((it) => {
        it.render(context, deltaTime, camera, process);
        // it.trace(context, this.camera, (prev, current) => {
        //   let nearest = this.map.getNearIntersection(prev, current);
        //   return nearest;
        // });
    });  
  }
}

function damageFromDistance(posA, posB){
  let damage = 0;
  let accScaler = 0;
  let lvec = posA.clone().sub(posB);
  if (lvec.abs() < 20) {
    accScaler = 7;
    damage = 20;
  } else if (lvec.abs() < 40) {
    accScaler = 4;
    damage = 10;
  } else if (lvec.abs() < 80) {
    accScaler = 3;
    damage = 3;
  }
  return {damage, acceleration: lvec.normalize().scale(accScaler)};
}

module.exports = BulletList;