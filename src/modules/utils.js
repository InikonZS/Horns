function inBox(LH, TB, P){
  return (LH.x<=P.x && LH.y<=P.y && TB.x>=P.x && TB.y>=P.y);
}

function loadBitmap(path, onLoad){
  let im = new Image();
  im.onload = ()=>{
    let canvas = document.createElement('canvas');
    canvas.width = im.width;
    canvas.height = im.height;
    ctx = canvas.getContext('2d');
    ctx.drawImage(im,0,0);
    onLoad(ctx.getImageData(0,0,im.width, im.height));
  }
  im.src = path;
}

function readImageData(imageData, onReadPixel){
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

function createNodes(obj, nodes, Class) {
  Object.keys(nodes).forEach(it => {
    obj[it] = new Class(obj.node, nodes[it].tag, nodes[it].class);
  });
}

module.exports = {
  inBox,
  loadBitmap,
  readImageData,
  createNodes
}
