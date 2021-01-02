class Timer{
  constructor(){
    this.counter = 0;
    this.isPaused = true;
    this.onTimeout = ()=>{};
  }

  tick(deltaTime){
    if (this.isPaused == false){
      this.counter-=deltaTime;
      if (this.counter<=0){
        this.pause();
        this.onTimeout && this.onTimeout();
      }
    }
  }

  pause(){
    this.isPaused = true;
  }

  unpause(){
    this.isPaused = false;
  }

  start(counter){
    this.isPaused = false;
    this.counter = counter;
  }
}

module.exports = Timer;