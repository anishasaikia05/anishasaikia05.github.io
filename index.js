const express = require('express');
const app = express();
const cors = require('cors');

// load config
const dotenv = require('dotenv').config({ path: '.env' });
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')));


// import routes
const donate = require('./routes/donate');

const connectDB = require('./config/db');

// middleware
app.use(express.json());
app.use(cors());

const start = async () => {
  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if(!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined');
  } 

  try {
    await connectDB();
  } catch (error) {
    console.log(err);
  }

  // use routes
  app.use(donate);

  app.all('*', async (req, res, next) => {
    return res.status(404).json({ success: 'false', error: 'Route not found' });
  });

  port = process.env.HOST || 8080;
  app.listen(port, console.log(`Listening on port ${port}`));

}

start();

