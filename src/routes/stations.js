const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, code FROM stations ORDER BY name');
  res.json(rows);
});

module.exports = router;
