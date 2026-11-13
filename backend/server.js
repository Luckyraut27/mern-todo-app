require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const taskRoutes = require('./src/routes/taskRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();

const origins = (process.env.CLIENT_ORIGIN || '*').split(',').map((o) => o.trim());
app.use(cors({ origin: origins.includes('*') ? true : origins }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ success: true, message: 'To-Do API is running' }));
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
