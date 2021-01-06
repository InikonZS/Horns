class Animation {
  constructor(imageURL, width, height, numberOfFrames) {
    let spritesheet = new Image();
    spritesheet.src = imageURL;
    this.spritesheet = spritesheet;
    this.width = width;
    this.height = height;
    this.numberOfFrames = numberOfFrames || 1;
    this.frameIndex = 0;
    console.log(this.spritesheet);
    this.isStarted = false;
  }
  start() {
    this.isStarted = true;
    this.frameIndex = 0;
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
                      x, y,
                      (this.width / this.numberOfFrames) / 3,
                      this.height / 3)
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
}

module.exports = Animation;
