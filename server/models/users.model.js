const mysql = require('mysql2');
const DBconfig = require('../config/DBconfig');

const connection = mysql.createConnection(DBconfig);

class UserModel {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
    constructor(){}

    SELECT(userId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users where id = ?";
            connection.query(query, userId, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            })
        })
    }

    SELECT_BY_EMAIL(email) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users where email = ?";
            connection.query(query, email, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            })
        })
    }

    INSERT(usersDTO) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO Users(email, password, name, phone) VALUES(?,?,?,?)";
            const params = [usersDTO.email, usersDTO.password, usersDTO.name, usersDTO.phone];
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

module.exports = UserModel;


