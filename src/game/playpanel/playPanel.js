const Control = require('common/control.js');
const TeamIndicator = require('./teamIndicator.js');
const TimeIndicator = require('./timeIndicator');
const WeaponMenu = require('./weaponMenu');
class PlayPanel extends Control {
  constructor(parentNode, sceneManager) {
    super(parentNode, 'div', 'gamescreen_wrapper', `
      <div class="gamescreen_top menu"></div>

      <div class="gamescreen_bottom">
        <div id="gclock" class="gamescreen_panel"></div>
        <div id="tm" class="gamescreen_panel"></div>
        <div class="gamescreen_panel gamescreen_wind"></div>
      </div>
    `);
    this.timeIndicator = new TimeIndicator(this.node.querySelector('#gclock'));
    this.teamIndicator = new TeamIndicator(this.node.querySelector('#tm'));

    this.back = new Control(this.node.querySelector('.gamescreen_top'),
      'div', 'gamescreen_pause menu__item',
      `
        <svg class="menu__icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          width="124.5px" height="124.5px" viewBox="0 0 124.5 124.5">
          <g>
            <path d="M116.35,124.5c3.3,0,6-2.699,6-6V6c0-3.3-2.7-6-6-6h-36c-3.3,0-6,2.7-6,6v112.5c0,3.301,2.7,6,6,6H116.35z"/>
            <path d="M44.15,124.5c3.3,0,6-2.699,6-6V6c0-3.3-2.7-6-6-6h-36c-3.3,0-6,2.7-6,6v112.5c0,3.301,2.7,6,6,6H44.15z"/>
          </g>
        </svg>
        <div class="menu__text">Pause</div>
      `);

    this.back.node.onclick = () => {
      this.onBack();
    }

    // this.weaponMenu = new Group(this.node.querySelector('.weapon_btn'), '', 'weapon_item weapon_item__selected', 'weapon_item');
    this.weaponButton = new Control(this.node.querySelector('.gamescreen_top'),
      'div', 'gamescreen_weapons menu__item',
      `
        <svg class="menu__icon" width="31.626" height="26.463" version="1.1" viewBox="0 0 31.626 26.464" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(-2.5e-4,-2.582)">
          <path d="m31.123 4.396c-2.739-1.753-5.07-1.404-7.102-0.246-1.777-1.518-3.445-1.568-3.445-1.568l-2.534 2.536c-4.686-2.255-10.472-1.451-14.354 2.432-4.917 4.917-4.917 12.891 0 17.807 4.917 4.918 12.889 4.918 17.806 0 3.885-3.883 4.688-9.67 2.436-14.354l2.535-2.536s-0.035-1.192-0.957-2.633c1.403-0.674 2.792-0.655 4.438 0.4 0.507 0.325 1.184 0.177 1.508-0.331 0.324-0.507 0.18-1.181-0.331-1.507zm-19.409 4.259c-0.247 0.053-6.073 1.345-6.871 6.735-0.088 0.594-0.644 1.008-1.241 0.918-0.24-0.035-0.451-0.146-0.61-0.307-0.236-0.236-0.362-0.577-0.309-0.934 1.023-6.913 8.28-8.487 8.588-8.55 0.591-0.121 1.167 0.259 1.291 0.848 0.12 0.591-0.258 1.167-0.848 1.29zm3.739-0.694c-0.421 0.422-1.107 0.421-1.528 0-0.422-0.422-0.422-1.106 0-1.528 0.421-0.422 1.107-0.421 1.528 0 0.422 0.421 0.422 1.107 0 1.528z"/>
          </g>
        </svg>
        <div class="menu__text">Weapon</div>
      `);
    // this.weaponMenu.addButton('W');
    // this.weaponMenu.addButton('w2');
    // this.weaponMenu.addButton('w3');
    this.weaponButton.node.onclick = () => {
      this.openWeapon.toggle();
      // if (this.weaponScreen.isHidden()) {
        // this.weaponScreen.show();
      //   this.openWeapon.open();
      // } else {
        // this.weaponScreen.hide();
      //   this.openWeapon.close();
      // }
    }
    this.weaponScreen = new Control(this.node, 'div', "weaponscreen_inner", '');
    this.weaponScreen.node.onclick = () => {
      // this.weaponScreen.hide();
      this.openWeapon.close();
    }

    this.openWeapon = new WeaponMenu(this.weaponScreen.node,
      'weaponscreen_wrapper', 'weaponscreen_item weaponscreen_item_active',
      'weaponscreen_item');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bullets</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Multy</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Grenade</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bazuka</div>');
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
  }
}


module.exports = PlayPanel;