const options = [
  {
    name: 'right',
    keyCode: 'KeyD',
    src: './assets/worm-walks-100.png',
    width: 1442,
    height: 100,
    numberOfFrames: 15,
  },
  {
    name: 'left',
    keyCode: 'KeyA',
    src: './assets/worm-walks-left-100.png',
    width: 1442,
    height: 100,
    numberOfFrames: 15,
  },
  {
    name: 'jump',
    keyCode: 'KeyW',
    src: './assets/worm-jump-100.png',
    width: 107,
    height: 100,
    numberOfFrames: 2,
  },
]

class Animation {
  constructor(imageURL, width, height, numberOfFrames, scale = 1) {
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
  start(keyCode) {
    this.isStarted = true;
    this.frameIndex = 0;
    if (keyCode) {
      this.setOptions(keyCode);
    }
  }

  stop() {
    this.isStarted = false;
  }

  update(deltaTime) {
    this.frameIndex+=deltaTime*3;
    if (this.frameIndex >= this.numberOfFrames) {
      this.frameIndex = 0;
    }
  }

  drawFrame(context, frame, x, y) {
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

  drawCurrentFrame(context, x, y){
    this.drawFrame(context, Math.trunc(this.frameIndex), x, y)
  }

  render(context, deltaTime, position){
    if (this.isStarted) {
      this.update(deltaTime);
    }
    this.drawCurrentFrame(context, position.x, position.y);
  }

  setOptions(keyCode) {
    const currentOptions = options.filter(it => it.keyCode === keyCode)[0];
    this.spritesheet.src = currentOptions.src;
    this.width = currentOptions.width;
    this.height = currentOptions.height;
    this.numberOfFrames = currentOptions.numberOfFrames;
  }
}

module.exports = Animation;
