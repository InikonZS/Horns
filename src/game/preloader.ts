import Control from 'common/control';

class Preloader extends Control{
  startButton: Control;
  onStart: ()=>void;

  constructor(parentNode: HTMLElement, config?: any){
    super(parentNode, 'div','gamescreen_wrapper_centred main' , '');
    this.startButton = new Control(this.node, 'div', 'load_button', 'Click to Load');
    this.startButton.node.onclick = ()=>{
      this.onStart && this.onStart();
    }
  }
}

export default Preloader;