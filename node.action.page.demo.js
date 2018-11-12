const http = require('http');
const qs = require('querystring');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const MongoClient = require('mongodb').MongoClient;
const passwordHash = require('password-hash');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        // Handle post info...

        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        let stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

        let body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            let post = qs.parse(body);
            // use post['blah'], etc.
            console.log(post.stripeToken);

            //adding to DB
            if(post.nameInput)
            {
                let id = uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'

                _dbCreateRecord({
                    "id": id, 
                    "name": post.nameInput, 
                    "address": post.addressInput, 
                    "email": post.emailInput,
                    "password": passwordHash.generate(post.passwordInput),
                });

                _sendConfirmEmail(id);
                return;
            }

            //login
            if(post.passwordInputLogin)
            {
                let hashedPassword = 'sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97';
                
                console.log(post.passwordInputLogin);
                console.log(passwordHash.verify('password123', hashedPassword)); // true
                console.log(passwordHash.verify('Password0', hashedPassword)); // false

                return;
            }

            // Token is created using Checkout or Elements!
            // Get the payment token ID submitted by the form:
            const token = post.stripeToken[1]; 

            const charge = stripe.charges.create({
                amount: 999,
                currency: 'usd',
                description: 'Example charge',
                source: token,
            }, function(err, data){ 
                console.log("errdata", err, data);
            });

            console.log(charge);
        });

    }
    else {
      res.end(`
        <!doctype html>
        <html>
        <body>
            Please access the local index.html
            <form action="/" method="post">
                <input type="text" name="fname" /><br />
                <input type="number" name="age" /><br />
                <input type="file" name="photo" /><br />
                <button>Save</button>
            </form>
        </body>
        </html>
      `);
    }
});

//db
let url = "mongodb://localhost:27017/";
let _dbCreateRecord = function(obj)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db("mydb");
        // let myobj = { name: "Company Inc CC", address: "Highway 37 CC" };


        dbo.collection("customers").insertOne(obj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
    });
};

//email
let _sendConfirmEmail = function(id)
{
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'manuel.lopez@industrycorp.ca',
        pass: 'Ant2014@'
      }
    });
    
    let mailOptions = {
      from: 'manuel.lopez@industrycorp.ca',
      to: 'naaturaz@gmail.com',
      subject: 'Sending Email using Node.js',
      html: '<h1>Welcome</h1><p>That was easy!</p><a href="http://localhost:8080/?id='+id+'">Click here to confirm</a>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
};

server.listen(3000);
console.log("server.listen(3000)");