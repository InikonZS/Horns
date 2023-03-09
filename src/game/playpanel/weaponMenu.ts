import Control from 'common/control';
import { RadioGroup, Toggle } from 'common/group';

class WeaponItem extends Toggle {
  private itemW: Control;
  
  constructor(parentNode: HTMLElement, activeClass: string, inactiveClass: string, caption: string, onClick: ()=>void) {
    super(parentNode, activeClass, inactiveClass, caption, onClick);
    this.itemW = new Control(this.node, 'div', 'weapon_amount_available', '22');
  }

}

class WeaponMenu extends RadioGroup {
  private header: Control;
  private main: Control;
  private footer: Control;

  constructor(parentNode: HTMLElement, wrapperClass: string, activeItemClass: string, inactiveItemClass: string) {
    super(parentNode, wrapperClass, activeItemClass, inactiveItemClass);
    this.header = new Control(this.node, 'div', 'weapon-header', 'Weapons available');
    this.main = new Control(this.node, 'div', 'weapon-main', '');
    this.footer = new Control(this.node, 'div', 'weapon-footer', '');
  }

  addButton(caption: string) {
    let but = new WeaponItem(this.main.node, this.activeItemClass, this.inactiveItemClass, caption, () => {
      this.select(this.buttons.findIndex(it => but == it));
    });
    this.buttons.push(but);
  }

  open() {
    this.node.classList.add('opened');
  }

  close() {
    this.node.classList.remove('opened');
  }

  toggle() {
    this.node.classList.toggle('opened');
  }
}

export default WeaponMenu;