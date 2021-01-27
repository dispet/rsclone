import {Log} from '../components/log';

export const $ = (selector, base = document) => base.querySelector(selector)
export const $All = (selector, base = document) => base.querySelectorAll(selector)

const $columnList = $('.columnList');

export const getFetch = ((url) => {
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json())
})

export const postFetch = ((url, body) => {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((res) => res.json())
})

export const putFetch = ((url, body) => {
  return fetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((res) => res.json())
})

export const deleteFetch = ((url) => {
  return fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json())
})


export const findColumn = (id) => {
  const columns = $All('.column');
  for (let i = 0; i < columns.length; i += 1) {
    if (columns[i].dataset.id === id) {
      return columns[i];
    }
  }
}

export const findNote = (id) => {
  const notes = $All('.note');
  for (let i = 0; i < notes.length; i += 1) {
    if (notes[i].dataset.id === id) {
      return notes[i];
    }
  }
}

export const updateLog = () => {
  getFetch('/api/log')
    .then((json) => {
      const $logList = $('.loglist');
      const $navHeader = $('.navHeader', $logList);
      const logs = json.data;
      const now = new Date();
      const logInnerN = logs.reduce((logInner, l) => {
        const log = new Log(l.action, l.name, l.subject, l.createdAt, now, (l.to_column) || '', (l.from_column) || '');
        return logInner + log.render();
      }, '')
      $logList.innerHTML = $navHeader.outerHTML + logInnerN;
    })
}
const disableBtn = ($noteAddBtn) => {
  $noteAddBtn.style.pointerEvents = 'none';
  $noteAddBtn.style.backgroundColor = 'darkgrey';
}

export const watchBtn = () => {
  const $textareas = $All('textarea');
  $textareas.forEach($el => {
    $el.addEventListener('keyup', (event) => {
      const $dropdown = $el.closest('.dropdown')
      const $noteAddBtn = $('.note-add-btn', $dropdown);
      if ($el.value) {
        $noteAddBtn.style.pointerEvents = 'auto';
        $noteAddBtn.style.backgroundColor = 'rgb(67,219,207)';
      } else {
        disableBtn($noteAddBtn);
      }
    })
  })

  $columnList.addEventListener('keyup', (event) => {
    if (event.target === '') {
      const $textarea = $('textarea');
      const $dropdown = $columnList.closest('.dropdown')
      const $noteAddBtn = $('.note-add-btn', $dropdown);
      if ($textarea.value) {
        $noteAddBtn.style.pointerEvents = 'auto';
        $noteAddBtn.style.backgroundColor = 'rgb(67,219,207)';
      } else {
        disableBtn($noteAddBtn);
      }
    }

  })
}
