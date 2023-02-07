const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { body, validationResult } = require('express-validator');
const Payment = require('../models/payment');
const invoiceGenerator = require('../utils/invoice-generator');
const mail = require('../utils/nodemailer');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);
const { v4: uuidv4 } = require('uuid');

router.post('/donate',
  [ 
    body('email')
      .isEmail()
      .notEmpty()
      .withMessage('Provide a valid email ID'),
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Provide a name'),
    body('currency')
      .notEmpty()
      .withMessage('Provide a currency'),
    body('amount')
      .isFloat()
      .withMessage('Enter a valid amount'),
    body('city')
      .isString()
      .notEmpty()
      .withMessage('Provide a valid city name'),
    body('country')
      .isString()
      .notEmpty()
      .withMessage('Provide a valid country name'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ success: 'false', errors: errors.array() });
      }

      const { name, email, currency, amount, city, country } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'Donate to PawsN\'Claws',
              },
              unit_amount: amount * 100
            },
            quantity: 1
          },
        ],
        mode: 'payment',
        success_url: `http://${req.headers.host}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://${req.headers.host}/cancel.html`
      });

      db("payments")
        .insert({
          id: uuidv4(),
          name, 
          email, 
          amount: amount,
          city,
          country,
          stripeId: session.id
        })
        .then((id) => {
          res.redirect(303, session.url);
          //get user by id
          // knex('payments')
          //     .select('id', 'name', 'email', 'amount', 'city', 'country', 'stripeId', 'success', 'created_at')
          // .where({id})
          // .then((payment) => {
          //   return res.json(payment[0]);
          // })
        })
        .catch((err) => {
          // console.error(err);
          res.status(500).json({ success: false, error: err.message });
      });
    //   const payment = new Payment({
    //     name, 
    //     email, 
    //     amount: amount,
    //     city,
    //     country,
    //     stripeId: session.id
    //   });
    //   console.log(req.headers.host);
    //   await payment.save();
    //   res.redirect(303, session.url);

    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }

  });

module.exports = router;