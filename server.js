/**
 * Created by Maziar on 11/25/2015.
 */


var http = require("http");
if (! http) process.exit(1);

var productsList = [
    {"KeyboardCombo":{"price":31,"quantity":3,"url":"https://cpen400a.herokuapp.com/images/KeyboardCombo.png"},
        "Mice":{"price":7,"quantity":5,"url":"https://cpen400a.herokuapp.com/images/Mice.png"},
        "PC1":{"price":316,"quantity":9,"url":"https://cpen400a.herokuapp.com/images/PC1.png"},
        "PC2":{"price":383,"quantity":6,"url":"https://cpen400a.herokuapp.com/images/PC2.png"},
        "PC3":{"price":372,"quantity":7,"url":"https://cpen400a.herokuapp.com/images/PC3.png"},
        "Tent":{"price":33,"quantity":0,"url":"https://cpen400a.herokuapp.com/images/Tent.png"},
        "Box1":{"price":5,"quantity":1,"url":"https://cpen400a.herokuapp.com/images/Box1.png"},
        "Box2":{"price":5,"quantity":5,"url":"https://cpen400a.herokuapp.com/images/Box2.png"},
        "Clothes1":{"price":21,"quantity":2,"url":"https://cpen400a.herokuapp.com/images/Clothes1.png"},
        "Clothes2":{"price":30,"quantity":3,"url":"https://cpen400a.herokuapp.com/images/Clothes2.png"},
        "Jeans":{"price":30,"quantity":6,"url":"https://cpen400a.herokuapp.com/images/Jeans.png"},
        "Keyboard":{"price":21,"quantity":4,"url":"https://cpen400a.herokuapp.com/images/Keyboard.png"}}
];

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/maindb';

var updateProductsinDB = function(db, callback) {
    db.collection('products').remove( { } );
    db.collection('products').insert(productsList[0]
        , function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the products collection.");
        callback(result);
    });


};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.createCollection('orders', function(err, collection) {});
    db.createCollection('users', function(err, collection) {});

    updateProductsinDB(db, function() {
        db.close();
    });
});

var serveRequest = function(request, response) {
    if ( request.url.startsWith("/products") ) {
        var json = JSON.stringify(productsList[0]);
        console.log(json);
        response.write(json);
        response.statusCode = 404;
        response.end();
    } else if (request.url.startsWith("/cart")) {
         jsonRespose = request;
         jsonCart = responceToCard(jsonRespose);
         jsonPrice = responceToPrice(jsonRespose);
        db.collection('products').insert({
                "cart" : jsonCart,
                "total" : jsonPrice
            }
            , function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the products collection.");
                callback(result);
            });

        var cart = jsonCart;
        for (p1 in cart) {
            for (p2 in products) {
        }
            if (p1 == p2) {
                if (products[p2]['quantity']){
                    products[p2]['quantity'] -= cart[p1];
                }

            }
            updateProductsinDB(db, function() {
                db.close();
            });

    } else {
        response.write("Unknown request " + request.url);
        response.statusCode = 404;
        response.end();
    }

};


// Start the server on the port and setup response
var port = 8080;
var server = http.createServer(serveRequest);
server.listen(port);
console.log("Starting server on port " + port);