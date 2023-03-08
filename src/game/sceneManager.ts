import Control from 'common/control';
import { IPage } from 'src/application/IPage';

class SceneManager extends Control{
  scenes: IPage[];
  currentScene: IPage;
  currentIndex: number;
  history: IPage[];

  constructor (parentNode: HTMLElement){
    super(parentNode);
    this.node.style.position = 'relative';
    this.scenes = [];
    this.currentScene = null;
    this.currentIndex = -1;
    this.history = [];
  }

  add(scene: IPage){
    scene.hide();
    this.scenes.push(scene);
  }

  selectByName(name: string){
    let index = this.scenes.findIndex(it=>it.name == name);
    this.select(index);
  }

  selectByScene(scene: IPage){
    let index = this.scenes.indexOf(scene);
    this.select(index);
  }

  back(){
    let lastScene = this.history.pop();
    this.selectByScene(lastScene);
    this.history.pop();
  }

  select(index: number){
    this.history.push(this.currentScene);
    this.scenes.forEach((it, i)=>{
      if (i!=index){
        it.hide();
      } else {
        it.show();
        this.currentScene = it;
        this.currentIndex = i;
      }
    });
  }
}

export default SceneManager;