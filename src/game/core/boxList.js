const Box = require('./box.js');
const Vector = require('common/vector.js');

class BoxList{
  constructor(){
    this.list = [];
  }
  
  add(box){
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

  render(context, deltaTime, camera, map, teams){
    this.list = this.list.filter((it) => !it.isDeleted);
    this.list.forEach((it) => {
      it.render(context, deltaTime, camera, map, teams)
    });  
  }
}

module.exports = BoxList;