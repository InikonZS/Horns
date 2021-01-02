class Control {
  constructor (parentNode, tagName='div', className='', content=''){
    let el = document.createElement(tagName);
    el.className = className;
    el.textContent = content;
    parentNode.appendChild(el);
    this.node = el;
  }
  
  hide(){
    this.node.style='display:none';
  }

  show(){
    this.node.style='';
  }
}

class Button extends Control{
  constructor (parentNode, caption, onClick){
    super (parentNode, 'div', '', caption);
    this.isToggled;
    this.changeState(false);

    this.node.onclick = (e) => {
      this.changeState();
      onClick(e);
    } 
  }
  changeState(st){
    if (st===undefined){
      this.isToggled = !this.isToggled;
    } else {
      this.isToggled = st;
    }
    if (this.isToggled){
      this.node.style = 'background-color:#f00';  
    } else {
      this.node.style = 'background-color:#0f0';  
    } 
    return this.isToggled; 
  }
}

class RadioGroup extends Control{
  constructor (parentNode){
    super (parentNode);
    this.buttons = [];
    this.onSelect;
  }

  addButton(caption){
    let but = new Button (this.node, caption, ()=>{
      this.select(this.buttons.findIndex(it=>but==it));
    });
    this.buttons.push(but);
  }
  
  select(index){
    this.buttons.forEach(it=>it.changeState(false));
    this.buttons[index].changeState(true);  
    this.onSelect && this.onSelect(index);
  }

  hide(){
    console.log('dfddgdsfdsfd');
    super.hide();
  }
}