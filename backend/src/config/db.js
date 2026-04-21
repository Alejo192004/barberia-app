const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'barberia',
  password: '1035971477',
  port: 5432,
});

module.exports = pool;