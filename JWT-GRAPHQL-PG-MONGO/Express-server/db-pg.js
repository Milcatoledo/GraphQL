require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(connectionString ? { connectionString } : {
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'postgres',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
});

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS personas (
      id SERIAL PRIMARY KEY,
      dni TEXT NOT NULL UNIQUE,
      nombres TEXT NOT NULL,
      apellidos TEXT NOT NULL
    );
  `);
}

async function testConnection() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (e) {
    console.error('Postgres connection error', e);
    throw e;
  }
}

module.exports = { pool, ensureTables, testConnection };
