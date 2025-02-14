const express = require('express');
const pool = require('./database/database'); // database.js에서 pool 불러오기

const app = express();
const port = 8000;

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // pool.query로 수정
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data from PostgreSQL', err);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
