const Control = require('common/control.js');
const TeamIndicatorProgress = require('./teamProgress');

class TeamIndicatorItem extends Control {
  constructor(parentNode, data) {
    super(parentNode, 'div', 'teams_item', '');
    this.name = data.name;
    let infoBlock = new Control(this.node, 'div', "team_block team_info");
    this.teamName = new Control(infoBlock.node, 'div', "team_name-text", data.name);
    this.teamHealth = new Control(infoBlock.node, 'div', "team_health-value");
    const options = {
      part: 1,
      nextPart: 1,
      size: 80,
      lineWidth: 8,
      decrease: true,
      src: data.avatar,
      color: data.color,
    }
    this.teamAvatar = new TeamIndicatorProgress(this.node, options);
    this.node.style['border-color'] = data.color;
  }

  setHealth(health, absHealth){
    if (health == 0){
      this.hide();
    }
    this.teamHealth.node.innerHTML = absHealth;
    this.teamAvatar.setProgressOptions(health);
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