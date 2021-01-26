const Control = require('common/control.js');
const TeamIndicator = require('./teamIndicator.js');
const TimeIndicator = require('./timeIndicator');
const WeaponMenu = require('./weaponMenu');
class PlayPanel extends Control {
  constructor(parentNode, sceneManager) {
    super(parentNode, 'div', 'gamescreen_wrapper', `
      <div class="gamescreen_top">
        <div class="gamescreen_panel gamescreen_pause"></div>
        <div class="gamescreen_panel gamescreen_weapons">
        </div>
      </div>

      <div class="gamescreen_bottom">
        <div id="gclock" class="gamescreen_panel"></div>
        <div id="tm" class="gamescreen_panel"></div>
        <div class="gamescreen_panel gamescreen_wind"></div>
      </div>
    `);
    this.timeIndicator = new TimeIndicator(this.node.querySelector('#gclock'));
    this.teamIndicator = new TeamIndicator(this.node.querySelector('#tm'));


    // this.weaponMenu = new Group(this.node.querySelector('.weapon_btn'), '', 'weapon_item weapon_item__selected', 'weapon_item');
    this.weaponButton = new Control(this.node.querySelector('.gamescreen_weapons'), 'div', '', 'Weapons')
    // this.weaponMenu.addButton('W');
    // this.weaponMenu.addButton('w2');
    // this.weaponMenu.addButton('w3');
    this.weaponButton.node.onclick = () => {
      this.weaponScreen.show();
    }
    this.weaponScreen = new Control(this.node, 'div', "weaponscreen_inner", '');
    this.weaponScreen.node.onclick = () => {
      this.weaponScreen.hide();
    }

    this.openWeapon = new WeaponMenu(this.weaponScreen.node,
      'weaponscreen_wrapper', 'weaponscreen_item weaponscreen_item_active',
      'weaponscreen_item');
    this.openWeapon.addButton('w1');
    this.openWeapon.addButton('w1');
    this.openWeapon.addButton('w1');
    this.openWeapon.addButton('w1');
    // <div class="weaponscreen_wrapper">
    //         <div class="weaponscreen_item weapon_contain">
    // <div class="weapon_amount_available">1</div>
    //         </div>
    //         <div class="weaponscreen_item weaponscreen_item_unavailable weapon_contain">
    //             <p class="weapon_amount_available">0</p>
    //         </div>
    //         <div class="weaponscreen_item weapon_contain">
    //             <p class="weapon_amount_available">5</p>
    //         </div>
    //         <div class="weaponscreen_item weapon_contain">
    //             <p class="weapon_amount_available">6</p>
    //         </div>
    //         <div class="weaponscreen_item weapon_contain"></div>
    //         <div class="weaponscreen_item"></div>
    //         <div class="weaponscreen_item"></div>
    //         <div style="background-image: url(./assets/Авиаудар.webp);" class="weaponscreen_item weapon_contain">
    //             <p class="weapon_amount_available">2</p>
    //         </div>
    //         <div style="background-image: url(./assets/Авиаудар.webp);" class="weaponscreen_item weapon_contain">
    //             <p class="weapon_amount_available">3</p>
    //         </div>


    this.windIndicator = new Control(this.node.querySelector('.gamescreen_wind'),
      'div', 'wind-indicator', '0');

    this.back = new Control(this.node.querySelector('.gamescreen_pause'),
      'div', 'menu__item',
      `
        <div>back</div>
        <svg class="menu__icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          width="124.5px" height="124.5px" viewBox="0 0 124.5 124.5">
          <g>
            <path style="fill:#616a82;" d="M116.35,124.5c3.3,0,6-2.699,6-6V6c0-3.3-2.7-6-6-6h-36c-3.3,0-6,2.7-6,6v112.5c0,3.301,2.7,6,6,6H116.35z"/>
            <path style="fill:#616a82;" d="M44.15,124.5c3.3,0,6-2.699,6-6V6c0-3.3-2.7-6-6-6h-36c-3.3,0-6,2.7-6,6v112.5c0,3.301,2.7,6,6,6H44.15z"/>
          </g>
        </svg>
      `);

    this.back.node.onclick = () => {
      this.onBack();
    }
  }
}


module.exports = PlayPanel;