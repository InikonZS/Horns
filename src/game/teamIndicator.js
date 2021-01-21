const Control = require('common/control.js');

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
    this.image = new Image();
    this.image.src = this.options.src;
    this.render();
  }

  drawCircle(color, part = 1) {
    this.ctx.beginPath();
    this.ctx.arc(this.center, this.center, this.radius,
            -(Math.PI * 0.5), (Math.PI * 2) * part - Math.PI * 0.5, false);
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.options.lineWidth
    this.ctx.stroke();
  }

  drawAvatar() {
    console.log('aaa');
    this.image.onload = () => {
      console.log('yes');
      this.ctx.beginPath();
      this.ctx.arc(this.center, this.center, this.radius - this.options.lineWidth,
        0, Math.PI * 2, false);
      this.ctx.clip();
      console.log(this.image.naturalWidth);
      this.ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight,
      this.options.lineWidth * 2, this.options.lineWidth * 2,
      this.options.size - this.options.lineWidth * 4,
      this.options.size - this.options.lineWidth * 4);
    }
    console.log('bbb');

  }

  render() {
    this.ctx.clearRect(0, 0, this.options.size, this.options.size);
    this.ctx.save();
    this.drawAvatar(this.options.src);
    this.ctx.restore();
    this.drawCircle('rgba(255, 255, 255, 0.3)');
    this.drawCircle('#40d04f', this.options.part);

    // if (this.options.decrease) {
    //   if (this.options.part > this.options.nextPart) {
    //     this.options.part *= 0.98;
    //     window.requestAnimationFrame(this.render);
    //   }
    // } else {
    //   if (this.options.part < this.options.nextPart) {
    //     this.options.part *= 1.02
    //     window.requestAnimationFrame(this.render);
    //   }
    // }
  }

  updateProgressBar() {
    const scaler = this.options.decrease ? 0.98 : 1.02;
    this.options.part *= scaler;
  }

  setProgressOptions() {
    this.render();
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