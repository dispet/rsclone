const ColumnsModel = require('../models/columns.model')

class ColumnsService {
    constructor() {
        this.columnsModel = new ColumnsModel();
    }

    async findOne(columnsId) {
      // eslint-disable-next-line no-useless-catch
        try {
            return await this.columnsModel.SELECT(columnsId);
        } catch (err) {
            throw err;
        }
    }

    async create(columnsDTO) {
      // eslint-disable-next-line no-useless-catch
        try {
          // eslint-disable-next-line no-param-reassign
            columnsDTO.column_id = await this.columnsModel.INSERT(columnsDTO);
          // eslint-disable-next-line no-param-reassign
            columnsDTO.subject = `Column(${columnsDTO.name})`
            return columnsDTO;
        } catch (err) {
            throw err;
        }
    }

    async update(columnsDTO) {
      // eslint-disable-next-line no-useless-catch
        try {
            await this.columnsModel.UPDATE(columnsDTO);
        } catch (err) {
            throw err;
        }
    }

    async rename(columnsDTO) {
      // eslint-disable-next-line no-useless-catch
        try {
            const origin = await this.columnsModel.SELECT(columnsDTO.id);
            await this.columnsModel.RENAME(columnsDTO);
          // eslint-disable-next-line no-param-reassign
            columnsDTO.subject = `Column(${origin.name} -> ${columnsDTO.name})`;
            return columnsDTO;
        } catch (err) {
            throw err;
        }
    }

    async delete(columnsId) {
      // eslint-disable-next-line no-useless-catch
        try {
            const origin = await this.columnsModel.SELECT(columnsId);
            await this.columnsModel.DELETE(columnsId);
            return `Column(${origin.name})`
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ColumnsService;
