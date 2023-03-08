class Timer{
  counter: number;
  isPaused: boolean;
  onTimeout: () => void;
  onTick: (time: number) => void;
  constructor(){
    this.counter = 0;
    this.isPaused = true;
    this.onTimeout = ()=>{};
  }

  tick(deltaTime: number){
    if (this.isPaused == false){
      this.onTick && this.onTick(this.counter);
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

  start(counter: number){
    this.isPaused = false;
    this.counter = counter;
  }
}

export default Timer;