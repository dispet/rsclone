import {$, $All, getFetch, postFetch, deleteFetch, updateLog, watchBtn, putFetch} from './utils'
import {Column} from './components/column'
import {Note} from './components/note'
import {Modal} from './components/modal'
import {dndColumnHandler, dndNoteHandler} from './components/dragNdrop';
import {Log} from "./components/log";

const avatar = require('avatar-image');

const $columnList = $('.columnList');
let userId;
export let usersAdded;
let labelOn = false;
let avatarOn = false;

export const stringToColor = function stringToColor(str) {
  let hash = 0;
  let color = '#';
  let i;
  let value;

  if (!str) {
    return `${color}333333`;
  }

  const strLength = str.length;

  for (i = 0; i < strLength; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i++) {
    value = (hash >> (i * 8)) & 0xFF;
    color += (`00${value.toString(16)}`).substr(-2);
  }

  return color;
};

const addOverlayEvent = () => {
  const overlays = $All('.modal_overlay');
  overlays.forEach(el => {
    const $modal = el.parentElement;
    el.addEventListener('click', () => {
      $modal.classList.toggle('hidden');
    })
  })
}

const addColumnEvent = () => {
  const $addColumn = $('.addColumn');
  const $columnModal = $('.column_modal');
  const $modalContent = $('.modal_content', $columnModal);
  $addColumn.addEventListener('click', (event) => {
    const modal = new Modal('Add Column', 'Add');
    $modalContent.innerHTML = modal.render();
    modal.addEventHandler($columnModal);
    $columnModal.classList.toggle('hidden');
  })
}

const editColumnEvent = () => {
  const $columnModal = $('.column_modal');
  const $modalContent = $('.modal_content', $columnModal);
  $columnList.addEventListener('dblclick', (event) => {
    if (event.target.className === 'columnName') {
      const $column = event.target.closest('.column');
      const id = $column.dataset.id;
      const name = $('.columnName', $column).innerHTML;
      const modal = new Modal('Edit Column', 'Edit', name, id);
      $modalContent.innerHTML = modal.render();
      modal.addEventHandler($columnModal);
      $columnModal.classList.toggle('hidden');
    }
  })
}

const removeColumnEvent = () => {
  $columnList.addEventListener('click', (event) => {
    if (event.target.className === 'closeBtn') {
      const $column = event.target.closest('.column');
      const id = $column.dataset.id;
      const isSure = confirm("Are you sure you want to delete?")
      if (isSure) {
        const payload = {
          id,
          head: null
        }
        deleteFetch(`/api/columns/${id}`)
          .then(() => {
            $columnList.removeChild($column);
            updateLog();
          })
      }

    }
  })
}

// note color
const addNoteBg = () => {
  document.addEventListener("click", (e) => {
      const note = e.target.closest(".note");
      if (note) {
          let noteBackground = "";
          let noteColor = "";
          const inputBackground = note.querySelector("#note-background");
          const noteHeader = note.querySelector(".noteHeader");
          const inputColor = note.querySelector("#note-color");
          const noteIcon = note.querySelector(".note__icon");
          inputBackground.addEventListener("blur", function () {
              noteBackground = this.value;
              note.style.backgroundColor = noteBackground;
          });
          inputColor.addEventListener("blur", function () {
              noteColor = this.value;
              noteHeader.style.color = noteColor;
              noteIcon.style.color = noteColor;
          });
      }
  });
};
// note color


// labels
const addSaveLabels = () => {
  const notes = document.querySelectorAll(".note");
  const keys = Object.keys(localStorage);
  notes.forEach((note) => {
    const btnWrapper = note.querySelector(".labels__menu-content");
    const labelsWrapper = note.querySelector(".note__labels");
    keys.forEach((key) => {
      if (String(note.dataset.id) === key) {
        const label =  labelsWrapper.querySelectorAll('.label')
        const btn = btnWrapper.querySelectorAll('.label-btn')

        const local = localStorage[key]
        label.forEach((el,i) =>{
          if (+local & (1 << i)) {
            el.classList.toggle("active");
            btn[i].classList.toggle("active");
          }
        })

        // btnWrapper.innerHTML = JSON.parse(localStorage[key]).buttonsHtml;
        // labelsWrapper.innerHTML = JSON.parse(localStorage[key]).labelsHtml;
      }
    });
  });
};

const addLabel = () => {
  function addToStorage(noteId, labels, buttons, noteBg, noteColor) {
    localStorage.setItem(noteId, JSON.stringify({ id: noteId, labelsHtml: labels, buttonsHtml: buttons, noteBackground: noteBg || '', noteColor: noteColor || '' }));
  }

  function saveToDatabase() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("button_save")) {
        const parentNote = e.target.closest(".note");
        const menu = e.target.closest(".note__menu");
        const noteId = parentNote.dataset.id;
        menu.classList.remove("active");
        const noteBody = parentNote.innerHTML;
        const $column = e.target.closest(".column");
        const payload = {
          id: noteId,
          content: "test 343434"
        };
      }
    });
  }
  saveToDatabase();

  function addActiveLabel() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("label-btn")) {
        if (labelOn)return ;console.log('label-btn');
        const btnColor = e.target.dataset.hex;
        const parent = e.target.closest(".note");
        const btns = parent.querySelectorAll(".label-btn");
        const labelsWrapper = parent.querySelector(".note__labels");
        const labelsBtnsWrapper = parent.querySelector("[data-type='label'] .labels__menu-content");
        const labels = parent.querySelectorAll(".label");
        let local = 0;
          // = localStorage[parent.dataset.id];
        // add active class
        e.target.classList.toggle("active");
        labels.forEach((label,i) => {
          local |= Number(label.classList.contains("active"))  << i;
          if (label.dataset.color === e.target.dataset.hex) {
            local ^= (1 << i);
            label.classList.toggle("active");
          }
        });
        // localStorage.setItem(parent.dataset.id,local)
        const payload = {
          id: parent.dataset.id,
          label: local
        }

        putFetch('/api/note/label', payload)
          .then((json) => {console.log('putFetch');
            updateLog();
            labelOn=false;
          })
        // addToStorage(parent.dataset.id, labelsWrapper.innerHTML, labelsBtnsWrapper.innerHTML);
      }
      if (e.target.classList.contains("member-btn")) {
        if (avatarOn)return ;
        const parent = e.target.closest(".note");
        const avatars = parent.querySelectorAll('.user-info-avatar');

        let local = '';
        // add active class
        e.target.classList.toggle("active");
        avatars.forEach((avatar,i) => {
          if (avatar.id === e.target.id) {
            avatar.classList.toggle("active");
          }
          local += avatar.classList.contains("active") ? `${avatar.id},` : '' ;
        });

        const payload = {
          id: parent.dataset.id,
          member: local
        }

        putFetch('/api/note/member', payload)
          .then((json) => {
            updateLog();
            avatarOn = false;
          })
      }
    });
  }
  addActiveLabel();

  function addLabelNote() {}
  addLabelNote();
};

const noteMenu = () => {
  function openMenu() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".note__icon")) {
        const parent = e.target.closest(".note");
        const menu = parent.querySelector(".note__menu");
        menu.classList.toggle("active");
      }
    });
  }
  openMenu();

  function openSubMenu() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("button")) {
        const btn = e.target;
        const parent = e.target.closest(".note");
        const menus = parent.querySelectorAll(".sub-menu");

        menus.forEach((menu) => {
          if (menu.dataset.type === btn.dataset.action) {
            menu.classList.toggle("active");
          }
        });
      }
    });
  }
  openSubMenu();

  function closeMenu() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("close")) {
        e.target.parentElement.classList.remove("active");
      }
    });
  }
  closeMenu();
};
// end labels

const dropdownEvent = (node) => {
  $columnList.addEventListener('click', (event) => {
    if (event.target.className === node) {
      const $column = event.target.closest('.column');
      const $dropdown = $('.dropdown', $column);
      const $noteAddBtn = $('.note-add-btn', $dropdown);
      const $textarea = $('textarea', $dropdown);
      $textarea.value = '';
      disableBtn($noteAddBtn);
      $dropdown.classList.toggle('hidden');
    }
  })
}

const disableBtn = ($noteAddBtn) => {
  $noteAddBtn.style.pointerEvents = 'none';
  $noteAddBtn.style.backgroundColor = 'darkgrey';
}

const addNoteEvent = () => {
  $columnList.addEventListener('click', (event) => {
    if (event.target.className === 'note-add-btn') {
      const $column = event.target.closest('.column');
      const $textarea = $('textarea', $column);
      const payload = {
        columns_id: $column.dataset.id,
        content: $textarea.value
      }
      postFetch('/api/note', payload)
        .then((json) => {
          const data = json.data;
          const $dropdown = $('.dropdown', $column)
          const $columnBody = $('.columnBody', $column);
          const $circle = $('.circle', $column);
          const note = new Note(data.id, data.content, data.addedBy, data.members, data.label);
          $columnBody.innerHTML += note.render();
          $circle.innerHTML++;
          $textarea.value = '';
          disableBtn(event.target);
          $dropdown.classList.toggle('hidden');
          return $columnBody;
        })
        .then($columnBody => {
          $All('.note', $columnBody).forEach($el => {
            dndNoteHandler($el);
          })
          updateLog();
        })
    }
  })
}


const removeNoteEvent = () => {
  $columnList.addEventListener('click', (event) => {
    if (event.target.className === 'noteRemoveBtn') {
      const $note = event.target.closest('.note');
      const $column = event.target.closest('.column');
      const $columnBody = $('.columnBody', $column);
      const $circle = $('.circle', $column);

      const id = $note.dataset.id;
      const isSure = confirm("Are you sure you want to delete the note?");
      if (isSure) {
        deleteFetch(`/api/note/${id}`)
          .then((json) => {
            $columnBody.removeChild($note);
            $circle.innerHTML--;
            updateLog();
          })
      }
    }
  })
}

const editNoteEvent = () => {
  const $noteModal = $('.note_modal');
  const $modalContent = $('.modal_content', $noteModal);
  $columnList.addEventListener('dblclick', (event) => {
    if (event.target.closest(".noteTitle")) {
      const id = event.target.closest('.note').dataset.id;
      const name = $('.noteName', event.target.closest(".noteTitle")).innerHTML;
      const modal = new Modal('Edit Note', 'Edit', name, id);
      $modalContent.innerHTML = modal.render();
      modal.addEventHandler($noteModal);
      $noteModal.classList.toggle('hidden');
    }
  })
  $columnList.addEventListener('click', (event) => {
    if (event.target.className === 'noteAddMemberBtn') {
      const id = event.target.closest('.note').dataset.id;
      const modal = new Modal('Add Member to Note', 'Add', '', id);
      $modalContent.innerHTML = modal.render();
      modal.addEventHandler($noteModal);
      $noteModal.classList.toggle('hidden');
    }
  })
}

const navEvent = () => {
  const $boardHeaderBtn = $('.board-header-btn');
  const $email = $('.email');
  const $submitBtn = $('.submit-btn');
  const $openNav = $('.openNav');
  const $closeBtn = $('.closebtn');
  const $mySidenav = $('#mySidenav');
  const $main = $('#main');
  const $logoutbtn = $('.logoutbtn');
  const $signupbtn = $('.signupbtn');

  $openNav.addEventListener('click', () => {
    $mySidenav.style.width = "360px";
    $main.style.marginright = "360px";
    updateLog();
  });
  $closeBtn.addEventListener('click', () => {
    $mySidenav.style.width = "0";
    $main.style.marginright = "0";
  });

  $logoutbtn.addEventListener('click', () => {
    getFetch('/api/users/auth/logout')
      .then(() => {
        localStorage.setItem('userId', null);
        window.location.replace('/');
      })
  })
  $signupbtn.addEventListener('click', () => {
    window.location.href = `/signup`;
  })
}

const columnDnDEvent = () => {
  const $columns = $All('.column', $columnList);
  $columns.forEach($el => {
    dndColumnHandler($el);
  })
}

const noteDnDEvent = () => {
  const $notes = $All('.note', $columnList);
  $notes.forEach($el => {
    dndNoteHandler($el);
  })
}


const setEventHandler = () => {
  addOverlayEvent();
  addColumnEvent();
  editColumnEvent();
  removeColumnEvent();
  removeNoteEvent();
  navEvent();
  dropdownEvent('addBtn');
  dropdownEvent('cancel-btn');
  watchBtn();
  columnDnDEvent();
  addNoteEvent();
  noteDnDEvent();
  editNoteEvent();
  // addSaveLabels();
  addLabel();
  noteMenu();
  addNoteBg();
}

const headerRender = () => {
  getFetch('/api/users/find')
    .then(json => {
      const user = json.data;
      userId = user;
      localStorage.setItem('userId', userId.id);
      const $header = $('.title');
      const $btn = $('.members');
      $header.innerHTML = `${user.name}'s Board`
    })
    .then(() => {
      getFetch('/api/users/addedBy')
        .then(json => {
          const $userInfo = $('.user-info');
          json.data.forEach(el => {
              localStorage.setItem(`user${el.id}`, el.name);
              const elementAvatar = $userInfo.appendChild(document.getElementById('avatar').cloneNode());
              elementAvatar.classList.toggle('active')
              const name = el.name.toUpperCase();
              const letter = name.substr(0, 2);
              const backgroundColor = stringToColor(name);

              elementAvatar.innerHTML = letter;
              elementAvatar.style.backgroundColor = backgroundColor;
              elementAvatar.title = `${el.name} ${el.email}`;
              elementAvatar.id += el.id;
            }
          )
        })
    })
}

const render = () => {
  getFetch('/api/users/addedBy')
    .then(json => {
      usersAdded = json.data;
    })
    .then(() => {
      getFetch('/api/users/columns')
        .then((jsonC) => {
          headerRender();
          jsonC.data.forEach((c) => {
            const column = new Column(c.id, c.name, c.user_id, c.list);
            $columnList.innerHTML += column.render();
          })
          setEventHandler();
        }).catch(err => {
        console.log(err);
      })
    })
}


const init = () => {
  getFetch('/api/users/auth/loginCheck')
    .then((json) => {
      if (!json.data) {    //
        window.location.replace('/login');
      } else {
        render();
      }
    })
    .catch((err) => { //
      window.location.replace('/login');
    })
}

init();
