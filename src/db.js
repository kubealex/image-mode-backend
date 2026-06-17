const { Pool } = require('pg');

const DB_HOST = process.env.DB_HOST || 'localhost';

const pool = new Pool({
  connectionString: `postgresql://postgres:postgres@${DB_HOST}:5432/train_tickets`,
});

module.exports = pool;
