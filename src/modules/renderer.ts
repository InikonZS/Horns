export default class Renderer {
  isStarted: boolean;
  onRenderFrame: (time: number) => void;
  start: () => void;
  stop: () => void;

  constructor() {
    this.isStarted = false;
    this.onRenderFrame = () => {};

    let lastTime = 0;
    const renderFrame = (timeStamp: number) => {
      if (this.isStarted) {
        let deltaTime = 0;
        if (lastTime) {
          deltaTime = timeStamp - lastTime;
        }
        lastTime = timeStamp;

        this.onRenderFrame && this.onRenderFrame(deltaTime);
        requestAnimationFrame(renderFrame);
      }
    };

    this.start = () => {
      if (this.isStarted == false){
        this.isStarted = true;
        lastTime = 0;
        requestAnimationFrame(renderFrame);
      }
    };

    this.stop = () => {
      this.isStarted = false;
    };
  }
}
