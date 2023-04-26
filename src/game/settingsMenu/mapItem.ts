import Control from "common/control";
import { IMapItemData } from "./IMapItemData";

export class MapItem extends Control {
    private name: Control;
    private data: IMapItemData;
  
    constructor(parentNode: HTMLElement) {
      super(parentNode);
      this.name = new Control(parentNode, 'option', ' map_name', ' map');
  
    }
  
    setData(data: IMapItemData) {
      this.data = JSON.parse(JSON.stringify(data));
      this.refresh();
    }
  
    refresh() {
      this.name.setContent(this.data.name);
    }
  
    getData() {
      return this.data;
    }
}
  