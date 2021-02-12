const Control = require('common/control.js');
const Team = require('./core/team.js');
const { Group, Toggle } = require('common/group.js');


// class TeamItem {
//     constructor(name, avatar, score) {
//         super(name, avatar);
//         this.score = score;
//     }
    // constructor(parentNode, activeClass, inactiveClass, caption, onClick) {
    //     super(parentNode, activeClass, inactiveClass, caption, onClick);
    //     this.itemInner = new Control(this.node.parentNode, 'div', 'settings_team_block', '0');
    //     this.teamScore = 0;

    // }
}

// class TeamChoice extends Group {
//     constructor(parentNode, wrapperClass, activeItemClass, inactiveItemClass) {
//         super(parentNode, wrapperClass, activeItemClass, inactiveItemClass);
//     }

//     addButton(caption) {
//         let but = new TeamItem(this.node, this.activeItemClass, this.inactiveItemClass, caption, () => {
//             this.select(this.buttons.findIndex(it => but == it));
//         });
//         this.buttons.push(but);
//     }
// }

class SettingsMenu extends Control {
    constructor(parentNode, sceneManager) {
        super(parentNode, 'div', 'gamescreen_wrapper_centred', '');
        let settingsWrapper = new Control(this.node, 'div', "settings_wrapper");
        let settingsItemTeam = new Control(settingsWrapper.node, 'div', 'settings_item settings_team');
        this.itemTitle = new Control(settingsItemTeam.node, 'div', 'settings_item_title', 'Команды');
        // let settingsTeamInner = new Control(settingsItemTeam.node, 'div', 'settings_team_inner');


        // this.teamName = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_name', this.teamN.name);
        // this.teamStatus = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_status', 'X');
        // this.teamColor = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_color', 'blue');
        // this.teamAmountPlayers = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_amountPlayers', '1111');
        // let settingsTeamInner2 = new Control(settingsItemTeam.node, 'div', 'settings_team_inner');
        // this.teamName = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_name', '1-UP');
        // this.teamStatus = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_status', 'X');
        // this.teamColor = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_color', 'blue');
        // this.teamAmountPlayers = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_amountPlayers', '1111');

        // let settingsItemMap = new Control(settingsWrapper.node, 'div', 'settings_item settings_map');
        // this.itemTitle = new Control(settingsItemMap.node, 'div', 'settings_item_title', 'Карта');
        // let settingsMapInner = new Control(settingsItemMap.node, 'div', 'settings_map_inner');
        // this.mapView = new Control(settingsMapInner.node, 'div', 'settings_map_block ');
        // let mapSelectInner = new Control(settingsMapInner.node, 'div', 'styled-select ');
        // this.mapSelect = new Control(mapSelectInner.node, 'select', 'map-select');
        // this.mapOption = new Control(this.mapSelect.node, 'option', 'selected="selected"', 'Выберите карту');
        // this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Пустыня');
        // this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Лаборатория');
        // this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Город');
        // this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Остров');
        // this.mapOption = new Control(settingsMapInner.node, 'div', 'settings_draw_map', 'Нарисовать карту');

        let settingsItemTeamChoice = new Control(settingsWrapper.node, 'div', 'settings_item settings_team_selection');
        this.itemTitle = new Control(settingsItemTeamChoice.node, 'div', 'settings_item_title', 'Казарма');
        let TeamChoiceInnerCaption = new Control(settingsItemTeamChoice.node, 'div', 'settings_team_inner');
        this.teamNameTitle = new Control(TeamChoiceInnerCaption.node, 'div', 'settings_team_block team_name', 'Команда');
        this.teamPointsTitle = new Control(TeamChoiceInnerCaption.node, 'div', 'settings_team_block team_status', 'Очки');
        let TeamChoiceItem = new Control(settingsItemTeamChoice.node, 'div', 'settings_team_inner settings_team_item');
        this.teamChoice = new TeamChoice(TeamChoiceItem.node, "settings_item", 'settings_team_block', 'settings_team_block');
        // this.team1 = new TeamItem('1-up', 'settings_team_inner', 'X');

        // this.teamChoice.addButton('t2');

        // this.teamNameChoice = new Control(settingsTeamChoice.node, 'div', 'settings_team_block', this.teamN.name);
        // this.teamChoicePoints = new Control(settingsTeamChoice.node, 'div', 'settings_team_block', this.teamN.score);
        // this.teamNameChoice.node.onclick = () => {
        //     
        //     let settingsTeamInner = new Control(settingsItemTeam.node, 'div', 'settings_team_inner');
        //     this.teamName = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_name', this.teamN.name);
        //     this.teamStatus = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_status', this.teamN.avatar);
        //     this.teamColor = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_color', 'blue');
        //     this.teamAmountPlayers = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_amountPlayers', '1111');
        // }



        // let settingsItemChart = new Control(settingsWrapper.node, 'div', 'settings_item settings_chart');
        // this.itemTitle = new Control(settingsItemChart.node, 'div', 'settings_item_title', 'Настройки схемы');
        // let settingsChartInner = new Control(settingsItemChart.node, 'div', 'settings_chart_inner');
        // this.settingsWeapon = new Control(settingsChartInner.node, 'div', 'settings_weapon ');
        // this.settingsGame = new Control(settingsChartInner.node, 'div', 'settings_game ');

        // let chartSelectInner = new Control(settingsItemChart.node, 'div', 'styled-select ');
        // this.chartSelect = new Control(chartSelectInner.node, 'select', 'chart-select');
        // this.chartOption = new Control(this.chartSelect.node, 'option', 'selected="selected"', 'Профи');
        // this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Турнирная');
        // this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Классическая');
        // this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Внезапное наводнение');
        // this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Армагедон');

        this.startGame = new Control(settingsWrapper.node, 'div', 'startGame_btn', 'Начать игру');
        this.exit = new Control(settingsWrapper.node, 'div', 'return_btn', 'Назад');
        this.exit.node.onclick = () => {
            sceneManager.back();
        }

    }
}


module.exports = SettingsMenu;