const Control = require('common/control.js');
const Vector = require('../modules/vector');

class EditorScreen extends Control {
  constructor(parentNode, sceneManager) {
    super(
      parentNode,
      'div',
      'gamescreen_wrapper_centred editor',
      '',
    );

    this.canvasWrapper = new Control(this.node, 'div', 'editor_canvas');
    this.canvas = new Control(this.canvasWrapper.node, 'canvas');
    this.autoSize();

    this.brushColor = '#000';
    let toolsInner = new Control(this.node, 'div', "editor_tools_inner");
    this.brushButton = new Control(toolsInner.node, 'div', 'editor_brush editor_tools_btn', 'Кисть');
    this.brushSize = new Control(toolsInner.node, 'input', 'editor_brush_size editor_tools_btn ', '30');
    this.brushSize.node.setAttribute("placeholder", "Размер кисти");
    this.eraserButton = new Control(toolsInner.node, 'div', 'editor_eraser editor_tools_btn', 'Ластик');
    this.cleanButton = new Control(toolsInner.node, 'div', 'editor_clean editor_tools_btn', 'Стереть все');

    this.context = this.canvas.node.getContext('2d');
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height,
    );
    this.context.lineWidth = 20;
    this.context.strokeStyle = '#cc3';
    this.context.lineCap = 'round';

    let isMouseDown = false;
    //this.mousePos = new Vector(-1, -1);
    this.mousePrevPos = new Vector(-1, -1);

    this.brushButton.node.onclick = () => {
      this.brushColor = '#000';
    }

    this.brushSize.node.onchange = () => {
      this.context.lineWidth = this.brushSize.node.value;
    }

    this.eraserButton.node.onclick = () => {
      this.brushColor = '#fff';
    }


    this.cleanButton.node.onclick = () => {
      this.autoSize();
      this.context.fillStyle = '#ffffff';
      this.context.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height,
      );
    }

    this.saveButton = new Control(toolsInner.node, 'div', 'return_btn', 'save');
    this.saveButton.node.onclick = () => {
      this.onSave && this.onSave(this.canvas.node.toDataURL());
      sceneManager.back();
    };

    this.backButton = new Control(toolsInner.node, 'div', 'return_btn', 'back');
    this.backButton.node.onclick = () => {
      sceneManager.back(); //selectByName('mainMenu');
    };


    const getCursorVector = (event) => {
      return new Vector(
        event.layerX - this.canvas.node.offsetLeft,
        event.layerY - this.canvas.node.offsetTop
      ).scale(this.canvas.node.width / this.canvasWrapper.node.clientWidth);
    }

    this.canvas.node.onmousedown = (e) => {
      isMouseDown = true;
      this.mousePrevPos.from(getCursorVector(e));//.x = e.layerX - this.canvas.node.offsetLeft;
      //this.mousePrevPos.y = e.layerY - this.canvas.node.offsetTop;// - this.node.offsetTop;
      //console.log(this.mousePrevPos, this.node.offsetTop);
    };
    this.canvas.node.onmouseup = (e) => {
      isMouseDown = false;
      this.mousePrevPos = new Vector(-1, -1);
    };
    this.canvas.node.onmousemove = (e) => {
      if (isMouseDown) {
        //console.log('fd');
        let mousePos = getCursorVector(e);//.x = e.clientX - this.canvas.node.offsetLeft;
        //this.mousePos.y = e.clientY - this.canvas.node.offsetTop - this.node.offsetTop;
        this.context.strokeStyle = this.brushColor;
        this.context.moveTo(this.mousePrevPos.x, this.mousePrevPos.y);
        this.context.lineTo(mousePos.x, mousePos.y);
        this.context.stroke();
        this.mousePrevPos.from(mousePos);
      }
    };
  }

  autoSize() {
    let scaler = 1;
    this.canvas.node.height = 400;//this.canvasWrapper.node.clientHeight/scaler;
    this.canvas.node.width = 1000;//this.canvasWrapper.node.offsetWidth/scaler;
    this.canvas.node.style.width = '100%';
    //this.canvas.node.style.height = '100%';
  }
}

module.exports = EditorScreen;
