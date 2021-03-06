const Control = require('common/control.js');

class SceneManager extends Control{
  constructor (parentNode){
    super(parentNode);
    this.node.style.position = 'relative';
    this.scenes = [];
    this.currentScene = null;
    this.currentIndex = -1;
    this.history = [];
  }

  add(scene){
    scene.hide();
    this.scenes.push(scene);
  }

  selectByName(name){
    let index = this.scenes.findIndex(it=>it.name == name);
    this.select(index);
  }

  selectByScene(scene){
    let index = this.scenes.indexOf(scene);
    this.select(index);
  }

  back(){
    let lastScene = this.history.pop();
    this.selectByScene(lastScene);
    this.history.pop();
  }

  select(index){
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

module.exports = SceneManager;