const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017/";
const fs = require('fs');
const jQuery = require("jquery");

http.createServer(function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write(req.url);
    // res.write("<br>");

    //parsing url
    let q = url.parse(req.url, true).query;
    let txt = "Id: " + q.id;
    // res.write(txt);

    // res.write("<br>");

    if(!q.id)
    {
        console.error("q.id needed");
        return;
    }

    _handleFindCustomer(q.id, res);
  
}).listen(8080);

console.log("listen(8080) ex url: http://localhost:8080/?id=2017aad-asd-87pp-arr");

let _handleFindCustomer = function(idParam, res)
{
    _findCustomer(idParam, function(cust)
    {
        if(cust)
        {
            if(!cust.emailConfirmed)
            {
                _confirmCustEmail(idParam, function(id){
                    if(id)
                    {
                        // res.end('Email Confirmed! :' + id);
                        _returnLoginPage(id, res);
                    }
                    else res.end('Something happened');
                });
            }
            else res.end('This Email is already confirmed');
        }
    });
};

let _returnLoginPage = function(id, res)
{


    res.end("login page");

    // res.writeHead(301,
    //     {Location: 'file:///C:/Users/USER/Desktop/Stripe/login.html'}
    //   );
    // res.end();



    // jQuery(res).find("#hiddenId").val(id);

    // fs.appendFile('login.html', '<div id="visibleId">ID: '+id+'</div>', function (err) {
    //     if (err) throw err;
    //     console.log('Updated!');
    // });

    // fs.readFile('login.html', function(err, data) {
    //     res.writeHead(200, {'Content-Type': 'text/html'});

    //     res.write(data);
    //     res.end();
    // });
};

let _findCustomer = function(id, callback)
{
    MongoClient.connect(mongoUrl, function(err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");

      let query = { "id": id };
      dbo.collection("customers").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();

        if(result.length>0)
        return callback( result[0] );
        else
        return callback( undefined );
      });
    });
};

let _confirmCustEmail = function(id, callback)
{
    MongoClient.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    let myquery = { "id": id };
    let newvalues = { $set: {emailConfirmed: true } };
    dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(id, "email confirmed");
            db.close();

            return callback(id);
        });
    });
};