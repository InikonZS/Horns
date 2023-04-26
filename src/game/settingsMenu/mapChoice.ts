import Control from "common/control";
import { MapItem } from "./mapItem";
import { IMapItemData } from "./IMapItemData";

export class MapChoice extends Control<HTMLSelectElement> {
    private items: MapItem[];
    onChange: (data: IMapItemData)=>void;
  
    constructor(parentNode: HTMLElement) {
      super(parentNode, 'select', 'styled-select');
      this.items = [];
      this.node.onchange = () => {
        this.onChange(this.items[this.node.selectedIndex].getData());
      };
    }
  
    addItem(data: IMapItemData) {
      let item = new MapItem(this.node);
      item.setData(data);
      this.items.push(item);
      return item;
    }
  
    loadMaps(array: Array<IMapItemData>) {
      array.forEach(element => {
          this.addItem(element);
      });
    }
}
  