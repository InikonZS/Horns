import Control from "./control";
import Vector from "./vector";

export function inBox(LH: Vector, TB: Vector, P: Vector){
  return (LH.x<=P.x && LH.y<=P.y && TB.x>=P.x && TB.y>=P.y);
}

export function cycle(a: number, am: number){
  return a>=0?a%am:am-(1+ -(a+1)%am)
}

export function loadBitmap(path: string, onLoad: (data: ImageData)=>void){
  let im = new Image();
  im.onload = ()=>{
    let canvas = document.createElement('canvas');
    canvas.width = im.width;
    canvas.height = im.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(im,0,0);
    onLoad(ctx.getImageData(0,0,im.width, im.height));
  }
  im.src = path;
}

export function readImageData(imageData: ImageData, onReadPixel: (x: number, y: number, color: number[])=>void){
  let channels = Math.round(imageData.data.length / (imageData.width*imageData.height));
  for (let i=0; i<imageData.data.length/channels; i++){
    let color = [];
    let x = i % imageData.width;
    let y = Math.trunc(i / imageData.width);
    for (let j=0; j<channels; j++){
      color.push(imageData.data[i*channels+j]);
    }
    onReadPixel(x, y, color)
  }
}

export function createNodes(obj: any, nodes: any, Class: typeof Control) {
  Object.keys(nodes).forEach(it => {
    obj[it] = new Class(obj.node, nodes[it].tag, nodes[it].class);
  });
}
