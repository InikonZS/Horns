import SceneManager from "../sceneManager";
import { IStartOptions } from "../core/IStartOptions";
import Control from "common/control";
import { ITeamItemData } from "../ITeamItemData";
import { TeamChoice } from "./teamChoice";
import { MapChoice } from "./mapChoice";
import { mapList} from "./defaultSettings";

export default class SettingsMenu extends Control {
    private itemTeamTitle: Control;
    private team: TeamChoice;
    private itemMapTitle: Control;
    map: MapChoice;
    private drawMapButton: Control;
    onEditor: () => void;
    private backButton: Control;
    private startGameButton: Control;
    onFight: (data: Array<ITeamItemData>) => void;

    constructor(parentNode: HTMLElement, sceneManager: SceneManager, config: IStartOptions) {
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