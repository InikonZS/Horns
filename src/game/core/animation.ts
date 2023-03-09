import Vector from "common/vector";
import walksAni from '../../assets/worm-walks-100.png';
import walkAniLeft from '../../assets/worm-walks-left-100.png';
import jump from '../../assets/worm-jump-100.png';

const options = [
  {
    name: 'right',
    keyCode: 'KeyD',
    src: walksAni,
    width: 1442,
    height: 100,
    numberOfFrames: 15,
  },
  {
    name: 'left',
    keyCode: 'KeyA',
    src: walkAniLeft,
    width: 1442,
    height: 100,
    numberOfFrames: 15,
  },
  {
    name: 'jump',
    keyCode: 'KeyW',
    src: jump,
    width: 107,
    height: 100,
    numberOfFrames: 2,
  },
]

class Animation {
  private spritesheet: HTMLImageElement;
  private width: number;
  private height: number;
  private numberOfFrames: number;
  private frameIndex: number;
  public isStarted: boolean;
  private scale: number;

  constructor(imageURL: string, width: number, height: number, numberOfFrames: number, scale = 1) {
    let spritesheet = new Image();
    spritesheet.src = imageURL;
    this.spritesheet = spritesheet;
    this.width = width;
    this.height = height;
    this.numberOfFrames = numberOfFrames || 1;
    this.frameIndex = 0;
    this.isStarted = false;
    this.scale = scale
  }
  start(keyCode?: string) {
    this.isStarted = true;
    this.frameIndex = 0;
    if (keyCode) {
      this.setOptions(keyCode);
    }
  }

  stop() {
    this.isStarted = false;
  }

  update(deltaTime: number) {
    this.frameIndex+=deltaTime*3;
    if (this.frameIndex >= this.numberOfFrames) {
      this.frameIndex = 0;
    }
  }

  drawFrame(context: CanvasRenderingContext2D, frame: number, x: number, y: number) {
    context.drawImage(this.spritesheet,
                      frame * this.width / this.numberOfFrames,
                      0,
                      this.width / this.numberOfFrames,
                      this.height,
                      x - (this.width / this.numberOfFrames / this.scale) / 2,
                      y - (this.height / this.scale) / 2,
                      (this.width / this.numberOfFrames) / this.scale,
                      this.height / this.scale)  
  }

  drawCurrentFrame(context: CanvasRenderingContext2D, x: number, y: number){ 
    try{
      this.drawFrame(context, Math.trunc(this.frameIndex), x, y)
    } catch(e){

    }
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, position: Vector){
    if (this.isStarted) {
      this.update(deltaTime);
    }
    this.drawCurrentFrame(context, position.x, position.y);
  }

  setOptions(keyCode: string) {
    const currentOptions = options.filter(it => it.keyCode === keyCode)[0];
    this.spritesheet.src = currentOptions.src;
    this.width = currentOptions.width;
    this.height = currentOptions.height;
    this.numberOfFrames = currentOptions.numberOfFrames;
  }
}

export default Animation;
