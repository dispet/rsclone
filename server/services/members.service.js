const MembersModel = require('../models/members.model')

class MembersService {
  constructor() {
    this.membersModel = new MembersModel();
  }

  async findAll(userId) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.membersModel.SELECT_ALL(userId);
    } catch (err) {
      throw err;
    }
  }

  async findOne(memberId) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.membersModel.SELECT(memberId);
    } catch (err) {
      throw err;
    }
  }

  async create(membersDTO) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.membersModel.INSERT(membersDTO);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = MembersService;
