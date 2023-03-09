import Control from 'common/control';

import Vector from '../modules/vector';
import SceneManager from './sceneManager';

class EditorScreen extends Control {
  canvasWrapper: Control;
  canvas: Control<HTMLCanvasElement>;
  brushColor: string;
  brushButton: Control;
  brushSize: Control<HTMLInputElement>;
  eraserButton: Control;
  cleanButton: Control;
  context: CanvasRenderingContext2D;
  mousePrevPos: Vector;
  saveButton: Control;
  onSave: (dataURL: string)=>void;
  backButton: Control;
  constructor(parentNode: HTMLElement, sceneManager: SceneManager) {
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
    this.brushButton = new Control(toolsInner.node, 'div', 'editor_brush editor_tools_btn', 'Brush');
    let brushSizeInner = new Control(toolsInner.node, 'div', 'brush_size_inner', '<div>Brush size</div>');
    this.brushSize = new Control(brushSizeInner.node, 'input', 'switcher_brush_size ');
    this.brushSize.node.setAttribute('type', 'range');
    this.brushSize.node.setAttribute('min', '30');
    this.brushSize.node.setAttribute('max', '100');

    // this.brushColor = new Control(brushSizeInner.node, 'input', 'switcher_brush_color');
    // this.brushColor.node.setAttribute('type', 'color');
    // this.brushColor.node.setAttribute('value', '#f63444');


    this.eraserButton = new Control(toolsInner.node, 'div', 'editor_eraser editor_tools_btn', 'Eraser');
    this.cleanButton = new Control(toolsInner.node, 'div', 'editor_clean editor_tools_btn', 'Clean');

    this.context = this.canvas.node.getContext('2d');
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height,
    );
    this.context.lineWidth = 50;
    this.context.strokeStyle = '#000';
    this.context.lineCap = 'round';

    let isMouseDown = false;
    this.mousePrevPos = new Vector(-1, -1);

    this.brushButton.node.onclick = () => {
      this.context.beginPath();
      this.context.strokeStyle = '#000';//this.brushColor.node.value;
    }

    this.brushSize.node.onchange = () => {
      this.context.beginPath();
      this.context.lineWidth = Number(this.brushSize.node.value);
    }

    // this.brushColor.node.onchange = () => {
    //   this.context.beginPath();
    //   this.context.strokeStyle = this.brushColor.node.value;
    // }

    this.eraserButton.node.onclick = () => {
      this.context.beginPath();
      this.context.strokeStyle = '#fff';
    }

    this.cleanButton.node.onclick = () => {
      this.context.beginPath();
      this.context.clearRect(0, 0, this.canvas.node.width, this.canvas.node.height);
      this.context.fillStyle = '#ffffff';
      this.context.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height);
    }

    this.saveButton = new Control(toolsInner.node, 'div', 'editor_tools_btn return_btn', 'Save');
    this.saveButton.node.onclick = () => {
      this.onSave && this.onSave(this.canvas.node.toDataURL());
      sceneManager.back();
    };

    this.backButton = new Control(toolsInner.node, 'div', 'editor_tools_btn return_btn', 'Back');
    this.backButton.node.onclick = () => {
      sceneManager.back(); //selectByName('mainMenu');
    };

    const getCursorVector = (event: MouseEvent) => {
      return new Vector(
        //event.layerX - this.canvas.node.offsetLeft,
        //event.layerY - this.canvas.node.offsetTop
        event.clientX - this.canvas.node.offsetLeft,
        event.clientY - this.canvas.node.offsetTop
      ).scale(this.canvas.node.width / this.canvasWrapper.node.clientWidth);
    }

    this.canvas.node.onmousedown = (e) => {
      isMouseDown = true;
      this.mousePrevPos.from(getCursorVector(e));
    };
    this.canvas.node.onmouseup = (e) => {
      isMouseDown = false;
      this.mousePrevPos = new Vector(-1, -1);
    };
    this.canvas.node.onmousemove = (e) => {
      if (isMouseDown) {
        let mousePos = getCursorVector(e);
        // this.context.strokeStyle = this.brushColor;
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
  }
}

export default EditorScreen;
