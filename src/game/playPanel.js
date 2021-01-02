const Control = require('common/control.js');

class TimeIndicator extends Control{
  constructor(parentNode){
    super(parentNode, 'div', 'gamescreen_clock', '');
  }
}

class TeamIndicatorItem extends Control{
  constructor(parentNode, data){
    super(parentNode, 'div', 'teams_item', ''); 
    let nameBlock = new Control(this.node, 'div', "team_block team_name");
    this.teamName = new Control(nameBlock.node, 'div', "team_name-text", data.name);
    this.teamAvatar = new Control(this.node, 'div', "team_block team_avatar", data.avatar);
    let healthBlock = new Control(this.node, 'div', "team_block team_health");
    this.teamHealth = new Control(healthBlock.node, 'div', "team_health-value");
    this.setHealth(100);
  }

  setHealth(health){
    this.teamHealth.node.style.width = `${health}%`;
  }
}

class TeamIndicator extends Control{
  constructor(parentNode){
    super(parentNode, 'div', 'teams_wrapper', '');
    this.teams = [];
  }

  addTeam(data){
    let team = new TeamIndicatorItem(this.node, data);
    this.teams.push(team);
  }
}

class PlayPanel extends Control{
  constructor(parentNode, config){
    super(parentNode, 'div', 'gamescreen_wrapper', `
    <div class="gamescreen_top">
      <div class="gamescreen_panel gamescreen_burger">
    
      </div>
      <div class="gamescreen_panel gamescreen_weapons">
    
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
    this.teamIndicator.addTeam({name:'sdfsdf', avatar:'G'});
    this.teamIndicator.addTeam({name:'sdfssdff', avatar:'H'});
    this.teamIndicator.addTeam({name:'sdf4334sdf', avatar:'K'});
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