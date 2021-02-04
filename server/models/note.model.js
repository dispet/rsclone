const mysql = require('mysql2');
const DBconfig = require('../config/DBconfig');

const connection = mysql.createConnection(DBconfig);

class NoteModel {
    constructor() { }

    SELECT_ALL(columnsId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT n.id, n.columns_id, n.content, n.next_note, n.members, n.label,n.background, n.color, u.name AS addedBy FROM Note n JOIN Users u ON n.addedBy = u.id WHERE n.columns_id = ?";
            connection.query(query, columnsId, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            })
        })
    }

    SELECT(noteId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT n.id, n.columns_id, n.content, n.next_note, n.members, n.label,n.background, n.color, u.name AS addedBy FROM Note n JOIN Users u ON n.addedBy = u.id WHERE n.id = ?";
            connection.query(query, noteId, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            })
        })
    }

    SELECT_PREV(noteId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Note WHERE next_note = ?";
            connection.query(query, noteId, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            })
        })
    }

    SELECT_LAST(columnsId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Note WHERE next_note IS NULL AND columns_id = ?";
            connection.query(query, columnsId, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            })
        })
    }

    INSERT(noteDTO) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO Note(columns_id, content, addedBy) VALUES(?,?,?)";
            const params = [noteDTO.columns_id, noteDTO.content, noteDTO.addedBy];
            connection.execute(query, params, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const insertId = rows.insertId;
                resolve(insertId);
            })
        })
    }


    UPDATE(noteDTO) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE Note SET content=? WHERE id = ?";
            const params = [noteDTO.content,noteDTO.id];
            connection.execute(query, params, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const changedRows = rows.changedRows;
                resolve(changedRows);
            })
        })
    }

    UPDATE_LABEL(noteDTO) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE Note SET todolist.Note.label = ? WHERE id = ?";
            const params = [noteDTO.label,noteDTO.id];
            connection.execute(query, params, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const changedRows = rows.changedRows;
                resolve(changedRows);
            })
        })
    }

    UPDATE_COLOR(noteDTO) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE Note SET todolist.Note.color = ? WHERE id = ?";
            const params = [noteDTO.color,noteDTO.id];
            connection.execute(query, params, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const changedRows = rows.changedRows;
                resolve(changedRows);
            })
        })
    }

    UPDATE_BACKGROUND(noteDTO) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE Note SET todolist.Note.background = ? WHERE id = ?";
            const params = [noteDTO.background,noteDTO.id];
            connection.execute(query, params, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const changedRows = rows.changedRows;
                resolve(changedRows);
            })
        })
    }

    ADDMEMBER(noteDTO) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE Note SET members=? WHERE id = ?";
            const params = [noteDTO.member,noteDTO.id];
            connection.execute(query, params, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const changedRows = rows.changedRows;
                resolve(changedRows);
            })
        })
    }

    UPDATE_NODE(noteDTO) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE Note SET columns_id=?, next_note=? WHERE id = ?";
            const params = [noteDTO.columns_id, noteDTO.next_note, noteDTO.id];
            connection.execute(query, params, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const changedRows = rows.changedRows;
                resolve(changedRows);
            })
        })
    }

    DELETE(noteId) {
        return new Promise((resolve, reject) => {

            const query = "DELETE FROM Note WHERE id = ?";
            connection.query(query, noteId, (err, rows, fields) => {
                if (err) {
                    reject(err);
                }
                const affectedRows = rows.rowsAffected;
                resolve(affectedRows);
            })
        })
    }
}

module.exports = NoteModel;


