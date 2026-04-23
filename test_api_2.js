const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'proben_admin',
  password: 'secretpassword',
  database: 'proben_mvp',
});
pool.query('SELECT * FROM subscriptions;').then(res => {
  console.log(JSON.stringify(res.rows[0]));
  pool.end();
});
