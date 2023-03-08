import Control from 'common/control';
import AboutPage from './about/aboutPage';
import GamePage from './game/gamePage';
import { IPage } from  './IPage';

export default class PageManager extends Control{
  logo: Control;
  pages: IPage[];
  marks: Control[];
  currentPage: IPage;
  currentIndex: number;

  constructor (parentNode: HTMLElement, className: string){
    super(parentNode, 'div', className);
    this.logo = new Control(this.node, 'div', 'logo', 'Horns');
    this.pages = [];
    this.marks = [];
    this.currentPage = null;
    this.currentIndex = -1;
  }

  add(page: IPage, name: string){
    page.hide();
    this.pages.push(page);
    let mark = new Control(this.node, 'div', 'navi_item', name);
    mark.node.addEventListener('click', ()=>{
      this.select(this.pages.indexOf(page));
    });
    this.marks.push(mark);
  }

  selectByName(name:string){
    let index = this.pages.findIndex(it=>it.name == name);
    this.select(index);
  }

  selectByScene(page:IPage){
    let index = this.pages.indexOf(page);
    this.select(index);
  }

  select(index:number){
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
