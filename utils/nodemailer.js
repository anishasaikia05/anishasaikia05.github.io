const nodemailer = require('nodemailer');
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const mail = async (email, filePath) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  }); 
  
  const options = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Invoice of your donation to PawsN\'Claws',
    text: 'Thank you for your donation',
    attachments: [{
      filename: 'invoice.pdf',
      path: filePath,
      contentType: 'application/pdf'
    }]
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(options, async (err, info) => {
      // Remove file from local storage
      // await unlinkAsync(filePath)
      if(err) {
        console.log(err.message);
        reject();
      } else {
        console.log("sent: " + info.response);
        resolve();
      }
    })
  });
}

module.exports = mail;
