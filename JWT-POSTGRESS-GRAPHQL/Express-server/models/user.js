const { pool } = require('../db');

function mapUser(row) {
  if (!row) return null;
  return {
    _id: row.id.toString(),
    nombre: row.nombre,
    apellidos: row.apellidos,
    email: row.email,
    createdAt: row.created_at ? row.created_at.toISOString() : null,
    updatedAt: row.updated_at ? row.updated_at.toISOString() : null,
    password: row.password
  };
}

module.exports = {
  find: async (filter = {}, options = {}) => {
    const { limit = 100, offset = 0 } = options;
    const res = await pool.query('SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return res.rows.map(mapUser);
  },

  findById: async (id) => {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return mapUser(res.rows[0]);
  },

  findOne: async (filter = {}) => {
    if (filter.email) {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [filter.email]);
      return mapUser(res.rows[0]);
    }
    return null;
  },

  create: async (data) => {
    const res = await pool.query(
      'INSERT INTO users (nombre, apellidos, email, password) VALUES ($1,$2,$3,$4) RETURNING *',
      [data.nombre, data.apellidos, data.email, data.password]
    );
    return mapUser(res.rows[0]);
  },

  findByIdAndUpdate: async (id, data) => {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const k of ['nombre','apellidos','email','password']) {
      if (data[k] !== undefined) {
        fields.push(`${k} = $${idx}`);
        values.push(data[k]);
        idx++;
      }
    }
    if (fields.length === 0) return module.exports.findById(id);
    values.push(id);
    const q = `UPDATE users SET ${fields.join(', ')}, updated_at = now() WHERE id = $${idx} RETURNING *`;
    const res = await pool.query(q, values);
    return mapUser(res.rows[0]);
  },

  findByIdAndDelete: async (id) => {
    const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return mapUser(res.rows[0]);
  },

  findByIds: async (ids) => {
    if (!ids || !ids.length) return [];
    const q = `SELECT * FROM users WHERE id = ANY($1::int[])`;
    const res = await pool.query(q, [ids.map(id => parseInt(id,10))]);
    return res.rows.map(mapUser);
  }
};
