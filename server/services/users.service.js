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
      // eslint-disable-next-line no-useless-catch
        try{
            return await this.usersModel.SELECT_ALL();
        }catch(err){
            throw err;
        }
    }

    async findOne(userId) {
      // eslint-disable-next-line no-useless-catch
        try {
            return await this.usersModel.SELECT(userId);
        } catch (err) {
            throw err;
        }
    }

    async getColumns(userId) {
      // eslint-disable-next-line no-useless-catch
        try {
            const columns = await this.columnsModel.SELECT_ALL(userId);

            for (let i = 0; i < columns.length; i+=1 ){
              // eslint-disable-next-line no-await-in-loop
                const noteList = await this.noteModel.SELECT_ALL(columns[i].id);
              // eslint-disable-next-line no-use-before-define
                columns[i].list = getOrderList(columns[i], noteList);
            }
            return columns;
        } catch (err) {
            throw err;
        }
    }

    async create(usersDTO) {
      // eslint-disable-next-line no-useless-catch
        try {
          // eslint-disable-next-line no-param-reassign,no-use-before-define
            usersDTO.password = await getHash(usersDTO.password);
            const insertId = await this.usersModel.INSERT(usersDTO);
            const basicColumns = [ "To Do", "Doing", "Done"];
          // eslint-disable-next-line no-restricted-syntax
            for (const b of basicColumns) {
                console.log(insertId);
                const columnDTO = {
                    user_id: insertId,
                    name: b
                }
              // eslint-disable-next-line no-await-in-loop
                await this.columnsModel.INSERT(columnDTO);
            }
            return insertId;
        } catch (err) {
            throw err;
        }
    }

    async checkValid(loginForm) {
      // eslint-disable-next-line no-useless-catch
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
                return { isLogin: true, id: user.id, userName: user.name}
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
          // eslint-disable-next-line no-shadow
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
          // eslint-disable-next-line no-loop-func
            node = noteList.find(c => c.id === node.next_note);
            list.push(node);
        }
    }
    return list;
}

module.exports = UsersService;
