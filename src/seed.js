const pool = require('./db');

const STATIONS = [
  { name: 'Roma Termini', code: 'ROM' },
  { name: 'Milano Centrale', code: 'MIL' },
  { name: 'Napoli Centrale', code: 'NAP' },
  { name: 'Firenze SMN', code: 'FIR' },
  { name: 'Venezia Santa Lucia', code: 'VEN' },
  { name: 'Torino Porta Nuova', code: 'TOR' },
  { name: 'Bologna Centrale', code: 'BOL' },
  { name: 'Genova Piazza Principe', code: 'GEN' },
  { name: 'Palermo Centrale', code: 'PAL' },
  { name: 'Bari Centrale', code: 'BAR' },
];

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(5) UNIQUE NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tickets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      train_number VARCHAR(20),
      train_type VARCHAR(20),
      source_station_id INT NOT NULL REFERENCES stations(id),
      destination_station_id INT NOT NULL REFERENCES stations(id),
      departure_date DATE NOT NULL,
      departure_time TIME NOT NULL,
      customer_first_name VARCHAR(100) NOT NULL,
      customer_last_name VARCHAR(100) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  for (const s of STATIONS) {
    await pool.query(
      'INSERT INTO stations (name, code) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
      [s.name, s.code]
    );
  }

  console.log('Seed complete — stations inserted.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
