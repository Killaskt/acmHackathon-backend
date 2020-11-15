const nodemailer = require('nodemailer')

// const email = 'thegimreper@gmail.com';

// setting up nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'acmwaynestateuniversity@gmail.com',
      pass: 'thegiver1'
    }
})

const send_email = (em) => {
    let mailOptions = {
      from: 'acm.waynestateuniversity@gmail.com',
      to: em,
      subject: 'You\'re Registered for WSU Nexus!',
      text: 'worked, now replace this!' 
    }
  
    transporter.sendMail(mailOptions, (err, data) => {
      console.log(em)
      if (err) {
        console.log('Sending Email Error: ', err);  
        return 0;
      }
      else {
        console.log('Email Sent! ', data)
        return 1;
      }
    });
}

send_email('thegimreper@gmail.com')

  