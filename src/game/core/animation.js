'../../assets/worm-walks-100.png'

class Animation {
  constructor(spritesheet, width, height, numberOfFrames) {
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

  update() {
    this.frameIndex++;
    if (this.frameIndex >= this.numberOfFrames) {
      this.frameIndex = 0;
    }
  }

  draw(context, x, y) {
    context.drawImage(this.spritesheet,
                      this.frameIndex * this.width / this.numberOfFrames,
                      0,
                      this.width / this.numberOfFrames,
                      this.height,
                      x, y,
                      (this.width / this.numberOfFrames) / 3,
                      this.height / 3)
  }
}

module.exports = Animation;
