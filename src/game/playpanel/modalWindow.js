const Control = require('common/control.js');

class ModalWindow extends Control {
  constructor(parentNode, wrapperClass, headerText) {
    super(parentNode, 'div', wrapperClass + " dropdown-overlay");
    this.dropDownBox = new Control(this.node, 'div', 'dropdown-box', '');
    this.header = new Control(this.dropDownBox.node, 'div', 'dropdown-box__header', headerText);
    this.main = new Control(this.dropDownBox.node, 'div', 'dropdown-box__main', 'main');
    this.footer = new Control(this.dropDownBox.node, 'div', 'dropdown-box__footer', 'footer');
    this.node.addEventListener( 'click', this.close.bind(this));
    this.hide();
    this.dropDownBox.node.addEventListener( 'click', (e) => e.stopPropagation());
  }

  open() {
    this.show();
    setTimeout(this.showBox.bind(this), 20);
  }

  showBox() {
    this.dropDownBox.node.classList.add('opened');
  }

  close(e) {
    this.dropDownBox.node.classList.remove('opened');
    setTimeout(this.hide.bind(this), 500);
  }

  toggle() {
    if (this.isHidden()) {
      this.open();
    } else {
      this.close();
    }
  }
}

module.exports = ModalWindow;