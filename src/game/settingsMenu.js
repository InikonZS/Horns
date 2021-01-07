const Control = require('common/control.js');

class SettingsMenu extends Control {
    constructor(parentNode, config) {
        super(parentNode, 'div', 'gamescreen_wrapper_settings', '');
        let menuWrapper = new Control(this.node, 'div', "menu_wrapper");
        this.fightButton = new Control(menuWrapper.node, 'div', 'load_button menu_item', 'Fight');

    }
}


module.exports = SettingsMenu;