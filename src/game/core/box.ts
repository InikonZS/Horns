import { GraphicPoint, PhysicPoint, Physical } from './primitives';
import Vector from 'common/vector';
import Animation from './animation';
import { GameMap } from './map';
import Player from './player';
import boxAni from '../..//assets/aid-100.png';

class Box{
  private graphic: GraphicPoint;
  public physic: PhysicPoint;
  private animation: Animation;
  public isDeleted: boolean;
  public isSpawned: boolean = true;
  public onStop: () => void;

  constructor(pos: Vector){
    this.graphic = new GraphicPoint(pos, 0, '#999');
    this.physic = new PhysicPoint(pos);
    this.physic.acceleration.y=1;
    this.animation = new Animation(boxAni, 4000, 100, 40, 1.5);
    this.animation.start();
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector, map: GameMap, players: Player[]){
    if (map.isUnderWater(this.physic.position)){ 
      this.isDeleted = true; 
      this.isSpawned = false;
      return;}
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
      if (this.isSpawned){
        this.isSpawned = false;
        this.onStop?.();
      }
    }
    //this.physic.process(deltaTime);
    this.graphic.position = this.physic.position;
    this.graphic.render(context, deltaTime, camera);
    this.animation.render(context, deltaTime, this.physic.position.clone().add(camera));
  }
}

export default Box;