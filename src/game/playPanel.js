const Control = require('common/control.js');
const { Group, Toggle } = require('common/group.js');


class TimeIndicator extends Control {
  constructor(parentNode) {
    super(parentNode, 'div', 'gamescreen_clock', '');
  }
}

class TeamIndicatorItem extends Control {
  constructor(parentNode, data) {
    super(parentNode, 'div', 'teams_item', '');
    this.name = data.name;
    let nameBlock = new Control(this.node, 'div', "team_block team_name");
    this.teamName = new Control(nameBlock.node, 'div', "team_name-text", data.name);
    this.teamAvatar = new Control(this.node, 'div', "team_block team_avatar", data.avatar);
    let healthBlock = new Control(this.node, 'div', "team_block team_health");
    this.teamHealth = new Control(healthBlock.node, 'div', "team_health-value");
    this.setHealth(100);
    this.teamHealth.node.style['background-color'] = data.color;
  }

  setHealth(health, absHealth) {
    this.teamHealth.node.style.width = `${health}%`;
    this.teamHealth.node.innerHTML = absHealth;
  }

  clear() {
    this.node.innerHTML = '';
  }
}

class TeamIndicator extends Control {
  constructor(parentNode) {
    super(parentNode, 'div', 'teams_wrapper', '');
    this.teams = [];
  }

  addTeam(data) {
    let team = new TeamIndicatorItem(this.node, data);
    this.teams.push(team);
  }

  clear() {
    this.teams.forEach(it => {
      it.clear();
    });
    this.teams = [];
    this.node.innerHTML = '';
  }
}

class WeaponItem extends Toggle {
  constructor(parentNode, activeClass, inactiveClass, caption, onClick) {
    super(parentNode, activeClass, inactiveClass, caption, onClick);
    this.itemW = new Control(this.node, 'div', 'weapon_amount_available', '22');
  }
  // <div class="weapon_amount_available">1</div>

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



class PlayPanel extends Control {
  constructor(parentNode, config) {
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
    /*this.teamIndicator.addTeam({name:'sdfsdf', avatar:'G'});
    this.teamIndicator.addTeam({name:'sdfssdff', avatar:'H'});
    this.teamIndicator.addTeam({name:'sdf4334sdf', avatar:'K'});*/
  }
}

/*
<div class="teams_wrapper">

          <div class="teams_item">
            <div class="team_block team_name">
              <div class="team_name-text">
                Player
              </div>
            </div> 
            <div class="team_block team_avatar">
              H    
            </div> 
            <div class="team_block team_health">
              <div class="team_health-value" style="width: 100%;">
      
              </div>    
            </div> 
          </div>  


          <div class="teams_item">
            <div class="team_block team_name">
              <div class="team_name-text">
                Team Name
              </div>
            </div> 
            <div class="team_block team_avatar">
              5    
            </div> 
            <div class="team_block team_health">
              <div class="team_health-value" style="width: 30%;">
      
              </div>    
            </div> 
          </div>  
        </div> */
module.exports = PlayPanel;