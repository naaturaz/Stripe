
var nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manuel.lopez@industrycorp.ca',
    pass: 'Ant2014@'
  }
});

var id = uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'

var mailOptions = {
  from: 'manuel.lopez@industrycorp.ca',
  to: 'naaturaz@gmail.com',
  subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
  html: '<h1>Welcome</h1><p>That was easy!</p><a href="http://localhost:8080/?id='+id+'">Click here to open google.com</a>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

// https://stackoverflow.com/questions/26196467/sending-email-via-node-js-using-nodemailer-is-not-working

// For those who actually want to use OAuth2 / don't want to make the app "less secure", you can achieve this by

// Search "Gmail API" from the google API console and click "Enable"
// Follow the steps at https://developers.google.com/gmail/api/quickstart/nodejs. In the quickstart.js file, changing the SCOPES var from ['https://www.googleapis.com/auth/gmail.readonly'] to ['https://mail.google.com/'] in the quickstart js file provided as suggested in troubleshooting at https://nodemailer.com/smtp/oauth2/
// After following the steps in (2), the generated JSON file will contain the acessToken, refreshToken, and expires attributes needed in the OAuth2 Examples for Nodemailer
// This way you can use OAuth2 authentication like the following

// let transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         type: 'OAuth2',
//         user: 'user@example.com',
//         clientId: '000000000000-xxx0.apps.googleusercontent.com',
//         clientSecret: 'XxxxxXXxX0xxxxxxxx0XXxX0',
//         refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
//         accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
//         expires: 1484314697598
//     }
// });