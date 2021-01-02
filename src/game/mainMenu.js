const Control = require('common/control.js');

class MainMenu extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div','gamescreen_wrapper_centred' , '');
    this.fightButton = new Control(this.node, 'div', 'load_button', 'Fight');
    //this.otherButton = new Control(this.node, 'div', 'load_button', 'Editor');
    this.fightButton.node.onclick = ()=>{
      this.onFight && this.onFight();  
    }
  }
}

module.exports = MainMenu;