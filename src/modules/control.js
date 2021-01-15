class Control {
  constructor(parentNode, tagName = 'div', className = '', content = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.innerHTML = content;
    parentNode.appendChild(el);
    this.node = el;
  }

  hide() {
    this.node.style.display = 'none';
  }

  show() {
    this.node.style.display = '';
  }
  setContent(content) {
    this.node.innerHTML = content;
  }

  setClassName(className) {
    this.node.className = className;
  }



}

module.exports = Control;
