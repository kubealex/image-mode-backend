const express = require('express');
const cors = require('cors');
const stationsRouter = require('./routes/stations');
const trainsRouter = require('./routes/trains');
const ticketsRouter = require('./routes/tickets');
const healthRouter = require('./routes/health');
const schemaRouter = require('./routes/schema');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/stations', stationsRouter);
app.use('/api/trains', trainsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/health', healthRouter);
app.use('/api/schema', schemaRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
