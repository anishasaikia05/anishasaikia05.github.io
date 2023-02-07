const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Payment = require('../models/payment');
const invoiceGenerator = require('../utils/invoice-generator');
const mail = require('../utils/nodemailer');
const path = require('path');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

router.get('/donate/success',
    async (req, res) => {
      try {
        console.log("hiiii")
        let payment = await db("payments")
          .limit(1)
          .where({ stripeId: req.query.session_id })
          .update({ success: true }, ['id', 'name', 'email', 'amount', 'city', 'country']);
        
        payment = payment[0];
        console.log("Payment is:" , payment);
        
        // const payment = await Payment.findOne({ stripeId: req.query.session_id })
        // payment.set({
        //   success: true
        // });
        // await payment.save();

        const filePath = invoiceGenerator(payment);

        mail(payment.email, filePath).then(async () => {
          res.sendFile(path.join(__dirname,'../public/success.html'));
        }).catch(async (err) => {
          res.sendFile(path.join(__dirname,'../public/mail-not-sent.html'));
        }) 
      } catch (e) {
        res.status(500).json({ success: false, error: e.message });
      }

  });

module.exports = router;