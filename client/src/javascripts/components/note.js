import {$, getFetch} from "../utils";
import {stringToColor, usersAdded} from "../main";

// labels
import { labelColors } from "./labelColors";
import LabelButton from "./LabelButton";
import Label from "./label";

const labelsArr = [];
const labelsButtons = [];

labelColors.forEach((label) => {
    labelsArr.push(new Label(label.color, "test").createLabel());
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
// labels

export class Note {
  constructor(id, content, addedBy, members) {
    this.id = id;
    this.content = content;
    this.addedBy = addedBy;
    this.members = members;
  }

  render() {
    const members = this.members ? this.members.split(',') : [];
    const $noteDiv = document.createElement('div');
    const $noteLabels = document.createElement('div');
    $noteLabels.className = 'note__labels';
    $noteLabels.innerHTML = labels.join("");
    const $dataset = document.createAttribute('data-id');
    const $draggable = document.createAttribute('draggable');
    $noteDiv.className = 'note';
    $dataset.value = this.id;
    $draggable.value = 'true';
    $noteDiv.setAttributeNode($dataset);
    $noteDiv.setAttributeNode($draggable);
    $noteDiv.innerHTML = `
                    <div class="note__labels">
                      ${labels.join("")}
                    </div>
                    <div class="noteHeader">
                        <div class="noteTitle"><i class="far fa-edit"></i><span class="noteName">${this.content}</span></div>
                        <div class="noteAddMemberBtn" title="Add Member">+</div>
                        <div class="noteRemoveBtn" title="Remove note">&times</div>
                    </div>
                    <div class="noteFooter"></div>

                    <div class="note__bottom">
                      <div class="note__icon">
                          <i class="fas fa-pen"></i>
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
                        <label for="note-background">Background</label>
                          <input type="color" id="note-background" name="note-background"
                        value="#e66465">
                        <label for="note-background">color</label>
                          <input type="color" id="note-color" name="note-color"
                        value="#e66465">
                        </div>
                      </div>
                      </div>`
    const $noteFooter = $('.noteFooter', $noteDiv);
    members.forEach(el => {
      const user = usersAdded.filter(item => item.id === +el)[0];
      const $elementAvatar = document.createElement('div');
      const $idset = document.createAttribute('id');
      const $title = document.createAttribute('title');
      $elementAvatar.className = 'user-info-avatar';
      $idset.value = user.id;
      $title.value = 'avatar';
      $elementAvatar.setAttributeNode($idset);
      $elementAvatar.setAttributeNode($title);

      const name = user.name.toUpperCase();
      const letter = name.substr(0, 2);
      const backgroundColor = stringToColor(name);
      $elementAvatar.innerHTML = letter;
      $elementAvatar.style.backgroundColor = backgroundColor;
      $elementAvatar.title = `${user.name} ${user.email}`;
      $noteFooter.innerHTML += $elementAvatar.outerHTML;
    });
    return $noteDiv.outerHTML;
  }
}
