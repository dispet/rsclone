const ColumnsModel = require('../models/columns.model')
const NoteModel = require('../models/note.model')

class ColumnsService {
  constructor() {
    this.columnsModel = new ColumnsModel();
    this.noteModel = new NoteModel();
  }

  async findOne(columnsId) {

    try {
      return await this.columnsModel.SELECT(columnsId);
    } catch (err) {
      throw err;
    }
  }

  async create(columnsDTO) {

    try {
      columnsDTO.column_id = await this.columnsModel.INSERT(columnsDTO);
      columnsDTO.subject = `Column(${columnsDTO.name})`
      return columnsDTO;
    } catch (err) {
      throw err;
    }
  }

  async update(columnsDTO) {

    try {
      await this.columnsModel.UPDATE(columnsDTO);
    } catch (err) {
      throw err;
    }
  }

  async rename(columnsDTO) {

    try {
      const origin = await this.columnsModel.SELECT(columnsDTO.id);
      await this.columnsModel.RENAME(columnsDTO);
      columnsDTO.subject = `Column(${origin.name} -> ${columnsDTO.name})`;
      return columnsDTO;
    } catch (err) {
      throw err;
    }
  }

  async delete(columnsId) {

    try {
      const origin = await this.columnsModel.SELECT(columnsId);
      const noteId = origin.head;
      if (noteId) {
        const note = await this.noteModel.SELECT_ALL(columnsId);
        origin.head = null;
        await this.columnsModel.UPDATE(origin);
        await note.forEach(el => this.noteModel.DELETE(el.id));
      }
      await this.columnsModel.DELETE(columnsId);
      return `Column(${origin.name})`
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ColumnsService;
