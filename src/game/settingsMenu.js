const Control = require('common/control.js');

class SettingsMenu extends Control {
    constructor(parentNode, config) {
        super(parentNode, 'div', 'gamescreen_wrapper_centred', '');
        let settingsWrapper = new Control(this.node, 'div', "settings_wrapper");
        let settingsItemTeam = new Control(settingsWrapper.node, 'div', 'settings_item settings_team');
        this.itemTitle = new Control(settingsItemTeam.node, 'div', 'settings_item_title', 'Команды');
        let settingsTeamInner = new Control(settingsItemTeam.node, 'div', 'settings_team_inner');
        this.teamName = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_name', '1-UP');
        this.teamStatus = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_status', 'X');
        this.teamColor = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_color', 'blue');
        this.teamAmountPlayers = new Control(settingsTeamInner.node, 'div', 'settings_team_block team_amountPlayers', '1111');
        let settingsTeamInner2 = new Control(settingsItemTeam.node, 'div', 'settings_team_inner');
        this.teamName = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_name', '1-UP');
        this.teamStatus = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_status', 'X');
        this.teamColor = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_color', 'blue');
        this.teamAmountPlayers = new Control(settingsTeamInner2.node, 'div', 'settings_team_block team_amountPlayers', '1111');

        let settingsItemMap = new Control(settingsWrapper.node, 'div', 'settings_item settings_map');
        this.itemTitle = new Control(settingsItemMap.node, 'div', 'settings_item_title', 'Карта');
        let settingsMapInner = new Control(settingsItemMap.node, 'div', 'settings_map_inner');
        this.mapView = new Control(settingsMapInner.node, 'div', 'settings_map_block ');
        let mapSelectInner = new Control(settingsMapInner.node, 'div', 'styled-select ');
        this.mapSelect = new Control(mapSelectInner.node, 'select', 'map-select');
        this.mapOption = new Control(this.mapSelect.node, 'option', 'selected="selected"', 'Выберите карту');
        this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Пустыня');
        this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Лаборатория');
        this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Город');
        this.mapOption = new Control(this.mapSelect.node, 'option', '', 'Остров');
        this.mapOption = new Control(settingsMapInner.node, 'div', 'settings_draw_map', 'Нарисовать карту');

        let settingsItemTeamChoice = new Control(settingsWrapper.node, 'div', 'settings_item settings_team_selection');
        this.itemTitle = new Control(settingsItemTeamChoice.node, 'div', 'settings_item_title', 'Казарма');
        let settingsTeamTable = new Control(settingsItemTeamChoice.node, 'div', 'team-table');
        this.teamTable = new Control(settingsTeamTable.node, 'table', '');
        let tBody = new Control(this.teamTable.node, 'tbody', '');

        let settingsItemChart = new Control(settingsWrapper.node, 'div', 'settings_item settings_chart');
        this.itemTitle = new Control(settingsItemChart.node, 'div', 'settings_item_title', 'Настройки схемы');
        let settingsChartInner = new Control(settingsItemChart.node, 'div', 'settings_chart_inner');
        this.settingsWeapon = new Control(settingsChartInner.node, 'div', 'settings_weapon ');
        this.settingsGame = new Control(settingsChartInner.node, 'div', 'settings_game ');

        let chartSelectInner = new Control(settingsItemChart.node, 'div', 'styled-select ');
        this.chartSelect = new Control(chartSelectInner.node, 'select', 'chart-select');
        this.chartOption = new Control(this.chartSelect.node, 'option', 'selected="selected"', 'Профи');
        this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Турнирная');
        this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Классическая');
        this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Внезапное наводнение');
        this.chartOption = new Control(this.chartSelect.node, 'option', '', 'Армагедон');

        this.startGame = new Control(settingsWrapper.node, 'div', 'startGame_btn', 'Начать игру');
        this.exit = new Control(settingsWrapper.node, 'div', 'exit_btn', 'Выход');


    }
}


module.exports = SettingsMenu;