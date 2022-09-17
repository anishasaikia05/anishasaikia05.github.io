const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { body, validationResult } = require('express-validator');
const Payment = require('../models/payment');
const invoiceGenerator = require('../utils/invoice-generator');
const mail = require('../utils/nodemailer');

router.post('/donate',
  [ 
      body('token')
        .notEmpty(),
      body('email')
        .isEmail()
        .notEmpty()
        .withMessage('Provide a valid email ID'),
      body('name')
        .isString()
        .notEmpty()
        .withMessage('Provide a name'),
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

        const { token, name, email, amount, city, country } = req.body;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Donate to PawsN\'Claws',
                },
                unit_amount: amount
              },
              quantity: 1
            },
          ],
          mode: 'payment',
          success_url: `${process.env.SERVER_URL}/success.html`,
          cancel_url: `${process.env.SERVER_URL}/cancel.html`,
        });

        const payment = new Payment({
          name, 
          email, 
          amount,
          city,
          country,
          stripeId: session.id
        })

        await payment.save(async (err, doc) => {
          if(err) {
            return console.error(err); 
          }
          // console.log(doc);
          const { filePath, filename } = invoiceGenerator(doc);
          const result = await mail(email, filePath);
          if(result == 0) {
            return res.status(400).json({ success: false, message: 'Mail could not be sent but payment made' });
          }
          return res.status(200).json({ success: true, message: 'Mail sent with your invoice' }); 
        });
      } catch (e) {
        res.status(500).json({ success: false, error: e.message });
      }

  });

module.exports = router;