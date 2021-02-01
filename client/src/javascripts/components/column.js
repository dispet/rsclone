import { $, $All, deleteFetch, updateLog } from '../utils'
import { Note } from './note'

export class Column {
    constructor(id, name, userId, list) {
        this.id = id;
        this.name = name;
        this.user_id = userId;
        this.list = list;
    }

    render() {
        const $columnDiv = document.createElement('div');
        const $dataset = document.createAttribute('data-id');

        $columnDiv.className = 'column card';
        $dataset.value = this.id;
        $columnDiv.setAttributeNode($dataset);

        $columnDiv.innerHTML = `<div class="columnHeader">
        <div class="columnTitle" ><span class="circle">${this.list.length} </span><span class="columnName">${this.name}</span></div>
        <div class="addBtn">+</div>
        <div class="closeBtn">&times</div>
        </div >
        <div class="dropdown hidden"><textarea data-translate="Enter content" placeholder="Enter content" name="name"></textarea>
            <div class="dropdown_btns">
                <div data-translate="Add" class="note-add-btn">Add</div>
                <div data-translate="cancel" class="cancel-btn">Cancel</div>
            </div>
        </div>
        <div class="columnBody"></div>`

        const $columnBody = $('.columnBody', $columnDiv);
        this.list.forEach((n) => {
            const note = new Note(n.id, n.content, n.addedBy, n.members, n.label, n.background, n.color);
            this.addNote($columnBody, note);

        })
        return $columnDiv.outerHTML;
    }

    addNote($columnBody, note) {
        $columnBody.innerHTML += note.render();
    }

}


