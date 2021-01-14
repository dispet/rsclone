const LogModel = require('../models/log.model')
const ColumnsModel = require('../models/columns.model')

class LogService {
    constructor() {
        this.logModel = new LogModel();
        this.columnsModel = new ColumnsModel();
    }

    async read(userId) {
      // eslint-disable-next-line no-useless-catch
        try {
            return await this.logModel.SELECT_USERLOG(userId);
        } catch (err) {
            throw err;
        }
    }

    async addNote(data) {
      // eslint-disable-next-line no-useless-catch
        try {
            await this.logModel.ADD_NOTE(data);
        } catch (err) {
            throw err;
        }
    }

    async updateNote(data) {
      // eslint-disable-next-line no-useless-catch
        try {
            await this.logModel.UPDATE_NOTE(data);
        } catch (err) {
            throw err;
        }
    }

    async moveNote(data) {
      // eslint-disable-next-line no-useless-catch
        try {
            await this.logModel.MOVE_NOTE(data);
        } catch (err) {
            throw err;
        }
    }

    async removeNote(data) {
      // eslint-disable-next-line no-useless-catch
        try {
            await this.logModel.REMOVE_NOTE(data);
        } catch (err) {
            throw err;
        }
    }

    async addColumn(data) {
      // eslint-disable-next-line no-useless-catch
        try {
            await this.logModel.ADD_COLUMN(data);
        } catch (err) {
            throw err;
        }
    }

    async updateColumn(data) {
      // eslint-disable-next-line no-useless-catch
        try {
            await this.logModel.UPDATE_COLUMN(data);
        } catch (err) {
            throw err;
        }
    }

    async removeColumn(data) {
      // eslint-disable-next-line no-useless-catch
        try {
            return await this.logModel.REMOVE_COLUMN(data);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = LogService;
