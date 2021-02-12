const Control = require('./modules/control.js');
const Vector = require('./modules/vector.js');
const Renderer = require('./modules/renderer.js');
const {inBoxx, loadBitmap, readImageData} = require ('./modules/utils.js');
const APPROX_DEVIATION = 0.00001;
//window.loadBitMap = loadBitMap;

function intersect (a, b){
  return (
    a.left+a.width > b.left && 
    a.top+a.height > b.top && 
    b.left+b.width > a.left && 
    b.top+b.height > a.top
  );
}

let inBox = (a, b, c) => {
  return intersect ({
    top:a.x,
    left:a.y,
    width:12,
    height:12,
  },
  {
    top:c.x,
    left:c.y-12,
    width:12,
    height:12,    
  })
}

function onLine(a, b, p){
  let al = a.clone().sub(b).abs();
  let ap = a.clone().sub(p).abs();  
  let bp = b.clone().sub(p).abs();
  return (ap+bp)<=(al+APPROX_DEVIATION);
}

function getEquation(a, b){
  let v = b.clone().sub(a);
  let k = v.y/v.x;
  let kb = -(a.x*k-a.y);
  return {k, kb}
}

function solveEquation(e1, e2){
  let cx = -(e1.b-e2.b)/ (e1.k-e2.k);
  let cy = cx*e2.k+e2.b;
  return new Vector(cx, cy);
}

function solveCutted(v1, v2, v3, v4){
  let e1 = getEquation(v1,v2);
  let e2 = getEquation(v3,v4);
  let nv = solveEquation(e1,e2);
  let res = null;
  if (onLine(v1,v2, nv)&& onLine(v3, v4, nv)){
    res = nv;
  }
  return res;
}

/*function getNormal(v1, v2, nx=1){
  let v = v2.subVector(v1);
  return new Vector3d(nx*v.y/v.x, -1*nx, 0).normalize();
  //return new Vector3d(-v.y/v.x, 1, 0).normalize();
}*/



/*function getEquation(a, b){
  let ab = a.clone().sub(b);

}

function crossLines(a, b, c, d){
  let ab = a.clone().sub(b);
  let cd = c.clone().sub(d);

}*/

class PhysicPoint {
  constructor (position){
    this.position = position.clone();
    this.speed = new Vector(0,0);
    this.acceleration = new Vector(0,0);
    this.forceList = [];
    this.friction = 1;
  }

  get x(){
    return this.position.x;
  }
  get y(){
    return this.position.y;
  }
  set x(value){
    this.position.x = value;
  }
  set y(value){
    this.position.y = value;
  }

  getNextPosition(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach(it=>resultAcceleration.add(it));
    this.speed.clone().add(resultAcceleration.clone().scale(deltaTime)).scale(this.friction);
    return this.position.clone().add(this.speed.clone().scale(deltaTime));  
  }

  process(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach(it=>resultAcceleration.add(it));
    this.speed.add(resultAcceleration.clone().scale(deltaTime)).scale(this.friction);
    this.position.add(this.speed.clone().scale(deltaTime));  
  }
}

class GraphicNode {
  constructor() {
    this.parent = null;
    this.isRemoved = false;
    this.hasRemoved = false;
    this.childs = [];
  }

  addChild(node) {
    node.parent = this;
    this.childs.push(node);
  }

  removeSelf() {
    if (this.parent) {
      this.parent.hasRemoved = true;
      this.isRemoved = true;
    }
  }

  render(context, camera, deltaTime) {
    if (this.hasRemoved){
      this.childs = this.childs.filter(it=>!it.isRemoved);
    }
    this.childs.forEach((it) => it.render(context, camera, deltaTime));
  }
}


class GameCanvas extends Control {
  constructor(parentNode, width, height, className) {
    super(parentNode, 'canvas', className);
    this.node.width = width;
    this.node.height = height;
    this.context = this.node.getContext('2d');
    this.renderer = new Renderer();
    this.root = new GraphicNode();
    this.camera = new PhysicPoint(new Vector(0,0));
    this.camera.friction = 0.95;
    this.renderer.onRenderFrame = (deltaTime) => {
      this.clear();
      this.camera.process(deltaTime);
      this.root.render(this.context, this.camera, deltaTime);
    };
  }

  start() {
    this.renderer.start();
  }

  stop() {
    this.renderer.stop();
  }

  clear() {
    this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height);
  }
}

class Worms extends Control {
  constructor(parentNode, className, canvasClassName) {
    super(parentNode, 'div', className);
    this.gameCanvas = new GameCanvas(this.node, 800, 600, canvasClassName);
    this.gameCanvas.root.addChild(new GraphicPoint(new Vector(50, 50), 10));
    this.gameCanvas.root.addChild(new Player(new Vector(50, 50), 20));
    this.bitmap = new BitMap(100)
    this.gameCanvas.root.addChild(this.bitmap);

    this.leftButton = new Control(this.node,'div','','left');
    this.leftButton.node.onclick = ()=>{
      this.gameCanvas.camera.speed.x+=1;
    }
    this.rightButton = new Control(this.node,'div','','right');
    this.rightButton.node.onclick = ()=>{
      this.gameCanvas.camera.speed.x-=1;
    }

    this.gameCanvas.start();
    this.keyboardState = {};

    window.addEventListener('keydown', ev=>{
      this.keyboardState[ev.code] = true;  
    });

    window.addEventListener('keyup', ev=>{
      this.keyboardState[ev.code] = false;  
    });
  }

  destroy(){
    //todo: delete all global events;
  }
}

class GraphicPoint extends GraphicNode {
  constructor(position, radius) {
    super();
    this.physic = new PhysicPoint(position);
    this.radius = radius;
  }

  get position(){
    return this.physic.position;
  }

  set position(vector){
    return this.physic.position = vector.clone();
  }

  render(context, camera, deltaTime) {
    this.physic.process(deltaTime);

    context.fillStyle = '#F00';
    context.strokeStyle = '#FFF';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(this.position.x + camera.x, this.position.y + camera.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.stroke();
    super.render(context, camera, deltaTime);
  }
}




class BitMap extends GraphicNode{
  constructor(count=0){
    super();
    let sz = 12;
    let mz = 120;
    loadBitmap('./assets/bitmap1.png', im=>{
      readImageData(im, (x, y, color)=>{
        if (!color[0]){
          let x_= x%mz;
          let y_ = y%mz;
          let mx= Math.trunc(x/mz)*mz;
          let my = Math.trunc(y/mz)*mz;
          this.addChild(new MapTile(new Vector(x*sz, y*sz+30)));
        }  
      });
    });
  }
}

class MapTile extends GraphicNode{
  constructor(position){
    super();
    this.position = position;
  }

  render(context, camera, deltaTime){
    context.fillStyle = '#F00';
    context.strokeStyle = '#FFF';
    context.lineWidth = 2;
    context.beginPath();
    context.rect(this.position.x + camera.x, this.position.y + camera.y, 12, 12);
    context.closePath();
    context.fill();
    context.stroke();
    super.render(context, camera, deltaTime);  
  }
}

class Player extends GraphicNode{
  constructor(position, radius) {
    super();
    this.position = position.clone();
    this.speed = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.forceList = [];
    this.forceList.push(new Vector(0,0));
    this.forceList.push(new Vector(0,0));
    this.radius = radius;

    this.tilePoint = new Vector(0, 0);

    this.lastDir = new Vector (1,0)
    this.direction = new GraphicPoint(this.lastDir, 3);
    this.addChild(this.direction);

    this.powIndicator = new GraphicPoint(this.lastDir, 3);
    this.addChild(this.powIndicator);

    this.isShot = false;
    this.shotPow = 0;
    this.bullets=[];
    
    this.isJumped = false;
  }

  processKeyboard(keyboardState){
    let direction = new Vector(0,0);
    if (keyboardState['ArrowUp']){
      if (this.isJumped == false){
       this.isJumped = true;
        //direction.y=-1;
        this.speed.y += -0.15;
      }
    }
    this.isMove = false;
    //if (keyboardState['ArrowDown']){direction.y=1;}
    if (keyboardState['ArrowLeft']){
     // if (this.isFloor){
        direction.x=-1;
    this.isMove = true}
  //}
    if (keyboardState['ArrowRight']){
      //if (this.isFloor){
      direction.x=1;
    this.isMove = true}
  //}
    //console.log(direction.normalize());
    //if (this.isJumped == true){
      this.acceleration=direction.normalize().scale(0.0001);
   // } else {
    //  this.speed=direction.scale(0.1);
    //}
    direction = new Vector(0,0);
    if (keyboardState['KeyW']){direction.y=-1;}
    if (keyboardState['KeyS']){direction.y=1;}
    if (keyboardState['KeyA']){direction.x=-1;}
    if (keyboardState['KeyD']){direction.x=1;}
    //console.log(direcion.normalize());
    if (direction.abs()!=0){
      this.lastDir.add(direction.clone().scale(0.01));
    }

    if (keyboardState['Space']){
      this.isShotPow=true;
    } else {
      if (this.isShotPow){
        this.shot();
      }
      
    }

    this.direction.position=this.lastDir.clone().normalize().scale(100).add(this.position);


  }

  shot(){
    let bullet = new GraphicPoint(this.position, 10);
    bullet.physic.speed = this.lastDir.clone().normalize().scale(this.shotPow);
    bullet.physic.acceleration = new Vector(0, 0.001);
    this.addChild(bullet);
    this.bullets.push(bullet);
    this.shotPow=0;
    //this.powIndicator.position = this.lastDir.clone().scale(0).add(this.position);
    this.isShotPow=false;  
  }

  getNextPosition(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach(it=>resultAcceleration.add(it));
    let nextSpeed = this.speed.clone().add(resultAcceleration.clone().scale(deltaTime)).scale(0.98);
    return this.position.clone().add(nextSpeed.scale(deltaTime));  
  }

  process(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach(it=>resultAcceleration.add(it));
    this.speed.add(resultAcceleration.clone().scale(deltaTime)).scale(0.98);
    this.position.add(this.speed.clone().scale(deltaTime));  
  }

  render(context, camera, deltaTime) {
    let isCollide = false;
    let isCollideUp = false;
    let isCollideDown = false;
    //let grav = new Vector(0,0.001);
    //this.speed.add(grav.scale(deltaTime));
    //this.speed.scale(0.95); //todo: sync deltatime*/
    //let nextPosition = this.position.clone();

    //this.tilePoint = this.position.clone();
    //this.tilePoint
    //this.acceleration=grav;
    let nextPosition = this.getNextPosition(deltaTime);
    //console.log(nextPosition);
    //console.log(nextPosition)
    app.bitmap.childs.forEach(it=>{
      //if (this.position.clone().sub(it.position).abs()<this.radius*2){
      //while 
      if(inBox(it.position.clone(),
      it.position.clone().add(new Vector(12,12)),
      nextPosition.clone().add(new Vector(0, 12)))){
        isCollide = true
     }
      if(inBox(it.position.clone(),
      it.position.clone().add(new Vector(12,12)),
      nextPosition.clone().add(new Vector(0, 12-12)))){
        isCollideUp = true
      }
      if(inBox(it.position.clone(),
      it.position.clone().add(new Vector(12,12)),
      this.position.clone().add(new Vector(0, 12+2)))){
        isCollideDown = true
      }
    });
    //console.log(this.position, lastPosition);
    //if (isCollide){
   /*   if (isCollideDown){
        if (isCollideUp){
        } else {
          if (isCollide){//(nextPosition.x!==this.position.x){
            this.position = nextPosition.add(new Vector(0,-12)); 
          } else {
            this.isJumped = false;
            this.position = nextPosition;
            //this.process(deltaTime);
          }
        }   
      } else {
        //this.position = nextPosition.add(new Vector(0, 2));   
        this.process(deltaTime);
      }*/
      
   /* } else {
      this.position = nextPosition; 
    } */
    if (isCollide && this.isFloor && !this.isJumped && this.isMove && !isCollideUp){
      //console.log ('gfdf')
      //this.speed.y += -0.05;
        this.position = nextPosition.clone().add(new Vector(0, -12));
      } else {
    if (!isCollide){
     
      if (!isCollideDown){
        this.forceList[0].y = 0.0001;
        this.isFloor =false;
      } else {
        this.isJumped = false;
      }
    } else {
      
      this.isFloor = true;
      
      this.speed.scale(0);
      this.acceleration.scale(0);
      this.forceList[0].y=0;
    }
   // }
  } this.process(deltaTime);
  
//


    app.bitmap.childs.forEach(it=>{
      let isCollide= false
      this.bullets.forEach(jt=>{
        if (jt.position.clone().sub(it.position).abs()<12){
          isCollide = true;  
          jt.removeSelf();
          //jt.position.y=1000;
        }  
        //console.log(isCollide)
      });
      if (isCollide){
       // console.log('sgfgf')
        it.removeSelf();
        //it.position.y=-100;    
      }
    });
    //this.position.add(this.speed.clone().scale(deltaTime));
    

    this.processKeyboard(app.keyboardState); // todo: delete global!!
    

    this.powIndicator.position = this.lastDir.clone().normalize().scale(this.shotPow*30).add(this.position);
    if (this.isShotPow){
      
      this.shotPow+=deltaTime *0.003;
    }

  /*  context.fillStyle = '#F00';
    context.strokeStyle = '#FFF';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(this.position.x +camera.x, this.position.y+camera.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.stroke();*/
    context.fillStyle = '#F00';
    context.strokeStyle = '#FFF';
    context.lineWidth = 2;
    context.beginPath();
    context.rect(this.position.x + camera.x, this.position.y + camera.y, 12, 12);
    context.closePath();
    context.fill();
    context.stroke();
    super.render(context, camera, deltaTime);
  }  
}

/*class Player extends GraphicNode{
  constructor (position){
    super();
    this.radius = 20;
    this.physic = new PhysicPoint(position); 
    this.moveLeft = false;
    this.moveRight = false;
    this.stay = false;
    //this.physic.forceList.push(new Vector(0,0.001));
  }

  processKeyboard(keyboardState){
    let direction = new Vector(0,0);
    this.moveLeft = false;
    this.moveRight = false;
    if (keyboardState['ArrowUp']){direction.y=-4;}
    if (keyboardState['ArrowDown']){direction.y=1;}
    if (keyboardState['ArrowLeft']){this.moveLeft = true}
    if (keyboardState['ArrowRight']){this.moveRight = true}
    this.physic.speed.add(direction.scale(0.01));
  }

  render(context, camera, deltaTime) {
    
    let isCollide = false;
    app.bitmap.childs.forEach(it=>{
      if(inBox(it.position.clone(),
        it.position.clone().add(new Vector(12,12)),
        this.physic.getNextPosition(deltaTime).add(new Vector(0, 20)))
      ){
        isCollide = true;  
      }
    });
    if (isCollide){
      console.log('fgfgf')
      this.physic.speed.scale(0);//.scale(0);
      //this.physic.speed.x=-this.physic.speed.x
      this.physic.acceleration = new Vector(0,0.00); 
      //grav = new Vector(0,0);
      this.stay = true;
    } else {
      this.stay = false;
      this.physic.acceleration = new Vector(0,0.001);  
    }
   

    this.physic.process(deltaTime);

    this.processKeyboard(app.keyboardState); // todo: delete global!!

    context.fillStyle = '#F00';
    context.strokeStyle = '#FFF';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(this.physic.position.x +camera.x, this.physic.position.y+camera.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.stroke();
    super.render(context, camera, deltaTime);
  }  

}*/

const app = new Worms(document.querySelector('#app'), '', '');
window.app = app;
