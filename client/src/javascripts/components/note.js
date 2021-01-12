export class Note {
    constructor(id, content, addedBy){
        this.id =id;
        this.content = content;
        this.addedBy = addedBy;
    }

    render() {
        return `<div class="note" data-id=${this.id} draggable="true" >
                    <div class="noteHeader">
                        <div class="noteTitle"><i class="far fa-edit"></i><span class="noteName">${this.content}</span></div>
                        <div class="noteRemoveBtn">&times</div>
                    </div>
                    <div class="noteFooter"><span class="added">Added by </span><span>${this.addedBy}</span></div>
                </div>`
    }
}