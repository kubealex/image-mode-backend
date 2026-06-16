const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.post('/', async (req, res) => {
  const {
    train_number,
    train_type,
    source_station_id,
    destination_station_id,
    departure_date,
    departure_time,
    customer_first_name,
    customer_last_name,
    customer_email,
    price,
  } = req.body;

  if (
    !source_station_id ||
    !destination_station_id ||
    !departure_date ||
    !departure_time ||
    !customer_first_name ||
    !customer_last_name ||
    !customer_email ||
    price == null
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO tickets
       (train_number, train_type, source_station_id, destination_station_id, departure_date, departure_time,
        customer_first_name, customer_last_name, customer_email, price)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      train_number || null,
      train_type || null,
      source_station_id,
      destination_station_id,
      departure_date,
      departure_time,
      customer_first_name,
      customer_last_name,
      customer_email,
      price,
    ]
  );

  res.status(201).json(rows[0]);
});

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT t.*,
           s1.name AS source_station_name,
           s2.name AS destination_station_name
    FROM tickets t
    JOIN stations s1 ON t.source_station_id = s1.id
    JOIN stations s2 ON t.destination_station_id = s2.id
    ORDER BY t.created_at DESC
  `);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT t.*,
            s1.name AS source_station_name,
            s2.name AS destination_station_name
     FROM tickets t
     JOIN stations s1 ON t.source_station_id = s1.id
     JOIN stations s2 ON t.destination_station_id = s2.id
     WHERE t.id = $1`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM tickets WHERE id = $1', [req.params.id]);

  if (rowCount === 0) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.status(204).end();
});

module.exports = router;
