const Control = require('common/control.js');

class AboutPage extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', 'gamescreen_wrapper');
    new Control(this.node, 'div', '', 'in development')
  }
}

module.exports =  AboutPage;