import Box from './box';
import Vector from 'common/vector';
import Camera from './camera';
import { GameMap } from './map';

class BoxList{
  private list: Box[];

  constructor(){
    this.list = [];
  }
  
  add(box: Box){
    this.list.push(box);
  }

  spawnBox(){
    this.add(
      new Box(
        new Vector(Math.random() * 1700 + 50, Math.random() * 500 + 50),
      ),
    );
  }

  spawnRandom(){
    if (Math.random() < 0.2) {
      this.spawnBox();
    }
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector, map: GameMap, teams: any[]){
    this.list = this.list.filter((it) => !it.isDeleted);
    this.list.forEach((it) => {
      it.render(context, deltaTime, camera, map, teams)
    });  
  }
}

export default BoxList;