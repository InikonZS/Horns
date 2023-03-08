import Control from 'common/control';
import TeamIndicatorItem from './teamIndicatorItem';

class TeamIndicator extends Control {
  teams: TeamIndicatorItem[];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'teams_wrapper', '');
    this.teams = [];
  }

  addTeam(data: { name: string; avatar: string; color: string; }) {
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

export default TeamIndicator;