import Control from "common/control";
import { ITeamItemData } from "../ITeamItemData";

export class TeamItem extends Control {
    public name: Control;
    private teamColor: Control;
    private teamStatus: Control;
    private data: ITeamItemData;
    private removeButton: Control;
    private teamAmountPlayers: Control;
    private addButton: Control;
    private teamPlayerHealts: Control;
    private deleteButton: Control;
    onDelete: () => void;
    choose() {
      throw new Error("Method not implemented.");
    }
    constructor(parentNode: HTMLElement) {
      super(parentNode, 'div', 'settings_team_inner');
      this.name = new Control(this.node, 'div', 'settings_team_block team_name', ' team');
      this.teamColor = new Control(this.node, 'div', 'settings_team_block team_color', 'color');
      this.teamStatus = new Control(this.node, 'div', 'settings_team_block team_status', 'X');
      this.teamStatus.node.onclick = (e) => {
        e.stopPropagation();
        this.data.isComputer = !this.data.isComputer;
        this.refresh();
      };
  
      this.removeButton = new Control(this.node, 'div', 'team_btn ', '－');
  
      this.removeButton.node.onclick = (e) => {
        e.stopPropagation();
        if (this.data.playersNumber > 1) {
          this.data.playersNumber -= 1;
          this.refresh();
        }
      }
      this.teamAmountPlayers = new Control(this.node, 'div', 'team_amountPlayers', '1');
      this.addButton = new Control(this.node, 'div', 'team_btn ', '＋');
      this.addButton.node.onclick = (e) => {
        e.stopPropagation();
        if (this.data.playersNumber < 7) {
          this.data.playersNumber += 1;
          this.refresh();
        }
      }
  
      this.teamPlayerHealts = new Control(this.node, 'div', 'settings_team_block team_healthPlayers', '100');
      this.teamPlayerHealts.node.onclick = (e) => {
        e.stopPropagation();
        if (this.data.playersHealts < 200) {
          this.data.playersHealts += 10;
        } else {
          this.data.playersHealts =10;
        }
        this.refresh();
      }
  
      this.node.onclick = () => {
        this.node.classList.toggle('settings_active_team');
      }
  
      this.deleteButton = new Control(this.node, 'div', 'team_btn delete', '✕');
  
      this.deleteButton.node.onclick = () => {
        this.onDelete && this.onDelete();
      }
    }
  
    setData(data: ITeamItemData) {
      this.data = JSON.parse(JSON.stringify(data));
      this.refresh();
    }
  
    getData() {
      return this.data;
    }
  
    destroy() {
      this.node.remove();
    }
  
    refresh() {
      this.name.setContent(this.data.name);
      this.teamStatus.setContent(this.data.isComputer ? 'BOT' : 'PLAYER');
      this.teamAmountPlayers.setContent(this.data.playersNumber.toString());
      this.teamPlayerHealts.setContent(this.data.playersHealts.toString());
      this.teamColor.node.style.backgroundColor = this.data.color;
    }
  }