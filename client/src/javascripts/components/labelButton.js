export default class LabelButton {
  constructor(color) {
      this.labelColor = color || "#000";
  }

  createButton() {
      return `
      <div class="labels__menu-item">
        <button data-hex="${this.labelColor}" class="label-btn" style="background: ${this.labelColor}"></button>
      </div>`;
  }
}
