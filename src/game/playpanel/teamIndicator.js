const Control = require('common/control.js');
const TeamIndicatorItem = require('./teamIndicatorItem');

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