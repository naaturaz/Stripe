const http = require('http');

var qs = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        // Handle post info...

        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        var stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            // use post['blah'], etc.
            console.log(post.stripeToken);



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

            // res.end("<div>" + req + "</div>");

        });

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