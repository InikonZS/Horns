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
    this.weaponButton = new Control(this.node.querySelector('.gamescreen_top'), 'div', 'gamescreen_weapons menu__item',
    `
    <svg class="menu__icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 335.883 335.883" style="enable-background:new 0 0 335.883 335.883;" xml:space="preserve">
      <g>
        <g>
          <path d="M44.469,321.391l-0.044-0.076c6.005,2.377,12.499,3.775,19.347,3.775
            c27.135,0,49.479-20.396,52.617-46.689c-6.783,2.6-14.114,4.085-21.794,4.085c-9.007,0-17.541-2.007-25.248-5.521l-1.49,11.863
            H30.686l7.859,22.703l-15.969-26.543l36.812-5.118l-0.114-8.692c-15.626-11.096-25.874-29.3-25.874-49.882
            c0-2.317,0.158-4.601,0.408-6.853c-22.387,8.702-36.746,31.851-33.298,56.68C3.453,292.248,25.323,315.555,44.469,321.391z"/>
          <path d="M195.892,10.793l-92.203,128.906L88.291,55.453L67.612,149.87l-22.425-27.892v63.365v16.79v1.033
            c0,2.915,0.033,5.624,0.092,8.213c0.435,17.465,2.861,28.256,13.772,42.419c2.518,3.269,5.45,6.701,8.953,10.459
            c0.794,0.848,1.675,1.637,2.638,2.382c5.586,4.319,14.103,6.772,26.031,7.582c2.948,0.201,6.037,0.337,9.42,0.337
            c3.421,0,6.967-0.109,10.595-0.299c3.127-0.163,6.304-0.392,9.518-0.674c35.387-3.106,74.227-12.613,76.174-13.092l37.579-9.274
            l-73.563-12.891l107.166-38.106H166.543l169.34-179.407L152.831,146.721L195.892,10.793z M149.513,194.492l-5.988,6.347
            l-6.26,6.636l-8.556,9.067h10.503h8.18h8.159h23.426l-23.361,8.305l-8.425,2.997l-8.79,3.127l-30.992,11.02l-4.83,1.719
            l6.679,1.169l20.924,3.666l8.915,1.561l8.594,1.507l8.8,1.545c-3.492,0.582-7.114,1.131-10.748,1.664
            c-3.769,0.549-7.549,1.033-11.362,1.479c-4.558,0.538-9.067,0.979-13.505,1.305c-2.04,0.152-4.003,0.25-5.983,0.348
            c-2.981,0.141-5.978,0.299-8.779,0.299c-19.842,0-25.041-3.922-26.162-5.118c-2.567-2.752-4.737-5.232-6.641-7.566
            c-11.215-13.777-11.786-21.914-11.786-42.387v-12.075V179.91v-9.992v-1.599l0.854,1.066l5.14,6.385l5.162,6.418l3.595,4.471
            l1.518-6.935l2.045-9.333l1.953-8.909l5.075-23.181l4.019,21.99l1.479,8.082l1.479,8.082l0.74,4.052l2.823-3.949l5.434-7.598
            l5.232-7.321l41.163-57.551l-20.957,66.161l-2.578,8.142l-2.611,8.251l-0.163,0.446l0.364-0.25l6.913-4.754l6.875-4.727
            l81.548-56.088L149.513,194.492z"/>
          <path d="M253.454,292.879l-116.864-5.635l114.248,15.741C268.248,299.096,253.454,292.879,253.454,292.879z
            "/>
          <path d="M52.143,61.839l9.317,63.327c0,0-2.366-71.943-1.36-80.052
            C61.107,37.01,48.14,34.595,52.143,61.839z"/>
          <path d="M238.877,38.048l-59.672,70.827c0,0,75.897-71.067,85.709-77.615
            C274.72,24.706,264.544,7.573,238.877,38.048z"/>
        </g>
      </g>
    </svg>
    <div class="menu__text">Weapon</div>
  `);
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
  }
}


module.exports = PlayPanel;