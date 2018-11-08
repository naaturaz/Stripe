var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(req.url);
    res.write("<br>");

    //parsing url
    var q = url.parse(req.url, true).query;
    var txt = "Id: " + q.id;
    res.write(txt);

    res.write("<br>");

    if(!q.id)
    {
        console.error("q.id needed");
        return;
    }

    findCustomer(q.id, function(cust)
    {

        if(cust)
        {
            if(!cust.emailConfirmed)
            {
                confirmCustEmail(q.id, function(id){
                    if(id)
                    {
                        res.end('Email Confirmed! :' + id);
                    }
                    else
                    {
                        res.end('Something happened');

                    }
                });
            }
            else
            {
                res.end('This Email is used already');
            }
        }

    });
}).listen(8080);

console.log(":listen(8080)");
// http://localhost:8080/?id=2017asad-asd-87pp


var MongoClient = require('mongodb').MongoClient;
var findCustomer = function(id, callback)
{

    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");

      var query = { "id": id };
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

var confirmCustEmail = function(id, callback)
{
    var url = "mongodb://127.0.0.1:27017/";

    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { "id": id };
    var newvalues = { $set: {emailConfirmed: true } };
    dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(id, "email confirmed");
            db.close();

            return callback(id);
        });
    });
};