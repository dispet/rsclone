const mysql = require('mysql2');
const DBconfig = require('../config/DBconfig');

const connection = mysql.createConnection(DBconfig);

class MembersModel {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor() {
  }

  SELECT_ALL(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Members where id = ?";
      connection.query(query, userId, (err, rows, fields) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      })
    })
  }

  SELECT(memberId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Members where id = ?";
      connection.query(query, memberId, (err, rows, fields) => {
        if (err) {
          reject(err);
        }
        resolve(rows[0]);
      })
    })
  }

  SELECT_BY_EMAIL(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Members where email = ?";
      connection.query(query, email, (err, rows, fields) => {
        if (err) {
          reject(err);
        }
        resolve(rows[0]);
      })
    })
  }

  INSERT(membersDTO) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO Members(email, name, user_id) VALUES(?,?,?)";
      const params = [membersDTO.email, membersDTO.name, membersDTO.user_id];
      connection.execute(query, params, (err, rows, fields) => {
        if (err) {
          reject(err);
        }
        const insertId = rows.insertId;
        resolve(insertId);
      })
    })
  }
}

module.exports = MembersModel;


