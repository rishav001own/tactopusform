require("dotenv").config();
const Express = require("express");
const BodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const port=5000;
const CONNECTION_URL = process.env.MONGOURI; 

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/forming", (request, response) => {
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = request.body;
        dbo.collection("slots").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          response.send("1 doucment inserted")
          db.close();
        });
      });
});

app.get("/activeslot", (req,res) => {
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { status: "active",isSlotBooked: true };
        dbo.collection("slots").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });
})

app.get("/inactiveslot", (req,res) => {
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { status: "inactive",isSlotBooked: false };
        dbo.collection("slots").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });
})
app.put("/activeslot/changetoinactiveslot/:id",(req,res) =>{
    console.log(req.params.id)
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = { _id: ObjectID(req.params.id) };
        var newvalues = { $set: {status: "inactive",isSlotBooked: false} };
        dbo.collection("slots").updateOne(myquery, newvalues, function(err, re) {
          if (err) throw err;
          console.log("1 document updated");
          res.send(re);
          db.close();
        });
      });
} )
app.put("/inactiveslot/changetoactiveslot/:id",(req,res) =>{
    console.log(req.params.id)
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = { _id: ObjectID(req.params.id) };
        var newvalues = { $set: {status: "active",isSlotBooked: true} };
        dbo.collection("slots").updateOne(myquery, newvalues, function(err, re) {
          if (err) throw err;
          console.log("1 document updated");
          res.send(re);
          db.close();
        });
      });
} )

app.get("/bookedslot", (req,res) => {
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { "isSlotBooked": true };
        dbo.collection("slots").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });
})
app.get("/notbookedslot", (req,res) => {
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { "isSlotBooked": false };
        dbo.collection("slots").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });
})

app.put("/notbookedslot/:id",(req,res) =>{
    console.log(req.params.id)
    MongoClient.connect(CONNECTION_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = { _id: ObjectID(req.params.id) };
        var newvalues = { $set: { isSlotBooked: true, caretaker: req.body } };
        dbo.collection("slots").updateOne(myquery, newvalues, function(err, re) {
          if (err) throw err;
          console.log("1 document updated");
          res.send(re);
          db.close();
        });
      });
} )


app.listen(port, (request, respond) => {
    console.log(`Our server is live on ${port}. Yay!`);
  });