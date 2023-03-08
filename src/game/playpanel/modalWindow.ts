import Control from 'common/control';
import TeamIndicator from './teamIndicator';
import TeamIndicatorItem from './teamIndicatorItem';

class ModalWindow extends Control {
  dropDownBox: Control;
  header: Control;
  main: Control;
  footer: Control;

  constructor(parentNode: HTMLElement, wrapperClass: string, headerText: string) {
    super(parentNode, 'div', wrapperClass + " dropdown-overlay");
    this.dropDownBox = new Control(this.node, 'div', 'dropdown-box', '');
    this.header = new Control(this.dropDownBox.node, 'div', 'dropdown-box__header', headerText);
    this.main = new Control(this.dropDownBox.node, 'div', 'dropdown-box__main', 'main');
    this.footer = new Control(this.dropDownBox.node, 'div', 'dropdown-box__footer', '');
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

  close() {
    this.dropDownBox.node.classList.remove('opened');
    setTimeout(this.hide.bind(this), 500);
  }

  toggle(teamIndicator: TeamIndicator) {
    this.main.node.innerHTML = teamIndicator.node.innerHTML; //badpractice
    if (this.isHidden()) {
      this.open();
    } else {
      this.close();
    }
  }
}

export default ModalWindow;