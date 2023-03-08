import Control from 'common/control.js';
import { IPage } from '../IPage';

class AboutPage extends Control implements IPage {
  constructor(parentNode:HTMLElement, config?:any) {
    super(parentNode, 'div', 'gamescreen_wrapper about');
    new Control(this.node, 'div', 'about_wrapper', `
    <div class="about_item">
      <div class="about_title">Game control</div>
      <div class="about_content"> You can move player using the <kbd>A</kbd> and <kbd>D</kbd> keys</div>
      <div class="about_content">To jump press <kbd>W</kbd></div>
      <div class="about_content"> Use the <kbd>Q</kbd> and <kbd>E</kbd> keys to move the target to shot </div>
      <div class="about_content">The choice of weapons is made modal window</div>
      <div class="about_content description_camera_control">
          Use the arrow keys to move the game camera<br> <kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd>
          <kbd>&rarr;</kbd>
      </div>
      </div>
    </div>
    <div class="about_item">
      <div class="about_title">Settings</div>
      <ul>
        <li class="about_content"> There are settings available to set up on the settings page:</li>
        <li class="about_content">Teams count</li>
        <li class="about_content">Players count</li>
        <li class="about_content">Team as a computer</li>
        <li class="about_content">Team health</li>
      </ul>
    </div>
    `)
  }
}

export default AboutPage;