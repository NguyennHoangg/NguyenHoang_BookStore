const {query} = require("../config/database.config");

const findByCredential = async (credential) => {
    const sql = "SELECT userid, email, passwordhash, fullname, phone, address, dob, gender, role, isactive FROM users " +
     "JOIN accounts ON users.accountid = accounts.accountid " +
     "WHERE accounts.email = $1";
    const values = [credential];
    const result = await query(sql, values);
    return result.rows[0];
}


module.exports = { findByCredential };