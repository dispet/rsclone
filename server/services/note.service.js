const NoteModel = require('../models/note.model')
const ColumnsModel = require('../models/columns.model')

class NoteService {
    constructor() {
        this.noteModel = new NoteModel();
        this.columnsModel = new ColumnsModel();
    }

    async findOne(noteId) {
      // eslint-disable-next-line no-useless-catch
        try {
            return await this.noteModel.SELECT(noteId);
        } catch (err) {
            throw err;
        }
    }

    async create(noteDTO) {
      // eslint-disable-next-line no-useless-catch
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
          // eslint-disable-next-line no-param-reassign
            noteDTO.id = insertId;
          // eslint-disable-next-line no-param-reassign
            noteDTO.to_column = columns.name;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    async update(noteDTO) {
      // eslint-disable-next-line no-useless-catch
        try {
            const origin = await this.noteModel.SELECT(noteDTO.id);
            await this.noteModel.UPDATE(noteDTO);
          // eslint-disable-next-line no-param-reassign
            noteDTO.subject = `${ origin.content } -> ${ noteDTO.content }`;
            return noteDTO;
        } catch (err) {
            throw err;
        }
    }

    // columns_id: I moved columns of id
    async move(noteDTO) {
      // eslint-disable-next-line no-useless-catch
        try {
            const currColumns = await this.columnsModel.SELECT(noteDTO.columns_id);
            const origin = await this.noteModel.SELECT(noteDTO.id);
            const originColumns = await this.columnsModel.SELECT(origin.columns_id);

            if (currColumns.id === originColumns.id && noteDTO.next_note === origin.next_note)
                return null;

            // 1. next_note When there is
            if(noteDTO.next_note){
                const next = await this.noteModel.SELECT(noteDTO.next_note);
                // note The location of top Check whether
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
            // 2. next_note When there is no
            else {
                // Now columnsThe last of  note Bring
                const last = await this.noteModel.SELECT_LAST(currColumns.id);

                // last Is present bottom, Without top
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

            // Fix mine
            await this.noteModel.UPDATE_NODE(noteDTO);

          // eslint-disable-next-line no-param-reassign
            noteDTO.subject = origin.content;
          // eslint-disable-next-line no-param-reassign
            noteDTO.to_column = currColumns.name;
          // eslint-disable-next-line no-param-reassign
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
          // eslint-disable-next-line no-param-reassign
            originColumns.head = origin.next_note;
            await this.columnsModel.UPDATE(originColumns);
        }
    }

    async delete(noteId) {
      // eslint-disable-next-line no-useless-catch
        try {
            const note = await this.noteModel.SELECT(noteId);
            const columns = await this.columnsModel.SELECT(note.columns_id);

            if (columns.head === noteId) {
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
