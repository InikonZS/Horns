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
  }

  addButton(caption) {
    let but = new WeaponItem(this.node, this.activeItemClass, this.inactiveItemClass, caption, () => {
      this.select(this.buttons.findIndex(it => but == it));
    });
    this.buttons.push(but);
  }
}

module.exports = WeaponMenu;