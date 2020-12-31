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

  round(center, radius){
    for (let i=0; i<radius; i++){
      for (let a=0; a<100; a++){
        let cpx = Math.trunc(Math.sin(Math.PI*2/100 *a)*i+center.x);
        let cpy = Math.trunc(Math.cos(Math.PI*2/100 *a)*i+center.y);
        if(this.map[cpy]){
          this.map[cpy][cpx]=0
        };
      }
    }
    
  }
}

module.exports = GameMap;