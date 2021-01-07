const Control = require('common/control.js');

class MainMenu extends Control {
  constructor(parentNode, config) {
    super(parentNode, 'div', 'gamescreen_wrapper_centred', '');
    let menuWrapper = new Control(this.node, 'div', "menu_wrapper");
    this.fightButton = new Control(menuWrapper.node, 'div', 'load_button menu_item', 'Fight');
    this.otherButton = new Control(menuWrapper.node, 'div', 'load_button menu_item', 'Editor');
    this.otherButton = new Control(menuWrapper.node, 'div', 'load_button menu_item', 'Settings');
    this.otherButton = new Control(menuWrapper.node, 'div', 'load_button menu_item', 'About');
    this.fightButton.node.onclick = () => {
      this.onFight && this.onFight();
    }
  }
}


module.exports = MainMenu;