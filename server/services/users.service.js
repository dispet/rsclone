const bcrypt = require('bcrypt');
const UsersModel = require('../models/users.model')
const ColumnsModel = require('../models/columns.model')
const NoteModel = require('../models/note.model');

const saltRounds = 10; // The higher the value, the higher the cost.

class UsersService {
  constructor() {
    this.usersModel = new UsersModel();
    this.columnsModel = new ColumnsModel();
    this.noteModel = new NoteModel();
  }

  async findAll() {
    try {
      return await this.usersModel.SELECT_ALL();
    } catch (err) {
      throw err;
    }
  }

  async findAllAddedBy(addedBy) {
    try {
      return await this.usersModel.SELECT_BY_ADDEDBY(addedBy);
    } catch (err) {
      throw err;
    }
  }

  async findOne(userId) {
    try {
      return await this.usersModel.SELECT(userId);
    } catch (err) {
      throw err;
    }
  }

  async getColumns(userId) {
    try {
      const columns = await this.columnsModel.SELECT_ALL(userId);
      for (let i = 0; i < columns.length; i += 1) {

        const noteList = await this.noteModel.SELECT_ALL(columns[i].id);
        columns[i].list = getOrderList(columns[i], noteList);
      }
      return columns;
    } catch (err) {
      throw err;
    }
  }

  async create(usersDTO) {

    try {
      usersDTO.password = await getHash(usersDTO.password);
      const insertId = await this.usersModel.INSERT(usersDTO);
      if (!insertId.addedBy) {
        const basicColumns = ["To Do", "Doing", "Done"];
        for (const b of basicColumns) {
          const columnDTO = {
            user_id: insertId.id,
            name: b
          }

          await this.columnsModel.INSERT(columnDTO);
        }
      }
      return insertId.id;
    } catch (err) {
      throw err;
    }
  }

  async checkValid(loginForm) {

    try {
      const user = await this.usersModel.SELECT_BY_EMAIL(loginForm.email);
      // 1. ID check
      if (!user) {
        throw new Error('This email does not exist.')
      } else {
        // 2. Password check
        bcrypt.compare(loginForm.password, user.password, (err, isMatch) => {
          if (!isMatch)
            throw new Error('The password is incorrect.')
        });
        // 3. ID with Password If yes, add it to the session Cookie produce
        return {isLogin: true, id: user.id, userName: user.name}
      }

    } catch (err) {
      throw err;
    }
  }
}

const getHash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) reject(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) reject(err)
        resolve(hash);
      });
    });
  })
}

const getOrderList = (column, noteList) => {
  const list = [];
  if (column.head) {

    let node = noteList.find(c => c.id === column.head);
    list.push(node);
    while (node.next_note) {
      node = noteList.find(c => c.id === node.next_note);
      list.push(node);
    }
  }
  return list;
}

module.exports = UsersService;
