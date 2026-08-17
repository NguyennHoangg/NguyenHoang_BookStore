const { query } = require("../config/database.config");

const findByCredential = async (credential) => {
  const sql =
    "SELECT users.userid, accounts.accountid, accounts.identifier, accounts.identifiervalue AS email, accounts.passwordhash, users.fullname, users.phone, users.address, users.dob, users.gender, accounts.role, accounts.isactive FROM users " +
    "JOIN accounts ON users.accountid = accounts.accountid " +
    "WHERE accounts.identifiervalue = $1";
  const values = [credential];
  const result = await query(sql, values);
  return result.rows[0];
};

const createAccount = async ({accountId, identifier, identifiervalue, passwordHash, role, createdAt, updatedAt, isActive, avatar}) => {
  try {
    await query("BEGIN");
    const insertAccountText =
      "INSERT INTO accounts (accountid, identifier, identifiervalue, passwordhash, role, createdat, updatedat, isactive, avatar) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING accountid";
    const accountValues = [
      accountId,
      identifier,
      identifiervalue,
      passwordHash,
      role,
      createdAt = new Date(),
      updatedAt = new Date(),
      isActive = true,
      avatar ? avatar : ""
    ];
    const accountResult = await query(insertAccountText, accountValues);
    const newAccountId = accountResult.rows[0].accountid;
    await query("COMMIT");
    return newAccountId;
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

const createUser = async (userId, accountId, fullName, phone, dob, gender, address) => {
  try {
    // Start transaction
    await query("BEGIN");

    // Insert into users table (bao gồm các trường optional)
    const insertUserText =
      "INSERT INTO users (userid, accountid, fullname, phone, dob, gender, address, createdat, updatedat) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING userid";

    const userValues = [
      userId,
      accountId,
      fullName,
      phone   || null,
      dob     || null,
      gender  || null,
      address || null,
    ];

    // Execute the insert and get the new user ID
    const userResult = await query(insertUserText, userValues);
    const newUserId = userResult.rows[0].userid;

    // Commit transaction
    await query("COMMIT");

    // Return the new user and account IDs
    return { userId: newUserId, accountId };
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
};

const updateLastLoginAt = async (accountId) => {
  const sql =
    "UPDATE accounts SET lastloginat = CURRENT_TIMESTAMP WHERE accountid = $1";
  await query(sql, [accountId]);
};

module.exports = { findByCredential, createAccount, createUser, updateLastLoginAt };
