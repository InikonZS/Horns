const {inBox, loadBitmap, readImageData} = require('common/utils.js');

class GameMap{
  constructor(){
    this.map = [];
    loadBitmap('./assets/bitmap.png', (data)=>{
      for (let i=0; i<data.height; i++){
        let row = [];
        for (let j=0; j<data.width; j++){
          row.push(0);
        }
        this.map.push(row);
      }
      readImageData(data, (x, y, color)=>{
        this.map[y][x] = color[0]?0:1;    
      })  
    }) 
  }

  render(context){
    let map = this.map;
    let size = 10;
    for (let i=0; i<map.length; i++){
      for (let j=0; j<map[0].length; j++){
        if (map[i][j]==1){
          context.fillRect(j*size, i*size, size, size);
        }
      }
    }  
  }
}

module.exports = GameMap;