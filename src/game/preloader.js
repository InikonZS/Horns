const Control = require('common/control.js');

class Preloader extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', '', '');
    this.startButton = new Control(this.node, 'div', '', 'Load');
    this.startButton.node.onclick = ()=>{
      this.onStart && this.onStart();  
    }
  }
}

module.exports = Preloader;