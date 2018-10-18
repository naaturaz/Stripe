const http = require('http');
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        // Handle post info...

        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        var stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

        console.log("req: " + req);


        // // Token is created using Checkout or Elements!
        // // Get the payment token ID submitted by the form:
        // const token = req.body.stripeToken; // Using Express

        // const charge = stripe.charges.create({
        //   amount: 999,
        //   currency: 'usd',
        //   description: 'Example charge',
        //   source: token,
        // });

        // console.log(charge);

        // res.end("<div>" + req + "</div>");

    }
    else {
      res.end(`
        <!doctype html>
        <html>
        <body>
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
server.listen(3000);
console.log("server.listen(3000)");