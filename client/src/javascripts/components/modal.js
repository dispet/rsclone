import {$, getFetch, postFetch, putFetch, updateLog, findColumn, findNote, watchBtn, $All} from '../utils'
import {dictionary} from '../utils/dictionary'
import {Column} from './column';
import {dndColumnHandler, dndNoteHandler} from './dragNdrop';
import {stringToColor,usersAdded} from "../main";

const getModalRoot = (event) => {
  if (event.target.closest('.column_modal')) {
    return $('.column_modal');
  }
  if (event.target.closest('.note_modal')) {
    return $('.note_modal');
  }
}

export class Modal {
  constructor(name, type, content = null, id = null, lang = null) {
    this.name = name;
    this.type = type
    this.content = content;
    this.id = id;
    this.lang = lang;
  }

  translate(lang, dataWord){
    return dictionary[lang][dataWord];
  }

  render() {
    if (this.name === 'Edit Note') {
      return `<div class="modal_header">${this.translate(this.lang, this.name)}
                    <textarea class="modal_textarea" placeholder="${this.translate(this.lang, 'Contents')}" name="content">${this.content}</textarea>
                        <div class="modal_btns">
                            <div data-translate="modalEdit" class="btn btn-primary submitBtn">${this.translate(this.lang, this.type)}</div>
                            <div data-translate="modalCancel" class="btn btn-secondary cancelBtn">${this.translate(this.lang, 'cancel')}</div>
                        </div>
                    </div>`
    }
    if (this.name === 'Add Member to Note') {
      return `<div class="modal_header">${this.name}
                    <input class="modal_columnText" type="text" placeholder="Member name" name="member">${this.content}</textarea>
                        <div class="modal_btns">
                            <div class="btn btn-primary submitBtn">${this.type}</div>
                            <div class="btn btn-secondary cancelBtn">Cancel</div>
                        </div>
                    </div>`
    }
    return `<div class="modal_header">${this.translate(this.lang, this.name)}
                    <input class="modal_columnText" type="text" placeholder="${this.translate(this.lang, this.name)}" name="name" value=${this.content || ''}>
                        <div class="modal_btns">
                            <div class="btn btn-primary submitBtn">${this.translate(this.lang, this.type)}</div>
                            <div class="btn btn-secondary cancelBtn">${this.translate(this.lang, 'cancel')}</div>
                        </div>
                    </div>`

  }

  addEventHandler($modal) {
    const $cancelBtn = $('.cancelBtn', $modal);
    const $submitBtn = $('.submitBtn', $modal);
    $cancelBtn.addEventListener('click', this.cancelModal);

    if (this.type === 'Add') {
      if (this.name === 'Add Column')
        $submitBtn.addEventListener('click', this.addColumn);
      else
        $submitBtn.addEventListener('click', this.addMember);
    } else if (this.type === 'Edit') {
      if (this.name === 'Edit Note')
        $submitBtn.addEventListener('click', this.editNote);
      else
        $submitBtn.addEventListener('click', this.editColumn);
    }
  }

  cancelModal = (event) => {
    const $modal = getModalRoot(event);
    $modal.classList.toggle('hidden');
  }

  addColumn = (event) => {
    const $modal = getModalRoot(event);
    const name = $('.modal_columnText', $modal).value;
    if (!name) {
      alert('Input your name, please')
      return;
    }
    const payload = {
      name
    }
    postFetch('/api/columns', payload)
      .then((json) => {
        const data = json.data;
        getFetch(`/api/columns/${data.column_id}`)
          .then((jsonN) => {
            const $columnList = $('.columnList');
            const dataN = jsonN.data;
            const column = new Column(dataN.id, dataN.name, dataN.user_id, []);
            $columnList.innerHTML += column.render();
            $modal.classList.toggle('hidden');
            return column.id
          })
          .then(_ => {
            $All('.column').forEach($c => {
              dndColumnHandler($c);
              $All('.note', $c).forEach($n => {
                dndNoteHandler($n);
              })
            });
            watchBtn();
          })
          .then(() => {
            updateLog();
          })
      })
  }

  editColumn = (event) => {
    const $modal = getModalRoot(event);
    const name = $('.modal_columnText', $modal).value;
    if (!name) {
      alert('Input your name, please')
      return;
    }
    const payload = {
      id: this.id,
      name
    }
    putFetch('/api/columns/rename', payload)
      .then((json) => {
        const $column = findColumn(this.id);
        const $name = $('.columnName', $column);
        $name.innerHTML = name;
        $modal.classList.toggle('hidden');
      })
      .then(() => {
        updateLog();
      })
  }

  editNote = (event) => {
    const $modal = getModalRoot(event);
    const content = $('.modal_textarea', $modal).value;
    if (!content) {
      alert('Please enter your details')
      return;
    }
    const payload = {
      id: this.id,
      content
    }
    putFetch('/api/note/update', payload)
      .then((json) => {
        const $note = findNote(this.id);
        const $name = $('.noteName', $note);
        $name.innerHTML = content;
        $modal.classList.toggle('hidden');
      })
      .then(() => {
        updateLog();
      })
  }

  addMember = (event) => {
    const $modal = getModalRoot(event);
    const content = $('.modal_columnText', $modal).value;
    if (!content) {
      alert('Please enter your details')
      return;
    }
    const user = usersAdded.filter(el => el.name === content)[0];
    if (!user) {
      alert('Please enter one of the members')
      return;
    }
    const $note = findNote(this.id);
    const $members = $('.noteFooter', $note);

    if ($members.innerHTML.includes(`id="${user.id}"`))
    {
      alert('The member already exists. Please enter another member')
      return;
    }
    const payload = {
      id: this.id,
      name: content,
      member: user.id
    }
    putFetch('/api/note/addMember', payload)
      .then((json) => {
        const $elementAvatar = document.createElement('div');
        const $dataset = document.createAttribute('id');
        const $title = document.createAttribute('title');
        $elementAvatar.className = 'user-info-avatar';
        $dataset.value = user.id;
        $title.value = 'avatar';
        $elementAvatar.setAttributeNode($dataset);
        $elementAvatar.setAttributeNode($title);
        const name = content.toUpperCase();
        const nameArr = name.split(' ');
        const letter = (nameArr.length >1)? `${nameArr[0][0]}${nameArr[1][0]}`: name.substr(0, 2);
        const backgroundColor = stringToColor(name);
        $elementAvatar.innerHTML = letter;
        $elementAvatar.style.backgroundColor = backgroundColor;
        $elementAvatar.title = `${user.name} ${user.email}`;
        $members.innerHTML += $elementAvatar.outerHTML;

        $modal.classList.toggle('hidden');
      })
      .then(() => {
        updateLog();
      })
  }
}


