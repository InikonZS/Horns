import Control from 'common/control.js';
import { createNodes } from '../../modules/utils';

const timeIndicatorNodes = {
  timeLeft:{tag: 'div', class: 'clock-next__time-left'},
  progressBar:{tag: 'div', class: 'clock-next__progress-bar'},
  progressBarShadow:{tag: 'div', class: 'clock-next__progress-bar clock-next__progress-bar_shadow'},
};

class TimeIndicator extends Control {
  constructor(parentNode) {
    super(parentNode, 'div', 'gamescreen__clock clock-next', '');
    createNodes(this, timeIndicatorNodes, Control);
    this.timerDuration = 0;
  }

  setTimerDuration(timerSpan) {
    this.timerDuration = timerSpan;
    this.setProgressBaroffset(timerSpan);
  }

  setProgressBaroffset(timerSpan) {
    if (timerSpan < 100) {
      this.progressBar.node.style.left = '45px';
      this.progressBarShadow.node.style.left = '45px';
    } else {
      this.progressBar.node.style.left = '60px';
      this.progressBarShadow.node.style.left = '60px';
    }
  }

  update(count){
    this.timeLeft.node.textContent = count;
    const progressBarWidth = (count / this.timerDuration) * 80;
    this.progressBar.node.style.width = `${progressBarWidth}%`;
  }
}

export default TimeIndicator;