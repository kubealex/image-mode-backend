require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stationsRouter = require('./routes/stations');
const trainsRouter = require('./routes/trains');
const ticketsRouter = require('./routes/tickets');
const healthRouter = require('./routes/health');
const schemaRouter = require('./routes/schema');
const timetableRouter = require('./routes/timetable');
const systemRouter = require('./routes/system');
const bootcStatusRouter = require('./routes/bootc-status');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/stations', stationsRouter);
app.use('/api/trains', trainsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/health', healthRouter);
app.use('/api/schema', schemaRouter);
app.use('/api/timetable', timetableRouter);
app.use('/api/system', systemRouter);
app.use('/api/bootc-status', bootcStatusRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
