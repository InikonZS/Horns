const Control = require('common/control.js');
const Vector = require('../modules/vector');

class EditorScreen extends Control {
  constructor(parentNode, sceneManager) {
    super(
      parentNode,
      'div',
      'gamescreen_wrapper_centred editor',
      'editor screen',
    );
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.style.width = '80%';
    this.canvas.node.style.height = '80%';
    this.context = this.canvas.node.getContext('2d');
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height,
    );
    this.context.lineWidth = 30;
    this.context.strokeStyle = '#cc3';
    this.context.lineCap = 'round';

    this.isMouseDown = false;
    this.mousePos = new Vector(-1, -1);
    this.mousePrevPos = new Vector(-1, -1);

    this.backButton = new Control(this.node, 'div', 'load_button', 'back');
    this.backButton.node.onclick = () => {
      sceneManager.back(); //selectByName('mainMenu');
    };

    this.saveButton = new Control(this.node, 'div', 'load_button', 'save');
    this.saveButton.node.onclick = () => {
      
    };

    this.canvas.node.onmousedown = (e) => {
      this.isMouseDown = true;
      this.mousePrevPos.x = e.clientX - this.canvas.node.offsetLeft;
      this.mousePrevPos.y = e.clientY - this.canvas.node.offsetTop - this.node.offsetTop;
      console.log(this.mousePrevPos, this.node.offsetTop);
    };
    this.canvas.node.onmouseup = (e) => {
      this.isMouseDown = false;
      this.mousePrevPos = new Vector(-1, -1);
    };
    this.canvas.node.onmousemove = (e) => {
      if (this.isMouseDown) {
        this.mousePos.x = e.clientX - this.canvas.node.offsetLeft;
        this.mousePos.y = e.clientY - this.canvas.node.offsetTop - this.node.offsetTop;
        this.context.moveTo(this.mousePrevPos.x, this.mousePrevPos.y);
        this.context.lineTo(this.mousePos.x, this.mousePos.y);
        this.context.stroke();
        this.mousePrevPos.from(this.mousePos);
      }
    };
  }
}

module.exports = EditorScreen;
