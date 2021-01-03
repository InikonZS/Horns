const Control = require('./control.js');

class Toggle extends Control{
  constructor (parentNode, activeClass, inactiveClass, caption, onClick){
    super (parentNode, 'div', inactiveClass, caption);
    this.activeClass = activeClass;
    this.inactiveClass = inactiveClass;
    this.onClick = onClick;
    this.isToggled;
    this.changeState(false);

    this.node.onclick = () => {
      this.changeState();
      this.onClick && this.onClick(this.isToggled);
    } 
  }

  changeState(state){
    if (state===undefined){
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

class RadioGroup extends Control{
  constructor (parentNode, wrapperClass, activeItemClass, inactiveItemClass){
    super (parentNode, 'div', wrapperClass);
    this.activeItemClass = activeItemClass;
    this.inactiveItemClass = inactiveItemClass;
    this.buttons = [];
    this.onSelect;
  }

  addButton(caption){
    let but = new Toggle (this.node, this.activeItemClass, this.inactiveItemClass, caption, ()=>{
      this.select(this.buttons.findIndex(it=>but==it));
    });
    this.buttons.push(but);
  }
  
  select(index, noCallback){
    this.buttons.forEach(it=>it.changeState(false));
    this.buttons[index].changeState(true);  
    !noCallback && this.onSelect && this.onSelect(index);
  }
}

module.exports = RadioGroup;