const {inBox, loadBitmap, readImageData} = require('common/utils.js');

function mapToImage(map){
  let canvas = document.createElement('canvas');
  canvas.width = map.map[0].length;
  canvas.height = map.map.length;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#cc3';
  let size=1;
  for (let i=0; i<map.map.length; i++){
    for (let j=0; j<map.map[0].length; j++){
      if (map.map[i][j]==1){
        ctx.fillRect(j*size, i*size, size, size);
      }
    }
  }
  //let im = new Image(); 
  
  return ctx.canvas.toDataURL();
}

class GameMap{
  constructor(){
    this.map = [];
    this.size = 2;
    this.image = new Image();
    this.image.src = './assets/bitmap2.png';
    loadBitmap('./assets/bitmap2.png', (data)=>{
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
    let size = this.size;
    this.context = context;
    try{
    context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.image.width*this.size, this.image.height*this.size);
    }catch(e){

    }
    /* for (let i=0; i<map.length; i++){
      for (let j=0; j<map[0].length; j++){
        if (map[i][j]==1){
          context.fillRect(j*size, i*size, size, size);
        }
      }
    }  */
  }

  round(center, radius){
    for (let i=0; i<radius; i+=0.3){
      let max = 100*i;
      for (let a=0; a<max; a++){
        let cpx = Math.trunc(Math.sin(Math.PI*2/max *a)*i+center.x);
        let cpy = Math.trunc(Math.cos(Math.PI*2/max *a)*i+center.y);
        if(this.map[cpy]){
          this.map[cpy][cpx]=0
        };
      }
    }
    this.image.src = mapToImage(this);
  }
}

module.exports = GameMap;