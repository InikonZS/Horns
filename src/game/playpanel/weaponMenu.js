const Control = require('common/control.js');
const { Group, Toggle } = require('common/group.js');

class WeaponItem extends Toggle {
  constructor(parentNode, activeClass, inactiveClass, caption, onClick) {
    super(parentNode, activeClass, inactiveClass, caption, onClick);
    this.itemW = new Control(this.node, 'div', 'weapon_amount_available', '22');
  }

}

class WeaponMenu extends Group {
  constructor(parentNode, wrapperClass, activeItemClass, inactiveItemClass) {
    super(parentNode, wrapperClass, activeItemClass, inactiveItemClass);
    this.header = new Control(this.node, 'div', 'weapon-header', 'Weapons available');
    this.main = new Control(this.node, 'div', 'weapon-main', '');
    this.footer = new Control(this.node, 'div', 'weapon-footer', '');
  }

  addButton(caption) {
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

module.exports = WeaponMenu;