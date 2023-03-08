import Control from './control';

export class Toggle extends Control {
  activeClass: string;
  inactiveClass: string;
  onClick: (state: boolean) => void;
  isToggled: boolean;
  onChange: (state: boolean)=>void;

  constructor(parentNode: HTMLElement, activeClass: string, inactiveClass: string, caption: string, onClick: (state: boolean) => void) {
    super(parentNode, 'div', inactiveClass, caption);
    this.activeClass = activeClass;
    this.inactiveClass = inactiveClass;
    this.onClick = onClick;
    this.isToggled;
    this.changeState(false);

    this.node.onclick = (e) => {
      e.stopPropagation();
      this.changeState();
      this.onClick && this.onClick(this.isToggled);
    }
  }

  changeState(state?: boolean) {
    if (state === undefined) {
      this.isToggled = !this.isToggled;
    } else {
      this.isToggled = state;
    }
    this.node.className = this.isToggled ? this.activeClass : this.inactiveClass;
    this.onChange && this.onChange(this.isToggled);
    //this.dispath('change');
    return this.isToggled;
  }
}

export class RadioGroup extends Control {
  activeItemClass: string;
  inactiveItemClass: string;
  buttons: Toggle[];
  onSelect: (index: number)=>void;

  constructor(parentNode: HTMLElement, wrapperClass: string, activeItemClass: string, inactiveItemClass: string) {
    super(parentNode, 'div', wrapperClass);
    this.activeItemClass = activeItemClass;
    this.inactiveItemClass = inactiveItemClass;
    this.buttons = [];
    this.onSelect;
  }

  addButton(caption: string) {
    let but = new Toggle(this.node, this.activeItemClass, this.inactiveItemClass, caption, () => {
      this.select(this.buttons.findIndex(it => but == it));
    });
    this.buttons.push(but);
  }

  select(index: number, noCallback?: boolean) {
    this.buttons.forEach(it => it.changeState(false));
    this.buttons[index].changeState(true);
    !noCallback && this.onSelect && this.onSelect(index);
  }
}

//export default { Group: RadioGroup, Toggle };