const nodemailer = require('nodemailer');

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

  // new Promise((resolve, reject) => {
  //   transporter.sendMail(options, (err, info) => {
  //     if(err) {
  //       reject(err.message);
  //     } else {
  //       console.log("sent: " + info.response);
  //       resolve(info.response);
  //     }
  //   })
  // })
let flag = 0;
 await transporter.sendMail(options, (err, info) => {
    if(err) {
      console.log("Hey There");
      // return 0;
    } else {
      console.log("sent: " + info.response);
      flag = 1;
    }
  })

return flag;
}

module.exports = mail;
