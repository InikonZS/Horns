const Control = require('common/control.js');
const Group = require('common/group.js');
const TeamIndicator = require('./teamIndicator.js');

class TimeIndicator extends Control {
  constructor(parentNode) {
    super(parentNode, 'div', 'gamescreen_clock', '');
  }
}

class PlayPanel extends Control {
  constructor(parentNode, sceneManager) {
    super(parentNode, 'div', 'gamescreen_wrapper', `
    <div class="gamescreen_top">
      <div class="gamescreen_panel gamescreen_burger">
    
      </div>
      <div class="gamescreen_panel gamescreen_weapons">
      <div class="weapon_btn">
                
            </div>   
      </div>
    </div>
    <div class="gamescreen_bottom">
      <div id="gclock" class="gamescreen_panel">

      </div> 
      <div id="tm" class="gamescreen_panel">

    
      </div> 
      <div class="gamescreen_panel gamescreen_wind">
    
      </div> 
    </div>   
    `);
    this.timeIndicator = new TimeIndicator(this.node.querySelector('#gclock'));
    this.teamIndicator = new TeamIndicator(this.node.querySelector('#tm'));

    this.weaponMenu = new Group(this.node.querySelector('.weapon_btn'), '', 'weapon_item weapon_item__selected', 'weapon_item');

    this.weaponMenu.addButton('W');
    // this.weaponMenu.addButton('w2');
    // this.weaponMenu.addButton('w3');


    this.windIndicator = new Control(this.node.querySelector('.gamescreen_wind'), 'div', '', '0');

    this.back = new Control(this.node.querySelector('.gamescreen_burger'), 'div', '', 'back'); 
    this.back.node.onclick = ()=>{
      this.onBack();
    }
  }
}


module.exports = PlayPanel;