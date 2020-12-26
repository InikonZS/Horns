const Control = require('common/control.js');

class MainMenu extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', '', '');
    this.fightButton = new Control(this.node, 'div', '', 'Fight');
    this.fightButton.node.onclick = ()=>{
      this.onFight && this.onFight();  
    }
  }
}

module.exports = MainMenu;