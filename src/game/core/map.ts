import {inBox, loadBitmap, readImageData} from 'common/utils';
import Vector from '../../modules/vector';

import water from "../../assets/water.png";
import waterNT from "../../assets/water_nt.png";
import back from "../../assets/back.png";

function mapToImage(map: GameMap, color: string){
  let canvas = document.createElement('canvas');
  let size=2;
  canvas.width = map.width*size;
  canvas.height = map.height*size;
  const ctx = canvas.getContext('2d');
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

function imageToCanvas(image: HTMLImageElement){
  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  //ctx.fillStyle = color;
  ctx.drawImage(image,0,0);
  return ctx;
}

function roundCanvas(context: CanvasRenderingContext2D, center: Vector, radius: number){
  if (context){
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.closePath();
    context.globalCompositeOperation='destination-out';
    context.fillStyle = '#fff';
    context.fill();
  }
}

function roundImage(image: HTMLImageElement, center: Vector, radius: number){
  let context = imageToCanvas(image);
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.closePath();
  context.globalCompositeOperation='destination-out';
  context.fillStyle = '#fff';
  context.fill();
  image.src = context.canvas.toDataURL();
}

function roundImageAll(image: HTMLImageElement, rounds: Array<{center: Vector, radius: number}>){
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

export class GameMap{
  map: any[];
  roundList: Array<{center: Vector, radius: number}>;
  size: number;
  waterLineX: number;
  waterImage: HTMLImageElement;
  waterNImage: HTMLImageElement;
  backImage: HTMLImageElement;
  private image: HTMLImageElement;
  hImage: HTMLImageElement;
  imc: CanvasRenderingContext2D;
  constructor(mapURL: string, onLoad: ()=>void){
    this.map = [];
    this.roundList = [];
    this.size = 2;
    this.waterLineX = 800;
    this.waterImage = new Image();
    this.waterImage.src = water;
    this.waterNImage = new Image();
    this.waterNImage.src = waterNT;
    this.backImage = new Image();
    this.backImage.src = back;
    this.image = new Image();
    this.hImage = new Image();
    loadBitmap(mapURL, (data)=>{
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
      this.image.onload = ()=>{
        this.imc = imageToCanvas(this.image);
        //this.image = this.imc.canvas;
      }
      this.image.src = mapToImage(this, '#cc3');
      this.hImage.src = mapToImage(this, '#663');
      onLoad();
    })
  }

  get width(){
    return this.map[0].length;
  }

  get height(){
    return this.map.length;
  }

  isEmpty(x: number, y: number){
    let row = this.map[Math.trunc(y/this.size)]
    return !row || (row && !row[Math.trunc(x/this.size)]);
  }

  isEmptyByVector(v: Vector){
    return this.isEmpty(v.x, v.y);
  }

  getNearIntersection(a: Vector, b: Vector, prev?:boolean){
    let v = b.clone().sub(a);
    let va = v.abs();
    let vn = v.clone().normalize();
    let tc = a.clone();
    for (let i = 0; i<=va; i++){
      let np = tc.add(vn)
      if (!this.isEmptyByVector(np)){
        return prev?tc:np
      }
    }
    return null;
  }

  renderGradient(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector){
    const gradient = context.createLinearGradient(0, camera.y-500, 0, camera.y+context.canvas.height+100);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "white");
    context.fillStyle = gradient;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  getNormal(collisionPoint: Vector) {
    const emptyVectors = [];
    for (let x = collisionPoint.x - 2; x < collisionPoint.x + 3; x++) {
      for (let y = collisionPoint.y - 2; y < collisionPoint.y + 3; y++) {
        if (x === collisionPoint.x && y === collisionPoint.y) {
          continue;
        }
        let v = new Vector(x, y);
        if (this.isEmptyByVector(v)) {
          v = v.sub(collisionPoint);
          emptyVectors.push(v);
        } else {
         // v = v.sub(collisionPoint).scale(-1);
         // emptyVectors.push(v);
        }
      }
    }
    //console.log(emptyVectors);
    return emptyVectors.length? emptyVectors.reduce((n, it) => n.add(it).scale(1)).scale(1/emptyVectors.length).normalize() : new Vector(0,0);
  }

  drawImage(context: CanvasRenderingContext2D, image: HTMLCanvasElement | HTMLImageElement, camera: Vector, spriteX: number, offsetY: number, cxScaler: number){
    context.drawImage(image,
      0,
      0,
      image.width,
      image.height,
      spriteX*image.width + camera.x/cxScaler,
      offsetY + camera.y,
      (image.width) ,
      (image.height)
    );
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector){
    try{
      for (let i=-2; i<7; i++){
        this.drawImage(context, this.backImage, camera, i, 400, 2);
        this.drawImage(context, this.waterNImage, camera, i, 600, 1);
      }
      this.drawImage(context, this.hImage, camera, 0, 0, 1);
      this.drawImage(context, this.imc.canvas, camera, 0, 0, 1);

      for (let i=-2; i<7; i++){
        this.drawImage(context, this.waterImage, camera, i, 600, 1);
      }

    } catch(e) {

    }
  }

  round(center: Vector, radius: number){
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

    roundCanvas(this.imc, center, radius);
  }
}