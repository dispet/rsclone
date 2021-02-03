import { $,putFetch, updateLog, findNote} from '../utils'


const onDragleave = (event) => {
  if (event.target.closest('.note')) {
    event.target.closest('.note').valuedrop = '0';
  }
}


const onDragover = (event) => {
  event.preventDefault();
  if(event.target.closest('.note')){
    const $note = event.target.closest('.note');
    const rect = $note.getBoundingClientRect();
    const centerY = rect.y + (rect.bottom- rect.top)/2;
    if (event.clientY < centerY - ((rect.bottom - rect.top) / 5) ){
      $note.valuedrop = '1';
    }
  }
}

const onDragstart = (event) => {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
}


const onDrop = (event) => {
  const id = event.dataTransfer.getData('text');
  const $note = findNote(id);
  const $origin = $note.closest('.column');
  let $column = event.target;
  if ($column.className !== 'column') {
    $column = $column.closest('.column');
  }

  if (event.target.closest('.note')) {
    const $nextNote = event.target.closest('.note');
    if (+$nextNote.valuedrop === 1 ){
      if ($note.dataset.id === $nextNote.dataset.id ){
        $nextNote.valuedrop = '0';
        return;
      }
      const payload = {
        id: $note.dataset.id,
        columns_id: $column.dataset.id,
        next_note: $nextNote.dataset.id
      }
      putFetch('/api/note/move', payload)
        .then(json => {
          $nextNote.valuedrop = '0';
          $('.columnBody', $origin).removeChild($note);
          $('.columnBody', $column).insertBefore($note, $nextNote);
          $('.circle', $origin).innerHTML--;
          $('.circle', $column).innerHTML++;
          updateLog();
        })
    }
  }else{
    const payload = {
      id: $note.dataset.id,
      columns_id: $column.dataset.id,
      next_note: null
    }
    putFetch('/api/note/move', payload)
      .then(json => {
        $('.columnBody', $origin).removeChild($note);
        $('.columnBody', $column).appendChild($note);

        $('.circle', $origin).innerHTML--;
        $('.circle',$column).innerHTML++;
        updateLog();
      })
  }

}

export const dndColumnHandler = ($column) => {
  $column.addEventListener('dragover', onDragover);
  $column.addEventListener('drop', onDrop);
  $column.addEventListener('dragleave', onDragleave)
}

export const dndNoteHandler = ($note) => {
  $note.addEventListener('dragstart', onDragstart);
}

