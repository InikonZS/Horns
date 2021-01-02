const Control = require('common/control.js');

class AnotherPage extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', 'gamescreen_wrapper');
    new Control(this.node, 'div', '', 'page in development')
  }
}

module.exports =  AnotherPage;