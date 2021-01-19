const Control = require('common/control.js');

class TeamIndicatorItem extends Control {
  constructor(parentNode, data) {
    super(parentNode, 'div', 'teams_item', '');
    this.name = data.name;
    let infoBlock = new Control(this.node, 'div', "team_block team_info");
    this.teamName = new Control(infoBlock.node, 'div', "team_name-text", data.name);
    this.teamHealth = new Control(infoBlock.node, 'div', "team_health-value");
    this.teamAvatar = new Control(this.node, 'div', "team_block team_avatar", data.avatar);
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

// options {part, nextPart, size, lineWidth, decrease = true, src}
class TeamIndicatorProgress extends Control {
  constructor(parentNode, options) {
    super(parentNode, 'canvas', 'team_progress-avatar', '');
    this.options = options;
    this.ctx = this.node.getContext('2d');
    this.node.width = this.node.height = this.options.size;
    this.radius = Math.trunc(this.options.size / 2 - this.options.lineWidth);
    this.center = this.options.size / 2;
  }

  drawCircle(color, part = 1) {
    this.ctx.beginPath();
    this.ctx.arc(this.center, this.this.center, radius,
            -(Math.PI * 0.5), (Math.PI * 2) * part - Math.PI * 0.5, false);
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = 'round'; // butt, round or square
    this.ctx.lineWidth = this.options.lineWidth
    this.ctx.stroke();
  }

  drawAvatar(src) {
    const image = new Image();
    image.src = src;
    this.ctx.beginPath();
    this.ctx.arc(this.center, this.center, this.radius - this.options.lineWidth,
      0, Math.PI * 2, false);
    this.ctx.clip();
    this.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight,
      this.options.lineWidth * 2, this.options.lineWidth * 2,
      this.options.size - this.options.lineWidth * 4,
      this.options.size - this.options.lineWidth * 4);
  }

  updateProgressBar() {
    const scaler = this.options.decrease ? 0.98 : 1.02;
    this.options.part *= scaler
  }

  setProgressOptions() {
    
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