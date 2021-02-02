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

export class Note {
  constructor(id, content, addedBy, members, label, background, color) {
    this.id = id;
    this.content = content;
    this.addedBy = addedBy;
    this.members = members;
    this.label = label;
    this.background = background;
    this.color = color;
  }

  render() {
    const members = this.members ? this.members.split(',') : [];
    const $noteDiv = document.createElement('div');
    // const $noteLabels = document.createElement('div');
    // $noteLabels.className = 'note__labels';
    // $noteLabels.innerHTML = labels.join("");
    const $dataset = document.createAttribute('data-id');
    const $draggable = document.createAttribute('draggable');
    $noteDiv.className = 'note card';
    $noteDiv.style.backgroundColor = this.background;
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
<!--                        <div class="noteAddMemberBtn" title="Add Member">+</div>-->
                        <div class="noteRemoveBtn" title="Remove note">&times</div>
                    </div>
                    <div class="noteFooter"></div>
                    <div class="note__bottom">
                      <div class="note__icon">
                        <i class="fas fa-cog"></i>
                      </div>
                      <div class="note__menu">
                        <span class="close note__menu-close">&times;</span>
                        <div class="note__menu-container">
                          <div class="note__btns">
                            <div class="note__btns_item">
                              <button data-action='label' data-translate='editLabels' class="btn button note__btn">Edit labels</button>
                            </div>
                            <div class="note__btns_item">
                              <button data-action='note-color' data-translate='editColor' class="btn button note__btn">Note color</button>
                            </div>
                            <div class="note__btns_item">
                            <button data-action='members' data-translate='changeMembers' class="btn button note__btn">Change members</button>
                          </div>
                          </div>
                        </div>
                      </div>
                      <div data-type="label" class="sub-menu labels-menu">
                        <span class="close labels__menu-close">&times;</span>
                        <div data-translate="labelTitle" class="sub-menu__title">
                          Labels
                        </div>
                        <div class="labels__menu-content">
                          ${buttons.join("")}
                        </div>
                      </div>
                      <div data-type="note-color" class="sub-menu labels-menu">
                      <span class="close labels__menu-close">&times;</span>
                        <div data-translate="noteColor" class="sub-menu__title">
                          Note color
                        </div>
                        <div class="labels__menu-item">
                        <label data-translate="noteBackground" for="note-background">Background</label>
                          <input type="color" id="note-background" name="note-background"
                        value="#e66465">
                        <label for="note-color" data-translate="noteLabelColor">color</label>
                          <input type="color" id="note-color" name="note-color"
                        value="#e66465">
                        </div>
                      </div>
                      <div data-type="members" class="sub-menu members-menu">
                       <span class="close labels__menu-close">&times;</span>
                       <div class="sub-menu__title" data-translate="membersTitle">
                        Members
                       </div>
                     </div>
                    </div>`
    const btnWrapper = $noteDiv.querySelector(".labels__menu-content");
    const labelsWrapper = $noteDiv.querySelector(".note__labels");
    const label =  labelsWrapper.querySelectorAll('.label')
    const btn = btnWrapper.querySelectorAll('.label-btn')
    $noteDiv.querySelector(".noteHeader").style.color = this.color;
    const local = this.label
      // localStorage[key]
    label.forEach((el,i) =>{
      if (+local & (1 << i)) {
        el.classList.toggle("active");
        btn[i].classList.toggle("active");
      }
    })
    const $noteFooter = $('.noteFooter', $noteDiv);
    const $membersMenu = $('.members-menu', $noteDiv);

    usersAdded.forEach((el)=>{
      const $elementMembersMenuItem = document.createElement('div');
      const $elementMemberBtn = document.createElement('button');
      $elementMembersMenuItem.className = 'members__menu-item';

      const user = usersAdded.filter(item => item.id === +el.id)[0];
      const $elementAvatar = document.createElement('div');

      const $idset = document.createAttribute('id');
      const $idsetBtn = document.createAttribute('id');
      const $title = document.createAttribute('title');

      $elementMemberBtn.className = 'member-btn';
      $elementAvatar.className = 'user-info-avatar';

      if (members.includes(el.id.toString())){
        $elementMemberBtn.classList.toggle('active')
        $elementAvatar.classList.toggle('active')
      }

      $idset.value = user.id;
      $idsetBtn.value = user.id;
      $title.value = 'avatar';
      $elementAvatar.setAttributeNode($idset);
      $elementAvatar.setAttributeNode($title);
      $elementMemberBtn.setAttributeNode($idsetBtn);

      const name = user.name.toUpperCase();
      const letter = name.substr(0, 2);
      const backgroundColor = stringToColor(name);
      $elementAvatar.innerHTML = letter;
      $elementAvatar.style.backgroundColor = backgroundColor;
      $elementAvatar.title = `${user.name} ${user.email}`;
      $noteFooter.innerHTML += $elementAvatar.outerHTML;
      $elementMemberBtn.innerHTML = el.name;
      $elementMembersMenuItem.innerHTML += $elementMemberBtn.outerHTML;
      $membersMenu.innerHTML += $elementMembersMenuItem.outerHTML;
    })
    return $noteDiv.outerHTML;
  }
}
