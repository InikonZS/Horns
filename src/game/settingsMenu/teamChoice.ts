import Control from "common/control";
import { ITeamItemData } from "../ITeamItemData";
import { TeamItem } from "./teamItem";
import { teams } from "./defaultSettings";

export class TeamChoice extends Control {
    private items: TeamItem[];
    private addButton: Control;
  
    constructor(parentNode: HTMLElement, wrapper: HTMLElement) {
      super(parentNode);
      this.items = [];
      this.addButton = new Control(wrapper, 'div', 'add_team_btn', 'Add new');
      this.addButton.node.onclick = () => {
        const teamData = teams.shift(); //bad very
        this.addItem(teamData);
      }
    }
  
    chooseItem(data: ITeamItemData) {
      let item = new TeamItem(this.node);
      item.setData(data);
      item.onDelete = () => {
        this.items = this.items.filter(el => el == item);
        item.choose();
      }
    }
  
    addItem(data: ITeamItemData) {
      if (this.items.length < 6) {
        let item = new TeamItem(this.node);
        item.setData(data);
        item.onDelete = () => {
          this.items = this.items.filter(el => el !== item);
          item.destroy();
        }
        this.items.push(item);
        return item;
      }
      return null;
    }
  
  
    loadTeams(array: Array<ITeamItemData>) {
      array.forEach(element => {
        this.addItem(element);
      });
    }
  
    getTeamsData() {
      return this.items.map(el => el.getData());
    }
  
  }