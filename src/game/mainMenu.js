const Control = require('common/control.js');

class MainMenu extends Control {
  constructor(parentNode, config) {
    super(parentNode, 'div', 'gamescreen_wrapper_centred', '');
    this.name = 'mainMenu';
    let menuWrapper = new Control(this.node, 'div', "menu_wrapper");
    this.fightButton = new Control(menuWrapper.node, 'div', ' menu_item', 'Fight');
    this.editorButton = new Control(menuWrapper.node, 'div', ' menu_item', 'Editor');
    this.settingsButton = new Control(menuWrapper.node, 'div', 'menu_item', 'Settings');
    this.AboutButton = new Control(menuWrapper.node, 'div', 'menu_item', 'About');
    this.fightButton.node.onclick = () => {
      this.onFight && this.onFight();
    }
    this.settingsButton.node.onclick = () => {
      this.onSettings && this.onSettings();
    }
    this.editorButton.node.onclick = () => {
      this.onEditor && this.onEditor();
    }

    /*  this.otherButton = new Control(this.node, 'div', 'load_button', 'Editor');
      this.otherButton.node.onclick = ()=>{
        this.onEditor && this.onEditor();  
      }*/
  }
}


module.exports = MainMenu;