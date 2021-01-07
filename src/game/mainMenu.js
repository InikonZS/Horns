const Control = require('common/control.js');

class MainMenu extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div','gamescreen_wrapper_centred' , '');
    this.name = 'mainMenu';
    this.fightButton = new Control(this.node, 'div', 'load_button', 'Fight');
    this.fightButton.node.onclick = ()=>{
      this.onFight && this.onFight();  
    }
    
    this.otherButton = new Control(this.node, 'div', 'load_button', 'Editor');
    this.otherButton.node.onclick = ()=>{
      this.onEditor && this.onEditor();  
    }
  }
}

module.exports = MainMenu;