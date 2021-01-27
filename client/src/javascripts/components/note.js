import {$, getFetch} from "../utils";
import {stringToColor, usersAdded} from "../main";

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
    const $dataset = document.createAttribute('data-id');
    const $draggable = document.createAttribute('draggable');
    $noteDiv.className = 'note';
    $dataset.value = this.id;
    $draggable.value = 'true';
    $noteDiv.setAttributeNode($dataset);
    $noteDiv.setAttributeNode($draggable);
    $noteDiv.innerHTML = `
                    <div class="noteHeader">
                        <div class="noteTitle"><i class="far fa-edit"></i><span class="noteName">${this.content}</span></div>
                        <div class="noteAddMemberBtn" title="Add Member">+</div>
                        <div class="noteRemoveBtn" title="Remove note">&times</div>
                    </div>
                    <div class="noteFooter">
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
