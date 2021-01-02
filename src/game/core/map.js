const {inBox, loadBitmap, readImageData} = require('common/utils.js');

function mapToImage(map){
  let canvas = document.createElement('canvas');
  canvas.width = map.width;
  canvas.height = map.height;
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
  return ctx.canvas.toDataURL();
}

class GameMap{
  constructor(){
    this.map = [];
    this.size = 2;
    this.image = new Image();
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
      });
      this.image.src = mapToImage(this);  
    }) 
  }

  get width(){
    return this.map[0].length;
  }

  get height(){
    return this.map.length;
  }

  isEmpty(x, y){
    let row = this.map[Math.trunc(y/this.size)]
    return !row || (row && !row[Math.trunc(x/this.size)]);
  }

  isEmptyByVector(v){
    return this.isEmpty(v.x, v.y); 
  }

  render(context, deltaTime, camera){
    try{
      //context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.image.width*this.size, this.image.height*this.size);
      context.drawImage(
        this.image, 
        0, 
        0, 
        this.image.width, 
        this.image.height, 
        0 + camera.x, 
        0 + camera.y, 
        (this.image.width)*this.size , 
        (this.image.height)*this.size 
      );
    }catch(e){

    }
  }

  round(center, radius){
    for (let i=0; i<radius/this.size; i+=0.5){
      let max = 2*Math.PI*i;
      for (let a=0; a<max; a++){
        let cpx = Math.trunc(Math.sin(Math.PI*2/max *a)*i+center.x/this.size);
        let cpy = Math.trunc(Math.cos(Math.PI*2/max *a)*i+center.y/this.size);
        if(this.map[cpy]){
          this.map[cpy][cpx]=0
        };
      }
    }
    this.image.src = mapToImage(this);
  }
}

module.exports = GameMap;