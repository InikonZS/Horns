const {inBox, loadBitmap, readImageData} = require('common/utils.js');
const Vector = require('../../modules/vector');

function mapToImage(map, color){
  let canvas = document.createElement('canvas');
  let size=2;
  canvas.width = map.width*size;
  canvas.height = map.height*size;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  for (let i=0; i<map.map.length; i++){
    for (let j=0; j<map.map[0].length; j++){
      if (map.map[i][j]==1){
        ctx.fillRect(j*size, i*size, size, size);
      }
    }
  }
  return ctx.canvas.toDataURL();
}

function imageToCanvas(image){
  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx = canvas.getContext('2d');
  //ctx.fillStyle = color;
  ctx.drawImage(image,0,0);
  return ctx;
}

function roundImage(image, center, radius){
  let context = imageToCanvas(image);
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.closePath();
  context.globalCompositeOperation='destination-out';
  context.fillStyle = '#fff';
  context.fill();
  image.src = context.canvas.toDataURL();
}

function roundImageAll(image, rounds){
  let context = imageToCanvas(image);
  rounds.forEach(it=>{
    let center = it.center;
    let radius = it.radius;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.closePath();
    context.globalCompositeOperation='destination-out';
    context.fillStyle = '#fff';
    context.fill();
  });
  image.src = context.canvas.toDataURL();
}

class GameMap{
  constructor(){
    this.map = [];
    this.roundList = [];
    this.size = 2;
    this.waterImage = new Image();
    this.waterImage.src = './assets/water.png';
    this.waterNImage = new Image();
    this.waterNImage.src = './assets/water_nt.png';
    this.backImage = new Image();
    this.backImage.src = './assets/back.png';
    this.image = new Image();
    this.hImage = new Image();
    loadBitmap('./assets/bitmap3.png', (data)=>{
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
      this.image.src = mapToImage(this, '#cc3');
      this.hImage.src = mapToImage(this, '#663');
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

  getNearIntersection(a, b){
    let v = b.clone().sub(a);
    let va = v.abs();
    let vn = v.clone().normalize();
    let tc = a.clone();
    for (let i = 0; i<=va; i++){
      let np = tc.add(vn)
      if (!this.isEmptyByVector(np)){
        return np
      }
    }
    return null;
  }

  renderGradient(context, deltaTime, camera){
    gradient = context.createLinearGradient(0, camera.y-500, 0, camera.y+context.canvas.height+100);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "white");
    context.fillStyle = gradient;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  getNormal(collisionPoint) {
    const emptyVectors = [];
    for (let x = collisionPoint.x - 2; x < collisionPoint.x + 3; x++) {
      for (let y = collisionPoint.y - 2; y < collisionPoint.y + 3; y++) {
        if (x === collisionPoint.x && y === collisionPoint.y) {
          continue;
        }
        let v = new Vector(x, y);
        v.sub(collisionPoint);
        if (this.isEmptyByVector(v)) {
          emptyVectors.push(v);
        }
      }
    }
    return emptyVectors.reduce((n, it) => n.add(it).scale(2)).normalize();
  }

  render(context, deltaTime, camera){

    try{
      for (let i=-2; i<7; i++){
        context.drawImage(this.backImage,
          0,
          0,
          this.backImage.width,
          this.backImage.height,
          i*this.backImage.width + camera.x/2,
          400 + camera.y,
          (this.backImage.width) ,
          (this.backImage.height)
        );
      }
      for (let i=-2; i<7; i++){
      context.drawImage(this.waterNImage,
          0,
          0,
          this.backImage.width,
          this.backImage.height,
          i*this.backImage.width + camera.x,
          600 + camera.y,
          (this.backImage.width) ,
          (this.backImage.height)
        );
      }
      //context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.image.width*this.size, this.image.height*this.size);
      context.drawImage(
        this.hImage,
        0,
        0,
        this.hImage.width,
        this.hImage.height,
        0 + camera.x,
        0 + camera.y,
        (this.hImage.width)*1 ,
        (this.hImage.height)*1
      );
      context.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        0 + camera.x,
        0 + camera.y,
        (this.image.width)*1 ,
        (this.image.height)*1
      );

      for (let i=-2; i<7; i++){
        context.drawImage(this.waterImage,
          0,
          0,
          this.backImage.width,
          this.backImage.height,
          i*this.backImage.width + camera.x,
          600 + camera.y,
          (this.backImage.width) ,
          (this.backImage.height)
        );
      }
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
    //this.image.src = mapToImage(this, '#cc3');
    this.roundList.push({center:center.clone(), radius:radius});
    setTimeout(() => {
      let currentRoundList = [...this.roundList];
      this.roundList = [];
      roundImageAll(this.image, currentRoundList);
    }, 1);

    //roundImage(this.image, center, radius);

  }
}

module.exports = GameMap;