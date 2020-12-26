const Control = require('common/control.js');

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
      <div class="gamescreen_panel">
        <div class="gamescreen_clock">
          45
        </div> 
      </div> 
      <div class="gamescreen_panel">
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
        </div> 
      </div> 
      <div class="gamescreen_panel gamescreen_wind">
    
      </div> 
    </div>   
    `);
  }
}

module.exports = PlayPanel;