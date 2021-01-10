const Control = require('common/control.js');

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

  setHealth(health, absHealth){
    if (health == 0){
      this.hide();
    }
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

module.exports = TeamIndicator;