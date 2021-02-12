const Control = require('common/control.js');
const AboutPage = require('./about/aboutPage.js');
const GamePage = require('./game/gamePage.js');

class PageManager extends Control{
  constructor (parentNode, className){
    super(parentNode, 'div', className);
    this.logo = new Control(this.node, 'div', 'logo', 'Horns');
    this.pages = [];
    this.marks = [];
    this.currentPage = null;
    this.currentIndex = -1;
  }

  add(page, name){
    page.hide();
    this.pages.push(page);
    let mark = new Control(this.node, 'div', 'navi_item', name);
    mark.node.addEventListener('click', ()=>{
      this.select(this.pages.indexOf(page));
    });
    this.marks.push(mark);
  }

  selectByName(name){
    let index = this.pages.findIndex(it=>it.name == name);
    this.select(index);
  }

  selectByScene(page){
    let index = this.pages.indexOf(page);
    this.select(index);
  }

  select(index){
    this.pages.forEach((it, i)=>{
      if (i!=index){
        it.hide();
      } else {
        it.show();
        this.currentPage = it;
        this.currentIndex = i;
      }
    });
  }
}

module.exports = PageManager;

module.exports = PageManager;