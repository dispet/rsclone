const NoteModel = require('../models/note.model')
const ColumnsModel = require('../models/columns.model')
const UsersModel = require('../models/users.model')

class NoteService {
    constructor() {
        this.noteModel = new NoteModel();
        this.columnsModel = new ColumnsModel();
        this.usersModel = new UsersModel();
    }

    async findOne(noteId) {
        try {
            return await this.noteModel.SELECT(noteId);
        } catch (err) {
            throw err;
        }
    }

    async create(noteDTO) {
        try {
            const columns = await this.columnsModel.SELECT(noteDTO.columns_id);
            const insertId = await this.noteModel.INSERT(noteDTO);

            if(columns.head == null){
                columns.head = insertId;
                await this.columnsModel.UPDATE(columns);
            }else {
                const last = await this.noteModel.SELECT_LAST(columns.id);
                last.next_note = insertId;
                await this.noteModel.UPDATE_NODE(last);
            }
            noteDTO.id = insertId;
            noteDTO.to_column = columns.name;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async update(noteDTO) {
        try {
            const origin = await this.noteModel.SELECT(noteDTO.id);
            await this.noteModel.UPDATE(noteDTO);
            noteDTO.subject = `${ origin.content } -> ${ noteDTO.content }`;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async updateLabel(noteDTO) {
        try {
            const origin = await this.noteModel.SELECT(noteDTO.id);
            await this.noteModel.UPDATE_LABEL(noteDTO);
            noteDTO.subject = `${ origin.content } `;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async updateColor(noteDTO) {
        try {
            const origin = await this.noteModel.SELECT(noteDTO.id);
            await this.noteModel.UPDATE_COLOR(noteDTO);
            noteDTO.subject = `${ origin.content } ${ origin.color } -> ${ noteDTO.color }`;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async updateBackground(noteDTO) {
        try {
            const origin = await this.noteModel.SELECT(noteDTO.id);
            await this.noteModel.UPDATE_BACKGROUND(noteDTO);
            noteDTO.subject = `${ origin.content } ${ origin.background } -> ${ noteDTO.background }`;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async addMember(noteDTO) {
        try {
            const origin = await this.noteModel.SELECT(noteDTO.id);
            if (origin.members) origin.members += ',';
            noteDTO.member = origin.members + noteDTO.member;
            await this.noteModel.ADDMEMBER(noteDTO);
            noteDTO.subject = `Member ${noteDTO.name} to ${ origin.content }`;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }
    async updateMember(noteDTO) {
        try {
            const origin = await this.noteModel.SELECT(noteDTO.id);
            const user = await this.usersModel.SELECT(noteDTO.memberId);
            await this.noteModel.ADDMEMBER(noteDTO);
            noteDTO.subject = `${noteDTO.action} member ${user.name} ${noteDTO.action === 'add' ? 'to': 'from'} ${ origin.content}`;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async move(noteDTO) {
        try {
            const currColumns = await this.columnsModel.SELECT(noteDTO.columns_id);
            const origin = await this.noteModel.SELECT(noteDTO.id);
            const originColumns = await this.columnsModel.SELECT(origin.columns_id);

            if (currColumns.id === originColumns.id && noteDTO.next_note === origin.next_note)
                return null;

            if(noteDTO.next_note){
                const next = await this.noteModel.SELECT(noteDTO.next_note);
                if (currColumns.head === next.id) {
                    currColumns.head = noteDTO.id;
                    await this.updatePrev(origin, originColumns)
                    await this.columnsModel.UPDATE(currColumns);
                } else {
                    const nextPrev = await this.noteModel.SELECT_PREV(next.id);
                    nextPrev.next_note = noteDTO.id;
                    await this.updatePrev(origin, originColumns)
                    await this.noteModel.UPDATE_NODE(nextPrev);
                }
            }
            else {
                const last = await this.noteModel.SELECT_LAST(currColumns.id);

                if (last) {
                    last.next_note = noteDTO.id;
                    await this.updatePrev(origin, originColumns)
                    await this.noteModel.UPDATE_NODE(last);
                }else {
                    currColumns.head = noteDTO.id;
                    await this.columnsModel.UPDATE(currColumns);
                    await this.updatePrev(origin, originColumns)
                }
            }

            await this.noteModel.UPDATE_NODE(noteDTO);

            noteDTO.subject = origin.content;
            noteDTO.to_column = currColumns.name;
            noteDTO.from_column = originColumns.name;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async updatePrev(origin, originColumns) {
        const prev = await this.noteModel.SELECT_PREV(origin.id);
        if (prev) {
            prev.next_note = origin.next_note;
            await this.noteModel.UPDATE_NODE(prev);
        } else {
            originColumns.head = origin.next_note;
            await this.columnsModel.UPDATE(originColumns);
        }
    }

    async delete(noteId) {
        try {
            const note = await this.noteModel.SELECT(noteId);
            const columns = await this.columnsModel.SELECT(note.columns_id);
            if (columns.head === +noteId) {
                columns.head = note.next_note;
                await this.columnsModel.UPDATE(columns);
            } else {
                const prev = await this.noteModel.SELECT_PREV(noteId);
                prev.next_note = note.next_note;
                await this.noteModel.UPDATE_NODE(prev);
            }
            await this.noteModel.DELETE(noteId);

            return {
                subject: note.content,
                from_column: columns.name
            };
        } catch (err) {
            throw err;
        }
    }

}



module.exports = NoteService;
