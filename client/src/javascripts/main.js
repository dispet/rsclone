import {$, $All, getFetch, postFetch, deleteFetch, updateLog, watchBtn, putFetch} from "./utils";
import {dictionary} from "./utils/dictionary";
import {Column} from "./components/column";
import {Note} from "./components/note";
import {Modal} from "./components/modal";
import {dndColumnHandler, dndNoteHandler} from "./components/dragNdrop";

const $columnList = $(".columnList");
let userId;
export let usersAdded;
let labelOn = false;

export const stringToColor = function stringToColor(str) {
  let hash = 0;
  let color = "#";
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
    value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
};

const addOverlayEvent = () => {
  const overlays = $All(".modal_overlay");
  overlays.forEach((el) => {
    const $modal = el.parentElement;
    el.addEventListener("click", () => {
      $modal.classList.toggle("hidden");
    });
  });
};

const addColumnEvent = () => {
  const $addColumn = $(".addColumn");
  const $columnModal = $(".column_modal");
  const $modalContent = $(".modal_content", $columnModal);
  $addColumn.addEventListener("click", (event) => {
    const $selectLang = $("#lang");
    const modal = new Modal("Add Column", "Add", null, null, $selectLang.value);
    $modalContent.innerHTML = modal.render();
    modal.addEventHandler($columnModal);
    $columnModal.classList.toggle("hidden");
  });
};
let sound = 'add';
let enable = true;
function playAudio(url, isEnable) {
  const audio = new Audio(url);
  if (isEnable) {
    audio.play();
  }
}
// sounds
const sounds = () => {

  function createSoundButton() {
      const headerContainer = $("header.no-select");
      const btn = document.createElement("span");
      btn.className = "sound-btn";
      btn.innerHTML = '<i class="far fa-bell"></i>';
      headerContainer.append(btn);
  }
  createSoundButton();

  function enableSound() {
      document.addEventListener("click", (e) => {
          if (e.target.closest(".sound-btn")) {
            playAudio(`dist/src/assets/sound/${sound}.mp3`, enable);
              const btn = e.target.closest(".sound-btn");
              enable = !enable;
              if (enable) {
                  btn.innerHTML = '<i class="far fa-bell"></i>';
              } else {
                  btn.innerHTML = '<i class="fas fa-bell-slash"></i>';
              }
          }
      });
  }
  enableSound();

  function addSound() {
      let dataSounds = $All("[data-sound]");
      document.addEventListener("click", (e) => {
          if (e.target.closest("[data-sound]")) {
              dataSounds = $All("[data-sound]");
              sound = e.target.closest("[data-sound]").dataset.sound || 'add';
            const audio = document.querySelector(".audio");
          }
      });
  }
  addSound();
};
// sounds

// change background
const changeMainBackground = () => {
  let mainBackground = "";

  function openCloseMenu() {
    document.addEventListener("click", (e) => {
      const parent = document.querySelector(".menu");
      if (e.target.closest(".change-bg")) {
        playAudio(`dist/src/assets/sound/${sound}.mp3`, enable);
        parent.querySelector(".menu__content").classList.toggle("active");
      }
      if (e.target.classList.contains("menu__btn")) {
        playAudio(`dist/src/assets/sound/${sound}.mp3`, enable);
        const target = e.target;
        const menus = parent.querySelectorAll(".menu__sub");
        menus.forEach((item) => {
          if (item.dataset.type === target.dataset.action) {
            item.classList.toggle("active");
          }
        });
      }
    });
  }

  openCloseMenu();

  if (localStorage.getItem("mainBg")) {
    const boardBackground = document.getElementById("main");
    boardBackground.style.background = localStorage.getItem("mainBg");
  }

  function addToLocalStorage(item, value) {
    localStorage.setItem(item, value);
  }

  function changeColor() {
    document.addEventListener("click", (e) => {
      const inputColor = document.getElementById("main-background");
      if (e.target === inputColor) {
        playAudio(`dist/src/assets/sound/${sound}.mp3`, enable);
        const boardBackground = document.getElementById("main");
        inputColor.addEventListener("blur", function () {
          boardBackground.style.background = this.value;
          mainBackground = this.value;
          addToLocalStorage("mainBg", mainBackground);
        });
      }
    });
  }

  changeColor();

  function changeImage() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("sample")) {
        playAudio(`dist/src/assets/sound/${sound}.mp3`, enable);
        const boardBackground = document.getElementById("main");
        const currentBackground = e.target.style.background;
        boardBackground.style.background = currentBackground;
        mainBackground = currentBackground;
        addToLocalStorage("mainBg", mainBackground);
      }
    });
  }

  changeImage();
};
// change background

const editColumnEvent = () => {
  const $columnModal = $(".column_modal");
  const $modalContent = $(".modal_content", $columnModal);
  $columnList.addEventListener("dblclick", (event) => {
    if (event.target.className === "columnName") {
      const $column = event.target.closest(".column");
      const id = $column.dataset.id;
      const name = $(".columnName", $column).innerHTML;
      const $selectLang = $("#lang");
      const modal = new Modal("Edit Column", "Edit", name, id, $selectLang.value);
      $modalContent.innerHTML = modal.render();
      modal.addEventHandler($columnModal);
      $columnModal.classList.toggle("hidden");
    }
  });
};

const removeColumnEvent = () => {
  $columnList.addEventListener("click", (event) => {
    if (event.target.className === "closeBtn") {
      const $column = event.target.closest(".column");
      const id = $column.dataset.id;
      const isSure = confirm("Are you sure you want to delete?");
      if (isSure) {
        const payload = {
          id,
          head: null
        };
        deleteFetch(`/api/columns/${id}`).then(() => {
          $columnList.removeChild($column);
          updateLog();
        });
      }
    }
  });
};

// note color
const addNoteBg = () => {
  let note;
  const background = function () {
    note.style.backgroundColor = this.value;
    const payload = {
      id: note.dataset.id,
      background: this.value
    };

    putFetch("/api/note/background", payload).then((json) => {
      updateLog();
      labelOn = false;
    });
  };
  const color = function () {
    const noteHeader = note.querySelector(".noteHeader");
    const noteIcon = note.querySelector(".note__icon");
    noteHeader.style.color = this.value;
    noteIcon.style.color = this.value;
    const payload = {
      id: note.dataset.id,
      color: this.value
    };

    putFetch("/api/note/color", payload).then((json) => {
      updateLog();
      labelOn = false;
    });
  };
  document.addEventListener("click", (e) => {
    note = e.target.closest(".note");
    if (note) {
      const inputBackground = note.querySelector("#note-background");
      const inputColor = note.querySelector("#note-color");
      inputBackground.removeEventListener("blur", background);
      inputColor.removeEventListener("blur", color);
      inputBackground.addEventListener("blur", background);
      inputColor.addEventListener("blur", color);
    }
  });
};
// note color

// change lang
const changeLang = () => {
  const selectLang = document.getElementById("lang");

  function translatePlaceholder(lang, dataWord, elem) {
    if (elem.getAttribute("placeholder")) {
      elem.setAttribute("placeholder", dictionary[lang][dataWord]);
    }
  }

  function translateWord(lang, dataWord, elem) {
    elem.textContent = dictionary[lang][dataWord];
  }

  selectLang.addEventListener("change", function () {
    const translated = document.querySelectorAll("[data-translate]");
    translated.forEach((item) => {
      translateWord(this.value, item.dataset.translate, item);
      translatePlaceholder(this.value, item.dataset.translate, item);
    });
  });
};
// change lang

// labels
const addLabel = () => {
  function addActiveLabel() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("labels__menu-close") && labelOn) {
        const parent = e.target.closest(".note");
        const labels = parent.querySelectorAll(".label");
        let local = 0;
        labels.forEach((label, i) => {
          local |= Number(label.classList.contains("active")) << i;
        });
        const payload = {
          id: parent.dataset.id,
          label: local
        };

        putFetch("/api/note/label", payload).then((json) => {
          updateLog();
          labelOn = false;
        });
      }
      if (e.target.classList.contains("label-btn")) {
        playAudio(`dist/src/assets/sound/${sound}.mp3`, enable);
        labelOn = true;
        const parent = e.target.closest(".note");
        const labels = parent.querySelectorAll(".label");
        e.target.classList.toggle("active");
        labels.forEach((label, i) => {
          if (label.dataset.color === e.target.dataset.hex) {
            label.classList.toggle("active");
          }
        });
      }
      if (e.target.classList.contains("member-btn")) {
        const parent = e.target.closest(".note");
        const avatars = parent.querySelectorAll(".user-info-avatar");

        let local = "";
        let act;
        // add active class
        e.target.classList.toggle("active");
        avatars.forEach((avatar, i) => {
          if (avatar.id === e.target.id) {
            avatar.classList.toggle("active");
            act = avatar.classList.contains("active") ? `add` : "remove";
          }
          local += avatar.classList.contains("active") ? `${avatar.id},` : "";
        });

        const payload = {
          id: parent.dataset.id,
          member: local,
          action: act,
          memberId: e.target.id
        };

        putFetch("/api/note/member", payload).then((json) => {
          updateLog();

        });
      }
    });
  }

  addActiveLabel();

  function addLabelNote() {
  }

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
  $columnList.addEventListener("click", (event) => {
    if (event.target.className === node) {
      const $column = event.target.closest(".column");
      const $dropdown = $(".dropdown", $column);
      const $noteAddBtn = $(".note-add-btn", $dropdown);
      const $textarea = $("textarea", $dropdown);
      $textarea.value = "";
      disableBtn($noteAddBtn);
      $dropdown.classList.toggle("hidden");
      updateLog();
    }
  });
};

const disableBtn = ($noteAddBtn) => {
  $noteAddBtn.style.pointerEvents = "none";
  $noteAddBtn.style.backgroundColor = "darkgrey";
};

const addNoteEvent = () => {
  $columnList.addEventListener("click", (event) => {
    if (event.target.className === "note-add-btn") {
      const $column = event.target.closest(".column");
      const $textarea = $("textarea", $column);
      const payload = {
        columns_id: $column.dataset.id,
        content: $textarea.value
      };
      postFetch("/api/note", payload)
        .then((json) => {
          const data = json.data;
          const $dropdown = $(".dropdown", $column);
          const $columnBody = $(".columnBody", $column);
          const $circle = $(".circle", $column);
          const note = new Note(
            data.id,
            data.content,
            data.addedBy,
            data.members,
            data.label,
            data.background,
            data.color
          );
          $columnBody.innerHTML += note.render();
          $circle.innerHTML++;
          $textarea.value = "";
          disableBtn(event.target);
          $dropdown.classList.toggle("hidden");
          return $columnBody;
        })
        .then(($columnBody) => {
          $All(".note", $columnBody).forEach(($el) => {
            dndNoteHandler($el);
          });
          updateLog();
        });
    }
  });
};

const removeNoteEvent = () => {
  $columnList.addEventListener("click", (event) => {
    if (event.target.className === "noteRemoveBtn") {
      const $note = event.target.closest(".note");
      const $column = event.target.closest(".column");
      const $columnBody = $(".columnBody", $column);
      const $circle = $(".circle", $column);

      const id = $note.dataset.id;
      const isSure = confirm("Are you sure you want to delete the note?");
      if (isSure) {
        deleteFetch(`/api/note/${id}`).then((json) => {
          $columnBody.removeChild($note);
          $circle.innerHTML--;
          updateLog();
        });
      }
    }
  });
};

const editNoteEvent = () => {
  const $noteModal = $(".note_modal");
  const $selectLang = $("#lang");
  const $modalContent = $(".modal_content", $noteModal);
  $columnList.addEventListener("dblclick", (event) => {
    if (event.target.closest(".noteTitle")) {
      const id = event.target.closest(".note").dataset.id;
      const name = $(".noteName", event.target.closest(".noteTitle")).innerHTML;
      const modal = new Modal("Edit Note", "Edit", name, id, $selectLang.value);
      $modalContent.innerHTML = modal.render();
      modal.addEventHandler($noteModal);
      $noteModal.classList.toggle("hidden");
    }
  });
  $columnList.addEventListener("click", (event) => {
    if (event.target.className === "noteAddMemberBtn") {
      const id = event.target.closest(".note").dataset.id;
      const modal = new Modal("Add Member to Note", "Add", "", id);
      $modalContent.innerHTML = modal.render();
      modal.addEventHandler($noteModal);
      $noteModal.classList.toggle("hidden");
    }
  });
};

const navEvent = () => {
  const $boardHeaderBtn = $(".board-header-btn");
  const $email = $(".email");
  const $submitBtn = $(".submit-btn");
  const $openNav = $(".openNav");
  const $closeBtn = $(".closebtn");
  const $mySidenav = $("#mySidenav");
  const $main = $("#main");
  const $logoutbtn = $(".logoutbtn");
  const $signupbtn = $(".signupbtn");

  $openNav.addEventListener("click", () => {
    $mySidenav.style.width = "360px";
    $main.style.marginright = "360px";
    updateLog();
  });
  $closeBtn.addEventListener("click", () => {
    playAudio(`dist/src/assets/sound/${sound}.mp3`, enable);
    $mySidenav.style.width = "0";
    $main.style.marginright = "0";
  });

  $logoutbtn.addEventListener("click", () => {
    getFetch("/api/users/auth/logout").then(() => {
      localStorage.setItem("userId", '0');
      window.location.replace("/");
    });
  });
  $signupbtn.addEventListener("click", () => {
    window.location.href = `/signup`;
  });
};

const columnDnDEvent = () => {
  const $columns = $All(".column", $columnList);
  $columns.forEach(($el) => {
    dndColumnHandler($el);
  });
};

const noteDnDEvent = () => {
  const $notes = $All(".note", $columnList);
  $notes.forEach(($el) => {
    dndNoteHandler($el);
  });
};

const setEventHandler = () => {
  addOverlayEvent();
  addColumnEvent();
  editColumnEvent();
  removeColumnEvent();
  removeNoteEvent();
  navEvent();
  dropdownEvent("addBtn");
  dropdownEvent("cancel-btn");
  watchBtn();
  columnDnDEvent();
  addNoteEvent();
  noteDnDEvent();
  editNoteEvent();
  addLabel();
  noteMenu();
  addNoteBg();
  changeLang();
  changeMainBackground();
  sounds();
};

const headerRender = () => {
  getFetch("/api/users/find")
    .then((json) => {
      const user = json.data;
      userId = user.id;
      localStorage.setItem("userId", userId);
      const $header = $(".title");
      const $btn = $(".members");
      $header.innerHTML = `${user.name}'s Board`;
      const $userInfo = $(".user-info");
      usersAdded.forEach((el) => {
        const elementAvatar = $userInfo.appendChild(document.getElementById("avatar").cloneNode());
        elementAvatar.classList.toggle("active");
        const name = el.name.toUpperCase();
        const letter = name.substr(0, 2);
        const backgroundColor = stringToColor(name);

        elementAvatar.innerHTML = letter;
        elementAvatar.style.backgroundColor = backgroundColor;
        elementAvatar.title = `${el.name} ${el.email}`;
        elementAvatar.id += el.id;
      });
    });
};

const render = () => {
  getFetch("/api/users/addedBy")
    .then((json) => {
      usersAdded = json.data;
      getFetch("/api/users/columns")
        .then((jsonC) => {
          jsonC.data.forEach((c) => {
            const column = new Column(c.id, c.name, c.user_id, c.list);
            $columnList.innerHTML += column.render();
          });
          headerRender();
          setEventHandler();
        })
        .catch((err) => {
          console.log(err);
        });
    });
}
const init = () => {
  getFetch("/api/users/auth/loginCheck")
    .then((json) => {
      if (!json.data) {
        //
        window.location.replace("/login");
      } else {
        render();
      }
    })
    .catch((err) => {
      //
      window.location.replace("/login");
    });
};

init();
