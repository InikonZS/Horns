class Control<T extends HTMLElement = HTMLElement> {
  public node: T;

  constructor(parentNode: HTMLElement | null, tagName = 'div', className = '', content = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.innerHTML = content;
    if (parentNode) {
      parentNode.append(el);
    }
    this.node = el as T;
  }

  destroy(){
    this.node.remove();
  }

  hide() {
    this.node.style.display = 'none';
  }

  show() {
    this.node.style.display = '';
  }

  setContent(content: string) {
    this.node.innerHTML = content;
  }

  setClassName(className: string) {
    this.node.className = className;
  }

  isHidden() {
    return this.node.style.display === 'none';
  }
}

export default Control;
