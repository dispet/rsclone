const MembersModel = require('../models/members.model')

class MembersService {
  constructor() {
    this.membersModel = new MembersModel();
  }

  async findAll(userId) {
    try {
      return await this.membersModel.SELECT_ALL(userId);
    } catch (err) {
      throw err;
    }
  }

  async findOne(memberId) {

    try {
      return await this.membersModel.SELECT(memberId);
    } catch (err) {
      throw err;
    }
  }

  async create(membersDTO) {
    try {
      return await this.membersModel.INSERT(membersDTO);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = MembersService;
