const Control = require('common/control.js');


class TeamItem extends Control {
    constructor(parentNode) {
        super(parentNode, 'div', 'settings_team_inner');
        this.name = new Control(this.node, 'div', 'settings_team_block team_name', ' team');
        this.teamStatus = new Control(this.node, 'div', 'settings_team_block team_status', 'X');
        this.teamColor = new Control(this.node, 'div', 'settings_team_block team_color', 'blue');
        this.teamAmountPlayers = new Control(this.node, 'div', 'settings_team_block team_amountPlayers', '1');
        this.teamPlayerHealts = new Control(this.node, 'div', 'settings_team_block team_amountPlayers', '100');


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
        this.teamStatus.setContent(this.data.isComputer ? 'CUP' : 'UP');
        this.teamAmountPlayers.setContent(this.data.playersNumber);
        this.teamPlayerHealts.setContent(this.data.playersHealts);
    }
}

class TeamChoice extends Control {
    constructor(parentNode) {
        super(parentNode);
        this.items = [];
        this.addButton = new Control(this.node, 'div', 'team_btn add_team_btn', 'Add new');
        this.addButton.node.onclick = () => {
            this.addItem(defaultData);
        }
        let defaultData = {
            name: 'Winner',
            avatar: 'PG',
            playersNumber: 3,
            playersHealts: 100,
        };

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


const defaultGameConfig = {
    format: 'easycount',
    mapURL: './assets/bitmap3.png',
    nameList: '',
    colorList: '',
    teams: [
        {
            name: 'Progers',
            avatar: 'PG',
            playersNumber: 1,
            playersHealts: 100,
        },
        {
            name: 'Killers',
            avatar: 'KI',
            playersNumber: 1,
            playersHealts: 50,
        },
        {
            name: 'Cloners',
            avatar: 'CR',
            playersNumber: 1,
            playersHealts: 200,
        },
    ]
}

class SettingsMenu extends Control {
    constructor(parentNode, sceneManager, config,) {
        super(parentNode, 'div', 'gamescreen_wrapper_centred', '');
        let settingsWrapper = new Control(this.node, 'div', "settings_wrapper");
        let settingsItemTeam = new Control(settingsWrapper.node, 'div', 'settings_item settings_team');
        this.itemTitle = new Control(settingsItemTeam.node, 'div', 'settings_item_title', 'TEAMS');
        this.team = new TeamChoice(settingsItemTeam.node).loadTeams(defaultGameConfig.teams);
        this.backButton = new Control(settingsItemTeam.node, 'div', ' settings_return_btn return_btn', 'Back');

        this.backButton.node.onclick = () => {
            sceneManager.back();
        };
    }
}





module.exports = SettingsMenu;