const express = require('express');
const app = express();
const cors = require('cors');

// load config
const dotenv = require('dotenv').config({ path: '.env' });
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')));


// import routes
const donate = require('./routes/donate');
const success = require('./routes/success');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
 
const start = async () => {
  
  if(!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined');
  } 

  // use routes
  app.use(donate);
  app.use(success); 

  app.all('*', async (req, res, next) => {
    return res.status(404).json({ success: 'false', error: 'Route not found' });
  });
  const host  = '0.0.0.0';
  const port = process.env.PORT || 8080;
  app.listen(port, host, console.log(`Listening on port ${port}`));

}

start();