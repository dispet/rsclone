export default class Label {
  constructor(color, title) {
    this.labelColor = color || "#000";
    this.labelTitle = title || "";
  }

  createLabel() {
    return `<span data-color="${this.labelColor}" class="label" style="background:${this.labelColor};" title="${this.labelTitle}"></span>`;
  }
}
