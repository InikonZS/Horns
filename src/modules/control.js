class Control {
  constructor(parentNode, tagName = 'div', className = '', content = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.innerHTML = content;
    parentNode.appendChild(el);
    this.node = el;
  }
}

module.exports = Control;
