import Control from 'common/control';

// options {part, nextPart, size, lineWidth, decrease = true, src, color}
interface ITeamIndicatorOptions {
  part: number; 
  nextPart: number; 
  size: number; 
  lineWidth: number; 
  decrease: boolean; 
  src: string; 
  color: string; 
}
class TeamIndicatorProgress extends Control {
  radius: number;
  options: ITeamIndicatorOptions;
  ctx: CanvasRenderingContext2D;
  center: number;
  image: HTMLImageElement;

  constructor(parentNode: HTMLElement, options: ITeamIndicatorOptions) {
    super(parentNode, 'canvas', 'team_progress-avatar', '');
    this.options = options;
    this.ctx = this.node.getContext('2d');
    this.node.width = this.node.height = this.options.size;
    this.radius = Math.trunc(this.options.size / 2 - this.options.lineWidth);
    this.center = this.options.size / 2;
    this.image = new Image();
    this.image.src = this.options.src;
    this.image.onload = () => {
      this.render();
    };
  }

  drawCircle(color: string, part = 1) {
    this.ctx.beginPath();
    this.ctx.arc(this.center, this.center, this.radius,
            -(Math.PI * 0.5), (Math.PI * 2) * part - Math.PI * 0.5, false);
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.options.lineWidth
    this.ctx.stroke();
  }

  drawAvatar() {
    this.ctx.beginPath();
    this.ctx.arc(this.center, this.center, this.radius - this.options.lineWidth,
      0, Math.PI * 2, false);
    this.ctx.clip();
    this.ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight,
    this.options.lineWidth * 2, this.options.lineWidth * 2,
    this.options.size - this.options.lineWidth * 4,
    this.options.size - this.options.lineWidth * 4);
  }

  render() {
    this.ctx.clearRect(0, 0, this.options.size, this.options.size);
    this.ctx.save();
    try{
      this.drawAvatar();
    } catch(e){
      
    }
    this.ctx.restore();
    this.drawCircle('rgba(255, 255, 255, 0.3)');
    this.drawCircle(this.options.color, this.options.part);

    if (this.options.decrease) {
      if (this.options.part > this.options.nextPart) {
        this.updateProgressBar();
      }
    } else {
      if (this.options.part < this.options.nextPart) {
        this.updateProgressBar();
      }
    }
  }

  updateProgressBar() {
    const scaler = this.options.decrease ? 0.98 : 1.02;
    this.options.part *= scaler;
  }

  setProgressOptions(health: number) {
    this.options.nextPart = health / 100;
  }
}

export default TeamIndicatorProgress;