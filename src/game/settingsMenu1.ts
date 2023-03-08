import Control from "common/control";
import { ITeamItemData } from "./ITeamItemData";
class TeamItem extends Control {
  name: Control;
  teamColor: Control;
  teamStatus: Control;
  data: ITeamItemData;
  removeButton: Control;
  teamAmountPlayers: Control;
  addButton: Control;
  teamPlayerHealts: Control;
  deleteButton: Control;
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
    this.teamAmountPlayers.setContent(this.data.playersNumber);
    this.teamPlayerHealts.setContent(this.data.playersHealts);
    this.teamColor.node.style.backgroundColor = this.data.color;
  }
}

class TeamChoice extends Control {
  items: TeamItem[];
  addButton: Control;
  constructor(parentNode: HTMLElement, wrapper: HTMLElement) {
    super(parentNode);
    this.items = [];
    this.addButton = new Control(wrapper, 'div', 'add_team_btn', 'Add new');
    this.addButton.node.onclick = () => {
      const teamData = teams.shift();
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

interface IMapItemData{
   name: string; 
}
class MapItem extends Control {
  name: Control;
  data: IMapItemData;

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


class MapChoice extends Control {
  items: MapItem[];
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



const colors = ['#fd434f', '#ffe00d', '#40d04f', '#007bff', '#7b5dfa', '#1abcff', '#f8468d', '#ff7a51'];

import av4 from "../assets/avatar_4.jpg";
import av5 from "../assets/avatar_5.png";
import av6 from "../assets/avatar_6.jpg";

const teams = [
  {
      name: 'Winners',
      avatar: av4,
      playersNumber: 3,
      playersHealts: 200,
      isComputer: true,
      color: '#007bff',
  },
  {
      name: 'Gamers',
      avatar: av5,
      playersNumber: 1,
      playersHealts: 200,
      isComputer: true,
      color: '#7b5dfa',
  },
  {
      name: 'Horns',
      avatar: av6,
      playersNumber: 1,
      playersHealts: 200,
      isComputer: true,
      color: '#1abcff',
  },
];

import map1 from "../assets/bitmap3.png";
import map2 from "../assets/bitmap1.png";
import map3 from "../assets/bitmap2.png";
import map4 from "../assets/bitmap.png";
import SceneManager from "./sceneManager";

const mapList = [
  {
      name: 'Island',
      url: map1
  },
  {
      name: 'Desert',
      url: map2
  },
  {
      name: 'City',
      url: map3
  },
  {
      name: 'Underground',
      url: map4
  }
];
export default class SettingsMenu extends Control {
    itemTeamTitle: Control;
    team: TeamChoice;
    itemMapTitle: Control;
    map: MapChoice;
    drawMapButton: Control;
    onEditor: () => void;
    backButton: Control;
    startGameButton: Control;
    onFight: (data: Array<ITeamItemData>) => void;

    constructor(parentNode: HTMLElement, sceneManager: SceneManager, config: any) {
        super(parentNode, 'div', 'gamescreen_wrapper_centred gamescreen_wrapper-settings', '');
        let settingsItemTeam = new Control(this.node, 'div', 'settings_item settings_team');
        this.itemTeamTitle = new Control(settingsItemTeam.node, 'div', 'settings_item_title', 'TEAMS');
        this.team = new TeamChoice(settingsItemTeam.node, settingsItemTeam.node);
        this.team.loadTeams(config.teams);

        let settingsItemMap = new Control(this.node, 'div', 'settings_item settings_map');
        this.itemMapTitle = new Control(settingsItemMap.node, 'div', 'settings_item_title', 'MAPS');

        const settingsMapInner = new Control(settingsItemMap.node, 'div', 'settings_map_inner');
        const mapChoiceWrapper = new Control(settingsMapInner.node, 'div', 'settings_map_choice-wrapper', 'Select map');

        this.map = new MapChoice(mapChoiceWrapper.node);
        this.map.loadMaps(mapList);

        this.drawMapButton = new Control(settingsMapInner.node, 'div', 'draw_map_btn', 'Draw map');
        this.drawMapButton.node.onclick = () => {
            this.onEditor && this.onEditor();
        }

        const returnBtns = new Control(this.node, 'div', 'settings_return_btn-wrapper');
        this.backButton = new Control(returnBtns.node, 'div', ' settings_return_btn return_btn', 'Back');
        this.backButton.node.onclick = () => {
            sceneManager.back();
        };

        this.startGameButton = new Control(returnBtns.node, 'div', 'settings_return_btn return_btn', 'Start game');
        this.startGameButton.node.onclick = () => {
            this.onFight && this.onFight(this.getConfig());
        }

    }

    getConfig() {
      return this.team.getTeamsData();
    }

    setConfig(teamsConfig: Array<ITeamItemData>) {
      this.team.loadTeams(teamsConfig);
    }
}