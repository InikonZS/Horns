import Control from 'common/control.js';

class MainMenu extends Control {
  name: string;
  editorButton: Control;
  settingsButton: Control;
  fightButton: Control;
  onFight: () => void;
  onSettings: () => void;
  onEditor: () => void;

  constructor(parentNode:HTMLElement, config?:any) {
    super(parentNode, 'div', 'gamescreen_wrapper_centred main', '');
    this.name = 'mainMenu';
    let menuWrapper = new Control(this.node, 'div', "menu_wrapper");
    this.editorButton = new Control(menuWrapper.node, 'div', ' menu_item', 'Editor');
    this.settingsButton = new Control(menuWrapper.node, 'div', 'menu_item', 'Settings');
    this.fightButton = new Control(menuWrapper.node, 'div', ' menu_item', 'Fight');
    // this.AboutButton = new Control(menuWrapper.node, 'div', 'menu_item', 'About');
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


export default MainMenu;