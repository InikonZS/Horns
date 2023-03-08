import Control from 'common/control';
import TeamIndicator from './teamIndicator';
import TimeIndicator from './timeIndicator';
import WeaponMenu from './weaponMenu';
import ModalWindow from './modalWindow';
import renderer from 'common/renderer';
import SceneManager from '../sceneManager';

class PlayPanel extends Control {
  gameScreenEl: HTMLElement;
  renderer: renderer;
  timeIndicator: TimeIndicator;
  teamIndicator: TeamIndicator;
  pause: Control;
  pauseScreen: ModalWindow;
  weaponButton: Control;
  openWeapon: WeaponMenu;
  weaponScreen: Control;
  fullScreenButton: Control;
  backButton: Control;
  resumeButton: Control;
  windIndicator: Control;

  constructor(parentNode: HTMLElement, sceneManager: SceneManager, gameScreenEl: HTMLElement, renderer: renderer) {
    super(parentNode, 'div', 'gamescreen_wrapper', `
      <div class="gamescreen_top menu"></div>

      <div class="gamescreen_bottom">
        <div id="gclock" class="gamescreen_panel"></div>
        <div id="tm" class="gamescreen_panel"></div>
        <div class="gamescreen_panel gamescreen_wind"></div>
      </div>
    `);
    this.gameScreenEl = gameScreenEl;
    this.renderer = renderer;
    this.timeIndicator = new TimeIndicator(this.node.querySelector('#gclock'));
    this.teamIndicator = new TeamIndicator(this.node.querySelector('#tm'));

    this.pause = new Control(this.node.querySelector('.gamescreen_top'),
      'div', 'gamescreen_pause menu__item',
      `
        <svg class="menu__icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          width="124.5px" height="124.5px" viewBox="0 0 124.5 124.5">
          <g>
            <path d="M116.35,124.5c3.3,0,6-2.699,6-6V6c0-3.3-2.7-6-6-6h-36c-3.3,0-6,2.7-6,6v112.5c0,3.301,2.7,6,6,6H116.35z"/>
            <path d="M44.15,124.5c3.3,0,6-2.699,6-6V6c0-3.3-2.7-6-6-6h-36c-3.3,0-6,2.7-6,6v112.5c0,3.301,2.7,6,6,6H44.15z"/>
          </g>
        </svg>
        <div class="menu__text">Pause</div>
      `);

    this.pause.node.onclick = () => {
      // this.onBack();
      if (this.renderer.isStarted) {
        this.renderer.stop();
      } else {
        this.renderer.start();
      }
      this.pauseScreen.toggle();
    }

    this.weaponButton = new Control(this.node.querySelector('.gamescreen_top'),
      'div', 'gamescreen_weapons menu__item',
      `
        <svg class="menu__icon" width="31.626" height="26.463" version="1.1" viewBox="0 0 31.626 26.464" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(-2.5e-4,-2.582)">
          <path d="m31.123 4.396c-2.739-1.753-5.07-1.404-7.102-0.246-1.777-1.518-3.445-1.568-3.445-1.568l-2.534 2.536c-4.686-2.255-10.472-1.451-14.354 2.432-4.917 4.917-4.917 12.891 0 17.807 4.917 4.918 12.889 4.918 17.806 0 3.885-3.883 4.688-9.67 2.436-14.354l2.535-2.536s-0.035-1.192-0.957-2.633c1.403-0.674 2.792-0.655 4.438 0.4 0.507 0.325 1.184 0.177 1.508-0.331 0.324-0.507 0.18-1.181-0.331-1.507zm-19.409 4.259c-0.247 0.053-6.073 1.345-6.871 6.735-0.088 0.594-0.644 1.008-1.241 0.918-0.24-0.035-0.451-0.146-0.61-0.307-0.236-0.236-0.362-0.577-0.309-0.934 1.023-6.913 8.28-8.487 8.588-8.55 0.591-0.121 1.167 0.259 1.291 0.848 0.12 0.591-0.258 1.167-0.848 1.29zm3.739-0.694c-0.421 0.422-1.107 0.421-1.528 0-0.422-0.422-0.422-1.106 0-1.528 0.421-0.422 1.107-0.421 1.528 0 0.422 0.421 0.422 1.107 0 1.528z"/>
          </g>
        </svg>
        <div class="menu__text">Weapon</div>
      `);
    this.weaponButton.node.onclick = () => {
      this.openWeapon.toggle();
    }
    this.weaponScreen = new Control(this.node, 'div', "weaponscreen_inner", '');
    this.weaponScreen.node.onclick = () => {
      this.openWeapon.close();
    }

    this.openWeapon = new WeaponMenu(this.weaponScreen.node,
      'weaponscreen_wrapper', 'weaponscreen_item weaponscreen_item_active',
      'weaponscreen_item');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Bullets</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Multy</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Grenade</div>');
    this.openWeapon.addButton('<div class="weaponscreen_item_title">Clone</div>');

    this.fullScreenButton = new Control(this.node.querySelector('.gamescreen_top'),
      'div', 'gamescreen_fullscreen menu__item',
      `
        <svg class="menu__icon fullscreen" version="1.1" viewBox="0 0 385 385" xmlns="http://www.w3.org/2000/svg">
          <g id="Fullscreen">
          <path d="m312.94 0h-48.093c-6.833 0-11.922 5.39-11.934 12.223 0 6.821 5.101 11.838 11.934 11.838h47.031c36.718-0.55907 49.394 13.904 47.934 48.26l0.9035 48.26c0 6.833 5.197 12.03 12.03 12.03 6.833-0.012 12.03-5.197 12.03-12.03l0.193-48.369c0.47191-49.599-18.181-71.92-72.029-72.211z"/>
          <g stroke-width="1.0201">
            <path d="m311.36 0h-49.162c-6.9849 0-12.187 5.4871-12.199 12.443 0 6.9439 5.2144 12.051 12.199 12.051h48.076c37.534-0.56914 50.491 14.155 49 49.129l0.92358 49.129c0 6.9562 5.3125 12.247 12.297 12.247 6.9849-0.0122 12.297-5.2907 12.297-12.247l0.19729-49.241c0.4824-50.493-18.585-73.216-73.63-73.512z"/>
            <path d="m73.639 385h49.162c6.9849 0 12.187-5.4871 12.199-12.443 0-6.9439-5.2144-12.051-12.199-12.051h-48.076c-37.534 0.56915-50.491-14.155-49-49.129l-0.92358-49.129c0-6.9562-5.3125-12.247-12.297-12.247-6.9849 0.0122-12.297 5.2907-12.297 12.247l-0.19729 49.241c-0.4824 50.493 18.585 73.216 73.63 73.512z"/>
            <path d="m0 73.639v49.162c0 6.9849 5.4871 12.187 12.443 12.199 6.9439 0 12.051-5.2144 12.051-12.199v-48.076c-0.56914-37.534 14.155-50.491 49.129-49l49.129-0.92358c6.9562 0 12.247-5.3125 12.247-12.297-0.0122-6.9849-5.2907-12.297-12.247-12.297l-49.241-0.19729c-50.493-0.4824-73.216 18.585-73.512 73.63z"/>
            <path d="m385 311.36v-49.162c0-6.9849-5.4871-12.187-12.443-12.199-6.9439 0-12.051 5.2144-12.051 12.199v48.076c0.56915 37.534-14.155 50.491-49.129 49l-49.129 0.92358c-6.9562 0-12.247 5.3125-12.247 12.297 0.0122 6.9849 5.2907 12.297 12.247 12.297l49.241 0.19729c50.493 0.4824 73.216-18.585 73.512-73.63z"/>
          </g>
          </g>
        </svg>
        <svg class="menu__icon fullscreen-out" style="display:none" version="1.1" viewBox="0 0 385 385" xmlns="http://www.w3.org/2000/svg">
          <g id="Fullscreen" stroke-width="1.0201">
            <path d="m303.64 155h49.162c6.9849 0 12.187-5.4871 12.199-12.443 0-6.9439-5.2144-12.051-12.199-12.051h-48.076c-37.534 0.56915-50.491-14.155-49-49.129l-0.92358-49.129c0-6.9562-5.3125-12.247-12.297-12.247-6.9849 0.0122-12.297 5.2907-12.297 12.247l-0.19729 49.241c-0.4824 50.493 18.585 73.216 73.63 73.512z"/>
            <path d="m81.361 230h-49.162c-6.9849 0-12.187 5.4871-12.199 12.443 0 6.9439 5.2144 12.051 12.199 12.051h48.076c37.534-0.56915 50.491 14.155 49 49.129l0.92358 49.129c0 6.9562 5.3125 12.247 12.297 12.247 6.9849-0.0122 12.297-5.2907 12.297-12.247l0.19729-49.241c0.4824-50.493-18.585-73.216-73.63-73.512z"/>
            <path d="m155 81.361v-49.162c0-6.9849-5.4871-12.187-12.443-12.199-6.9439 0-12.051 5.2144-12.051 12.199v48.076c0.56914 37.534-14.155 50.491-49.129 49l-49.129 0.92358c-6.9562 0-12.247 5.3125-12.247 12.297 0.0122 6.9849 5.2907 12.297 12.247 12.297l49.241 0.19729c50.493 0.4824 73.216-18.585 73.512-73.63z"/>
            <path d="m230 303.64v49.162c0 6.9849 5.4871 12.187 12.443 12.199 6.9439 0 12.051-5.2144 12.051-12.199v-48.076c-0.56915-37.534 14.155-50.491 49.129-49l49.129-0.92358c6.9562 0 12.247-5.3125 12.247-12.297-0.0122-6.9849-5.2907-12.297-12.247-12.297l-49.241-0.19729c-50.493-0.4824-73.216 18.585-73.512 73.63z"/>
          </g>
        </svg>
        <div class="menu__text">Fullscreen</div>
      `);
    const fullscreen: HTMLButtonElement = this.fullScreenButton.node.querySelector('.fullscreen');
    const fullscreenOut: HTMLButtonElement = this.fullScreenButton.node.querySelector('.fullscreen-out');
    this.fullScreenButton.node.onclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        fullscreenOut.style.display = 'none';
        fullscreen.style.display = '';
      } else {
        this.gameScreenEl.requestFullscreen();
        fullscreen.style.display = 'none';
        fullscreenOut.style.display = '';
      }
    }

    this.pause.node.onclick = () => {
      if (this.renderer.isStarted) {
        this.renderer.stop();
      } else {
        this.renderer.start();
      }
      this.pauseScreen.toggle(this.teamIndicator);
    }
    this.pauseScreen = new ModalWindow(this.node, "pausescreen_inner", 'Teams Health');
    this.pauseScreen.node.addEventListener( 'click', (e) => {
      this.renderer.start();
    });
    this.backButton = new Control(this.pauseScreen.footer.node, 'div', 'load_button', 'Back');
    this.backButton.node.onclick = () => {
      this.pauseScreen.close();
      this.onBack();
    };
    this.resumeButton = new Control(this.pauseScreen.footer.node, 'div', 'load_button', 'Resume');
    this.resumeButton.node.onclick = () => {
      this.pauseScreen.close();
      this.renderer.start();
    };
    this.windIndicator = new Control(this.node.querySelector('.gamescreen_wind'),
      'div', 'wind-indicator', '0');
  }
  onBack() {
    throw new Error('Method not implemented.');
  }
}


export default PlayPanel;