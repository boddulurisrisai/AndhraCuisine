// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/chat', chatRoutes);
app.get('/test', async (req, res) => {
    try {
      // Attempt to fetch data or perform a simple query
      const result = await mongoose.connection.db.collection('yourCollectionName').findOne({});
      res.status(200).json({ message: 'MongoDB is connected!', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Error connecting to MongoDB', error });
    }
  });
module.exports = app;
