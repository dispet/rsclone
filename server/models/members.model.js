const mysql = require('mysql2');
const DBconfig = require('../config/DBconfig');

const connection = mysql.createConnection(DBconfig);

class MembersModel {
  constructor() {
  }

  SELECT_ALL() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Members ";
      connection.query(query,  (err, rows, fields) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      })
    })
  }

  SELECT(memberId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Members where user_id = ?";
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
        // const insertId = rows.insertId;
        resolve(rows);
      })
    })
  }
}

module.exports = MembersModel;


