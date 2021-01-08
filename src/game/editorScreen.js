const Control = require('common/control.js');

class EditorScreen extends Control{
  constructor(parentNode, sceneManager){
    super(parentNode, 'div','gamescreen_wrapper_centred' , 'editor screen');
    this.backButton = new Control(this.node, 'div', 'load_button', 'back');
    this.backButton.node.onclick = ()=>{
      sceneManager.back();//selectByName('mainMenu');
    }
  }
}

module.exports = EditorScreen;