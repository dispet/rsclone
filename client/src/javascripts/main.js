import { $, $All, getFetch, postFetch, deleteFetch, updateLog, watchBtn } from './utils'
import { Column } from './components/column'
import { Note } from './components/note'
import { Modal } from './components/modal'
import { dndColumnHandler, dndNoteHandler } from './components/dragNdrop';

const $columnList = $('.columnList');

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
        modal.addEventHandler($column_modal);
        $column_modal.classList.toggle('hidden');
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
            modal.addEventHandler($column_modal);
            $column_modal.classList.toggle('hidden');
        }
    })
}

const removeColumnEvent = () => {
    $columnList.addEventListener('click', (event) => {
        if (event.target.className === 'closeBtn') {
            const $column = event.target.closest('.column');
            const id = $column.dataset.id;
          // eslint-disable-next-line no-restricted-globals
            const isSure = confirm("Are you sure you want to delete?")
            if (isSure) {
                deleteFetch(`/api/columns/${id}`)
                    .then(() => {
                        $columnList.removeChild($column);
                        updateLog();
                    })
            }

        }
    })
}

const dropdownEvent = (node) => {
    $columnList.addEventListener('click', (event) => {
        if (event.target.className === node) {
            const $column = event.target.closest('.column');
            const $dropdown = $('.dropdown', $column);
            const $noteAddBtn = $('.note-add-btn', $dropdown);
            const $textarea = $('textarea', $dropdown);
            $textarea.value = '';
          // eslint-disable-next-line no-use-before-define
            disableBtn($noteAddBtn);
            $dropdown.classList.toggle('hidden');
        }
    })
}

const disableBtn = ($noteAddBtn) => {
  // eslint-disable-next-line no-param-reassign
  $noteAddBtn.style.pointerEvents = 'none';
  // eslint-disable-next-line no-param-reassign
  $noteAddBtn.style.backgroundColor = 'darkgrey';
}

const addNoteEvent = () => {
    $columnList.addEventListener('click', (event) => {
        if (event.target.className === 'note-add-btn'){
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
                    const note = new Note(data.id, data.content, data.addedBy);
                    $columnBody.innerHTML += note.render();
                    $circle.innerHTML +=1 ;
                    $textarea.value = '';
                    disableBtn(event.target);
                    $dropdown.classList.toggle('hidden');
                    return $columnBody;
                })
                .then($columnBody => {
                    $All('.note',$columnBody).forEach($el => {
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
          // eslint-disable-next-line no-restricted-globals
            const isSure = confirm("Are you sure you want to delete the note?");
            if (isSure) {
                deleteFetch(`/api/note/${id}`)
                    .then((json) => {
                        $columnBody.removeChild($note);
                        $circle.innerHTML -=1 ;
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
        if (event.target.className === 'noteTitle') {
            const id = event.target.closest('.note').dataset.id;
            const name = $('.noteName', event.target).innerHTML;
            const modal = new Modal('Edit Note', 'Edit', name, id);
            $modalContent.innerHTML = modal.render();
            modal.addEventHandler($note_modal);
            $note_modal.classList.toggle('hidden');
        }
    })
}

const navEvent = () => {
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
                window.location.replace('/');
            })
    })
    $signupbtn.addEventListener('click', () => {
        window.location.href = '/signup';
    })
}

const columnDnDEvent = () => {
    const $columns = $All('.column',$columnList);
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
}
const headerRender = () => {
    getFetch('/api/users/find')
        .then(json => {
            const user = json.data;
            const $header = $('.title');
            $header.innerHTML = `${user.name}'s To-Do List`
        })
}


const render = () => {
    getFetch('/api/users/columns')
        .then((json) => {
            json.data.forEach((c) => {
                const column = new Column(c.id, c.name, c.user_id, c.list);
                $columnList.innerHTML += column.render();
            })
            headerRender();
            setEventHandler();
        }).catch(err => {
            console.log(err);
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
