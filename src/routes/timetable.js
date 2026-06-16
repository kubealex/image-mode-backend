const { Router } = require('express');
const pool = require('../db');

const router = Router();

const TRAINS = [
  { id: 1,  train_number: 'FR 9601', train_type: 'Frecciarossa',  departure_time: '06:00', arrival_time: '08:55', base_price: 89.90 },
  { id: 2,  train_number: 'FR 9603', train_type: 'Frecciarossa',  departure_time: '08:30', arrival_time: '11:25', base_price: 89.90 },
  { id: 3,  train_number: 'FA 9611', train_type: 'Frecciargento', departure_time: '07:15', arrival_time: '10:45', base_price: 69.90 },
  { id: 4,  train_number: 'FR 9605', train_type: 'Frecciarossa',  departure_time: '12:00', arrival_time: '14:55', base_price: 79.90 },
  { id: 5,  train_number: 'IC 601',  train_type: 'Intercity',     departure_time: '09:00', arrival_time: '14:30', base_price: 45.00 },
  { id: 6,  train_number: 'FR 9607', train_type: 'Frecciarossa',  departure_time: '16:00', arrival_time: '18:55', base_price: 89.90 },
  { id: 7,  train_number: 'R 2101',  train_type: 'Regionale',     departure_time: '06:30', arrival_time: '11:15', base_price: 15.50 },
  { id: 8,  train_number: 'IC 701',  train_type: 'Intercity',     departure_time: '14:00', arrival_time: '19:30', base_price: 38.00 },
  { id: 9,  train_number: 'FR 9609', train_type: 'Frecciarossa',  departure_time: '19:00', arrival_time: '21:55', base_price: 79.90 },
  { id: 10, train_number: 'R 2201',  train_type: 'Regionale',     departure_time: '10:00', arrival_time: '14:45', base_price: 18.50 },
];

const ROUTES = [
  { source: 'ROM', destination: 'MIL', trains: [1, 2, 4, 6, 9] },
  { source: 'MIL', destination: 'ROM', trains: [1, 2, 4, 6, 9] },
  { source: 'ROM', destination: 'NAP', trains: [3, 5, 7] },
  { source: 'NAP', destination: 'ROM', trains: [3, 5, 7] },
  { source: 'ROM', destination: 'FIR', trains: [2, 3, 10] },
  { source: 'FIR', destination: 'ROM', trains: [2, 3, 10] },
  { source: 'MIL', destination: 'VEN', trains: [5, 8, 10] },
  { source: 'VEN', destination: 'MIL', trains: [5, 8, 10] },
  { source: 'MIL', destination: 'TOR', trains: [7, 8] },
  { source: 'TOR', destination: 'MIL', trains: [7, 8] },
  { source: 'BOL', destination: 'ROM', trains: [4, 6] },
  { source: 'ROM', destination: 'BOL', trains: [4, 6] },
  { source: 'GEN', destination: 'MIL', trains: [7, 10] },
  { source: 'MIL', destination: 'GEN', trains: [7, 10] },
  { source: 'ROM', destination: 'BAR', trains: [5, 8] },
  { source: 'BAR', destination: 'ROM', trains: [5, 8] },
  { source: 'PAL', destination: 'NAP', trains: [5, 7] },
  { source: 'NAP', destination: 'PAL', trains: [5, 7] },
];

router.get('/', async (req, res) => {
  const { rows: stations } = await pool.query('SELECT id, name, code FROM stations ORDER BY name');
  const stationByCode = {};
  for (const s of stations) {
    stationByCode[s.code] = s;
  }

  const trainById = {};
  for (const t of TRAINS) {
    trainById[t.id] = t;
  }

  const timetable = [];
  for (const route of ROUTES) {
    const from = stationByCode[route.source];
    const to = stationByCode[route.destination];
    if (!from || !to) continue;

    for (const trainId of route.trains) {
      const train = trainById[trainId];
      if (!train) continue;
      timetable.push({
        train_number: train.train_number,
        train_type: train.train_type,
        departure_time: train.departure_time,
        arrival_time: train.arrival_time,
        base_price: train.base_price,
        source_station: from.name,
        source_code: from.code,
        destination_station: to.name,
        destination_code: to.code,
      });
    }
  }

  timetable.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
  res.json(timetable);
});

module.exports = router;
