import createLabel from "./label";

export class Note {
    constructor(id, content, addedBy) {
        this.id = id;
        this.content = content;
        this.addedBy = addedBy;
    }

    render() {
        return `<div class="note rt" data-id=${this.id} draggable="true">
                    <div class="note__labels"></div>
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
                      <div class="labels__menu-item">
                        <button data-hex='#61bd4f' class="label-btn" style="background: #61bd4f;"></button>
                      </div>
                      <div class="labels__menu-item">
                        <button data-hex='#f2d600' class="label-btn" style="background: #f2d600;"></button>
                      </div>
                      <div class="labels__menu-item">
                        <button data-hex='#ff9f1a' class="label-btn" style="background: #ff9f1a"></button>
                      </div>
                      <div class="labels__menu_item">
                        <button data-hex='#eb5a46' class="label-btn" style="background: #eb5a46"></button>
                      </div>
                      <div class="labels__menu_item">
                        <button data-hex='#c377e0' class="label-btn" style="background: #c377e0;"></button>
                      </div>
                      <div class="labels__menu_item">
                        <button data-hex='#0079bf' class="label-btn" style="background: #0079bf;"></button>
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
