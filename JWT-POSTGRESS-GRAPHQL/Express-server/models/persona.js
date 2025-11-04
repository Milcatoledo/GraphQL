const { pool } = require('../db');

function mapPersona(row) {
  if (!row) return null;
  return {
    _id: row.id.toString(),
    dni: row.dni,
    nombres: row.nombres,
    apellidos: row.apellidos
  };
}

module.exports = {
  find: async (filter = {}, options = {}) => {
    const { limit = 100, offset = 0 } = options;
    const res = await pool.query('SELECT * FROM personas ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return res.rows.map(mapPersona);
  },

  findById: async (id) => {
    const res = await pool.query('SELECT * FROM personas WHERE id = $1', [id]);
    return mapPersona(res.rows[0]);
  },

  findOne: async (filter = {}) => {
    if (filter.dni) {
      const res = await pool.query('SELECT * FROM personas WHERE dni = $1', [filter.dni]);
      return mapPersona(res.rows[0]);
    }
    return null;
  },

  create: async (data) => {
    const res = await pool.query('INSERT INTO personas (dni, nombres, apellidos) VALUES ($1,$2,$3) RETURNING *', [data.dni, data.nombres, data.apellidos]);
    return mapPersona(res.rows[0]);
  },

  findByIdAndUpdate: async (id, data) => {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const k of ['dni','nombres','apellidos']) {
      if (data[k] !== undefined) {
        fields.push(`${k} = $${idx}`);
        values.push(data[k]);
        idx++;
      }
    }
    if (fields.length === 0) return module.exports.findById(id);
    values.push(id);
    const q = `UPDATE personas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const res = await pool.query(q, values);
    return mapPersona(res.rows[0]);
  },

  findByIdAndDelete: async (id) => {
    const res = await pool.query('DELETE FROM personas WHERE id = $1 RETURNING *', [id]);
    return mapPersona(res.rows[0]);
  }
};
