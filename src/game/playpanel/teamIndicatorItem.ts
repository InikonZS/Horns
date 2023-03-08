import Control from 'common/control.js';
import TeamIndicatorProgress from './teamProgress';

class TeamIndicatorItem extends Control {
  name: string;
  teamName: Control;
  teamHealth: Control;
  teamAvatar: TeamIndicatorProgress;

  constructor(parentNode: HTMLElement, data: { name: string; avatar: string; color: string; }) {
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

  setHealth(health: number, absHealth: string){
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

export default TeamIndicatorItem;