const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', async (req, res) => {
  const result = {
    status: 'ok',
    backend: { status: 'ok' },
    database: { status: 'ok' },
  };

  try {
    await pool.query('SELECT 1');
  } catch (err) {
    result.status = 'degraded';
    result.database = { status: 'error', error: err.message };
  }

  res.json(result);
});

module.exports = router;
