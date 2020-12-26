const Control = require('common/control.js');

class GamePanel extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', '', '');
    this.node.style.position = 'relative';
  }
}

module.exports = GamePanel;