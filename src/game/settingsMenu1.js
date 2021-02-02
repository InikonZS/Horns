const Control = require('common/control.js');


class TeamItem extends Control {
  constructor(parentNode) {
    super(parentNode, 'div', 'settings_team_inner');
    this.name = new Control(this.node, 'div', 'settings_team_block team_name', ' team');
    this.teamStatus = new Control(this.node, 'div', 'settings_team_block team_status', 'X');
    this.teamColor = new Control(this.node, 'div', 'settings_team_block team_color', 'color');
    this.teamAmountPlayers = new Control(this.node, 'div', 'settings_team_block team_amountPlayers', '1');
    this.teamPlayerHealts = new Control(this.node, 'div', 'settings_team_block team_amountPlayers', '100');

    this.node.onclick = () => {
      this.node.classList.toggle('settings_active_team');
    }

    this.addButton = new Control(this.node, 'div', 'team_btn ', '+');
    this.addButton.node.onclick = () => {
      if (this.data.playersNumber < 7) {
        this.data.playersNumber += 1;
        this.refresh();
      }
    }
    this.removeButton = new Control(this.node, 'div', 'team_btn ', '-');

    this.removeButton.node.onclick = () => {
      if (this.data.playersNumber > 1) {
        this.data.playersNumber -= 1;
        this.refresh();
      }
    }

    this.deleteButton = new Control(this.node, 'div', 'team_btn ', 'X');

    this.deleteButton.node.onclick = () => {
      this.onDelete && this.onDelete();
    }
  }
  setData(data) {
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
  constructor(parentNode) {
    super(parentNode);
    this.items = [];
    this.addButton = new Control(this.node, 'div', 'add_team_btn', 'Add new');
    this.addButton.node.onclick = () => {
      const teamData = teams.shift();
      // defaultGameConfig.teams.push(teamData);
      this.addItem(teamData);
    }
    // let defaultData = {
    //   name: 'Winner',
    //   avatar: 'PG',
    //   playersNumber: 3,
    //   playersHealts: 100,
    // };

  }

  chooseItem(data) {
    let item = new TeamItem(this.node);
    item.setData(data);
    item.onDelete = () => {
      this.items = this.items.filter(el => el == item);
      item.choose();
    }
  }

  addItem(data) {
    if (this.items.length < 6) {
      let item = new TeamItem(this.node);
      item.setData(data);
      item.onDelete = () => {
        this.items = this.items.filter(el => el == item);
        item.destroy();
      }
      this.items.push(item);
      return item;
    }
    return null;
  }


  loadTeams(array) {
    array.forEach(element => {
      this.addItem(element);
    });
  }

  getTeamsData() {
    return this.items.map(el => el.getData());
  }

}

class MapItem extends Control {
  constructor(parentNode) {
    super(parentNode);
    this.name = new Control(parentNode, 'option', ' map_name', ' map');

  }

  setData(data) {
    this.data = JSON.parse(JSON.stringify(data));
    this.refresh();
  }

  refresh() {
    this.name.setContent(this.data.name);
  }
}


class MapChoice extends Control {
  constructor(parentNode) {
    super(parentNode, 'select', 'styled-select');
    this.items = [];
  }

  addItem(data) {
    let item = new MapItem(this.node);
    item.setData(data);
    this.items.push(item);
    return item;
  }

  loadMaps(array) {
    array.forEach(element => {
        this.addItem(element);
    });
  }
}



const colors = ['#fd434f', '#ffe00d', '#40d04f', '#007bff', '#7b5dfa', '#1abcff', '#f8468d', '#ff7a51'];
const teams = [
  {
      name: 'Winners',
      avatar: './assets/avatar_4.jpg',
      playersNumber: 3,
      playersHealts: 200,
      isComputer: true,
      color: '#007bff',
  },
  {
      name: 'Gamers',
      avatar: './assets/avatar_5.png',
      playersNumber: 1,
      playersHealts: 200,
      isComputer: true,
      color: '#7b5dfa',
  },
  {
      name: 'Horns',
      avatar: './assets/avatar_6.jpg',
      playersNumber: 1,
      playersHealts: 200,
      isComputer: true,
      color: '#1abcff',
  },
]
class SettingsMenu extends Control {
    constructor(parentNode, sceneManager, config) {
        super(parentNode, 'div', 'gamescreen_wrapper_centred', '');
        // let settingsWrapper = new Control(this.node, 'div', "settings_wrapper");
        let settingsItemTeam = new Control(this.node, 'div', 'settings_item settings_team');
        this.itemTeamTitle = new Control(settingsItemTeam.node, 'div', 'settings_item_title', 'TEAMS');
        this.team = new TeamChoice(settingsItemTeam.node);
        this.team.loadTeams(config.teams);

        let settingsItemMap = new Control(this.node, 'div', 'settings_item settings_map');
        this.itemMapTitle = new Control(settingsItemMap.node, 'div', 'settings_item_title', 'MAPS');
        // let settingsMapInner = new Control(this.node, 'div', 'settings_map_inner');
        // this.mapView = new Control(settingsMapInner.node, 'div', 'settings_map_block ');

        this.map = new MapChoice(settingsItemMap.node);
        this.map.loadMaps(config.mapList);

        this.drawMapButton = new Control(settingsItemMap.node, 'div', 'draw_map_btn', 'Draw map');
        this.drawMapButton.node.onclick = () => {
            this.onEditor && this.onEditor();
        }

        this.backButton = new Control(this.node, 'div', ' settings_return_btn return_btn', 'Back');
        this.backButton.node.onclick = () => {
            sceneManager.back();
        };

        this.startGameButton = new Control(this.node, 'div', 'settings_return_btn return_btn', 'Start game');
        this.startGameButton.node.onclick = () => {
            this.onFight && this.onFight(this.getConfig());
        }

    }

    getConfig() {
      return this.team.getTeamsData();
    }

    setConfig(teamsConfig) {
      this.team.loadTeams(teamsConfig);
    }
}

module.exports = SettingsMenu;