const Control = require('common/control.js');

class Preloader extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div','gamescreen_wrapper_centred main' , '');
    this.startButton = new Control(this.node, 'div', 'load_button', 'Click to Load');
    this.startButton.node.onclick = ()=>{
      this.onStart && this.onStart();
    }
  }
}

module.exports = Preloader;