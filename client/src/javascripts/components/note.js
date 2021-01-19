import { labelColors } from "./labelColors";
import LabelButton from "./LabelButton";
import Label from "./label";

const labelsArr = [];
const labelsButtons = [];

labelColors.forEach((label) => {
    labelsArr.push(new Label(label.color, 'test').createLabel());
});
labelColors.forEach((label) => {
    labelsButtons.push(new LabelButton(label.color).createButton());
});

const labels = labelsArr.map((label) => {
    return label;
});
const buttons = labelsButtons.map((btn) => {
    return btn;
});

export class Note {
    constructor(id, content, addedBy) {
        this.id = id;
        this.content = content;
        this.addedBy = addedBy;
    }

    render() {
        return `<div class="note" data-id=${this.id} draggable="true">
                    <div class="note__labels">
                      ${labels.join("")}
                    </div>
                    <div class="noteHeader">
                        <div class="noteTitle">
                           <i class="far fa-edit"></i>
                           <span class="noteName">${this.content}</span>
                        </div>
                        <div class="noteRemoveBtn">&times</div>
                    </div>
                    <div class="noteFooter">
                      <span class="added">Added by </span><span>${this.addedBy}</span>
                      <div class="note__icon">
                        <i class="fas fa-pen"></i>
                      </div>
                    </div>
                    <div class="note__menu">
                      <span class="close note__menu-close">&times;</span>
                      <div class="note__menu-container">
                        <button class="button button_save">Save</button>
                        <div class="note__btns">
                          <div class="note__btns_item">
                            <button data-action='label' class="button note__btn">Edit labels</button>
                          </div>
                          <div class="note__btns_item">
                            <button data-action='note-color' class="button note__btn">Note color</button>
                          </div>
                          <div class="note__btns_item">
                            <button data-action='members' class="button note__btn">Change members</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-type="label" class="sub-menu labels-menu">
                      <span class="close labels__menu-close">&times;</span>
                      <div class="sub-menu__title">
                        Labels
                      </div>
                      <div class="labels__menu-content">
                        ${buttons.join("")}
                      </div>
                    </div>

                    <div data-type="note-color" class="sub-menu labels-menu">
                     <span class="close labels__menu-close">&times;</span>
                      <div class="sub-menu__title">
                        Note color
                      </div>
                      <div class="labels__menu-item">
                        <input type="color" id="note-color" name="note-color"
                      value="#e66465">
                      </div>
                    </div>

                    <div data-type="members" class="sub-menu labels-menu">
                     <span class="close labels__menu-close">&times;</span>
                      <div class="sub-menu__title">
                        Members
                      </div>
                      <div class="labels__menu-item">
                        <button class="label-btn">Member 1</button>
                      </div>
                      <div class="labels__menu-item">
                        <button class="label-btn">Member 2</button>
                      </div>
                    </div>
                </div>`;
    }
}
