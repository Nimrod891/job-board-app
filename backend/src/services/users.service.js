// src/services/users.service.js
// Houses the data access logic for user records.

const db = require('../db');
const { randomUUID } = require('crypto');

/**
 * Creates a new user row with a generated UUID.
 */
async function createUser({ email, name }) {
  const id = randomUUID();
  const result = await db.query(
    `
    INSERT INTO users (id, email, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, role, created_at
    `,
    [id, email, name || null]
  );
  return result.rows[0];
}

/**
 * Finds a user by id. Returns null when no such user exists.
 */
async function getUserById(userId) {
  const result = await db.query(
    `
    SELECT id, email, name, role, created_at
    FROM users
    WHERE id = $1
    `,
    [userId]
  );
  return result.rows[0] || null;
}

module.exports = {
  createUser,
  getUserById,
};

/*
WHY THIS LAYER:
- Controllers can stay skinny and just call these helpers.
- If we ever extend users (passwords, roles), only this file and db/sql change.
*/

