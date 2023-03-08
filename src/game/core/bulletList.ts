import Vector from 'common/vector';
import Camera from './camera';
import { GameMap } from './map';
import Player from './player';
import { Bullet } from './weapon';

class BulletList{
  list: Bullet[];
  allowTrace: boolean;
  
  constructor(){
    this.list = [];
    this.allowTrace = false;
  }

  add(bullet: Bullet){
    this.list.push(bullet);
  }

  process(deltaTime: number, map: GameMap, playerList: Array<Player>){
    this.list.forEach((it) => {
      if (it.physic.position.y > map.waterLineX) {
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
          it.timer.onTimeout =()=>{
            bulletExplode(it, it.physic.position, map, playerList);
          }
          let n = map.getNormal(preNearest);
          it.physic.reflect(n, 0.7);
        } else {
          bulletExplode(it, nearest, map, playerList);
        }
      } else {
        //it.render(context, deltaTime, this.camera, false);
      }
    });
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, map: GameMap, camera: Vector, process: boolean){
    this.list = this.list.filter((it) => !it.isDeleted);
    this.list.forEach((it) => {
        it.render(context, deltaTime, camera, process);
        this.allowTrace && it.trace(map, camera, context);
    });  
  }
}

function bulletExplode(bullet: Bullet, position: Vector, map: GameMap, playerList: Array<Player>){
  map.round(position, bullet.magnitude || 30);
  bullet.isDeleted = true;
  playerList.forEach((jt) => {
    let res = damageFromDistance(jt.physic.position, position);
    jt.hurt(res.damage);
    jt.physic.speed.add(res.acceleration);
  });
}

function damageFromDistance(posA: Vector, posB: Vector){
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

export default BulletList;