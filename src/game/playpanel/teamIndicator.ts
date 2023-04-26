import Control from 'common/control';
import TeamList from '../core/teamList';
import TeamIndicatorItem from './teamIndicatorItem';

class TeamIndicator extends Control {
  private teams: TeamIndicatorItem[];
  private allHealth: number;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'teams_wrapper', '');
    this.teams = [];
  }

  public update(teams: TeamList){
    this.setTeamValues(teams);
    this.getTeamIndicatorItems(teams).forEach(it => {
      it.teamAvatar.render();
    });
  }

  private getTeamIndicatorItems(teams: TeamList) {
    let list: TeamIndicatorItem[] = [];
    teams.list.forEach((it, i) => {
      let tm = this.teams.find(jt => jt.name == it.name);
      list.push(tm);
    });
    return list;
  }

  private setTeamValues(teams: TeamList){
    let allHealth = teams.getSumHealth();
    if (this.allHealth != allHealth) {
      this.allHealth = allHealth;
      teams.list.forEach((it, i) => {
        let tm = this.teams.find(jt => jt.name == it.name);
        tm.setHealth(100 * it.getSumHealth() / allHealth, '' + it.getSumHealth() + '&nbsp;/&nbsp;' + allHealth);
      });
    }
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