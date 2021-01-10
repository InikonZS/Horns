const Control = require('common/control.js');

class EditorMenu extends Control {
  constructor(parentNode, config) {
    super(parentNode, 'div', 'gamescreen_wrapper_centred', '');
    let editorWrapper = new Control(this.node, 'div', "editor_wrapper");
    let toolsInner = new Control(editorWrapper.node, 'div', "editor_tools_inner");
    this.brush = new Control(toolsInner.node, 'div', 'editor_brush editor_tools_btn', 'Кисть');
    this.eraser = new Control(toolsInner.node, 'div', 'editor_eraser editor_tools_btn', 'Ластик');
    this.line = new Control(toolsInner.node, 'div', 'editor_line editor_tools_btn', 'Линия');
    this.pole = new Control(editorWrapper.node, 'div', 'editor_pole', '--------- ------ -----  ///// ////');

    this.startGame = new Control(this.node, 'div', 'startGame_btn', 'Начать игру');
    this.return = new Control(this.node, 'div', 'return_btn', 'Назад');

    this.return.node.onclick = () => {
      this.onreturn && this.onreturn();
    }
  }
}


module.exports = EditorMenu;