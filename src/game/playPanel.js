const Control = require('common/control.js');
const Utils = require('../modules/utils');
const { Group, Toggle } = require('common/group.js');

const TeamIndicator = require('./teamIndicator.js');

const timeIndicatorNodes = {
  timeLeft:{tag: 'div', class: 'clock-next__time-left'},
  progressBar:{tag: 'div', class: 'clock-next__progress-bar'},
  progressBarShadow:{tag: 'div', class: 'clock-next__progress-bar clock-next__progress-bar_shadow'},
};

class TimeIndicator extends Control {
  constructor(parentNode) {
    super(parentNode, 'div', 'gamescreen__clock clock-next', '');
    Utils.createNodes(this, timeIndicatorNodes, Control);
  }
  update(count){
    this.timeLeft.node.textContent = count;
    this.progressBar.node.style.width = `${count * 2}px`;
  }
}


class WeaponItem extends Toggle {
  constructor(parentNode, activeClass, inactiveClass, caption, onClick) {
    super(parentNode, activeClass, inactiveClass, caption, onClick);
    this.itemW = new Control(this.node, 'div', 'weapon_amount_available', '22');
  }

}

class WeaponMenu extends Group {
  constructor(parentNode, wrapperClass, activeItemClass, inactiveItemClass) {
    super(parentNode, wrapperClass, activeItemClass, inactiveItemClass);
  }

  addButton(caption) {
    let but = new WeaponItem(this.node, this.activeItemClass, this.inactiveItemClass, caption, () => {
      this.select(this.buttons.findIndex(it => but == it));
    });
    this.buttons.push(but);
  }
}

const playPanelNodes = {
  topPanel:{tag: 'div', class: 'gamescreen_top',
    childs:{
      burger: {tag: 'div', class: 'gamescreen_panel gamescreen_burger'},
      weapons: {tag: 'div', class: 'gamescreen_panel gamescreen_weapons',
        childs:{
          buttons: {tag: 'div', class: 'weapon_btn'}
        },
      },
    }
  },
  bottomPanel:{tag: 'div', class: 'gamescreen_bottom',
    childs:{
      gclock: {tag: 'div', class: 'gamescreen_panel'},
      tm: {tag: 'div', class: 'gamescreen_panel'},
      wind: {tag: 'div', class: 'gamescreen_panel gamescreen_wind'},
    },
  },
};

class PlayPanel extends Control {
  constructor(parentNode, sceneManager) {
    super(parentNode, 'div', 'gamescreen_wrapper');
    Utils.createNodes(this, playPanelNodes, Control);

    this.timeIndicator = new TimeIndicator(this.bottomPanel.gclock.node);
    this.teamIndicator = new TeamIndicator(this.bottomPanel.tm.node);


    // this.weaponMenu = new Group(this.node.querySelector('.weapon_btn'), '', 'weapon_item weapon_item__selected', 'weapon_item');
    this.weaponButton = new Control(this.node.querySelector('.weapon_btn'), 'div', '', 'Weapons')
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

    this.openWeapon = new WeaponMenu(this.weaponScreen.node, "weaponscreen_wrapper", 'weaponscreen_item weaponscreen_item_active', 'weaponscreen_item');
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


    this.windIndicator = new Control(this.node.querySelector('.gamescreen_wind'), 'div', '', '0');

    this.back = new Control(this.node.querySelector('.gamescreen_burger'), 'div', '', 'back');
    this.back.node.onclick = () => {
      this.onBack();
    }
  }
}


module.exports = PlayPanel;