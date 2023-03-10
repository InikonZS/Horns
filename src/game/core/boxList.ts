import Box from './box';
import Vector from 'common/vector';
import Camera from './camera';
import { GameMap } from './map';

class BoxList{
  private list: Box[];

  constructor(){
    this.list = [];
  }
  
  getActive(){
    return this.list.find(it => it.isSpawned);
  }

  add(box: Box){
    this.list.push(box);
  }

  spawnBox(){
    return new Promise<void>((resolve)=>{
      const box = new Box(
        new Vector(Math.random() * 1700 + 50, Math.random() * 500 + 50),
      );
      box.onStop = ()=>{
        box.onStop = null;
        resolve();
      }
      this.add(
        box
      );
    })
  }

  spawnRandom(){
    if (Math.random() < 0.2) {
      return this.spawnBox();
    }
    return null;
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector, map: GameMap, teams: any[]){
    this.list = this.list.filter((it) => !it.isDeleted);
    this.list.forEach((it) => {
      it.render(context, deltaTime, camera, map, teams)
    });  
  }
}

export default BoxList;