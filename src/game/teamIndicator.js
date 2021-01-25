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
      part: 0.8,
      nextPart: 0.3,
      size: 90,
      lineWidth: 8,
      decrease: true,
      src: './assets/maria-bo-schatzis-stream-profilpicture.jpg',
      }
    this.teamAvatar = new TeamIndicatorProgress(this.node, options);
    this.setHealth(100);
    console.log(data);
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