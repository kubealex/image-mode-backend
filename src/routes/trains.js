const { Router } = require('express');

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

function computePrice(base, sourceId, destId) {
  const seed = (Number(sourceId) * 7 + Number(destId) * 13) % 20;
  const factor = 0.8 + (seed / 20) * 0.6;
  return Math.round(base * factor * 100) / 100;
}

router.get('/', (req, res) => {
  const { source_station_id, destination_station_id } = req.query;

  if (!source_station_id || !destination_station_id) {
    return res.json(TRAINS.map((t) => ({ ...t, price: t.base_price })));
  }

  const result = TRAINS.map((t) => ({
    ...t,
    price: computePrice(t.base_price, source_station_id, destination_station_id),
  }));

  res.json(result);
});

module.exports = router;
