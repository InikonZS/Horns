const Control = require('common/control.js');

class AboutPage extends Control {
  constructor(parentNode, config) {
    super(parentNode, 'div', 'gamescreen_wrapper');
    new Control(this.node, 'div', 'about_wrapper', `<div class="about_title">Game control</div>
    <div class="about_content"> You can move using the <kbd>A</kbd> and <kbd>D</kbd> keys</div>
    <div class="about_content">To jump press <kbd>W</kbd></div>
    <div class="about_content"> Use the <kbd>Q</kbd> and <kbd>E</kbd> keys to move the scope </div>
    <div class="about_content">The choice of weapons is made using the digital panel(1-6)</div>
    <div class="about_content description_camera_control">
        Use the arrow keys to move the game camera <kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd>
        <kbd>&rarr;</kbd>
    </div>
</div>`)
  }
}

module.exports = AboutPage;