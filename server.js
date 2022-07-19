const express = require("express");
//const people = require("./people.json"); //we are using MongoDB instead of json file
const MongoClient = require('mongodb').MongoClient;; 
const app = express();
const dbDetails = require("./database");  //This has connection url and db name only.
app.set("view engine", "pug");
// serve static files from the `public` folder
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {

//****************** */
MongoClient.connect(dbDetails.url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbDetails.database);
  dbo.collection(dbDetails.collection).find({}).toArray(function(err, result)  {
    if (err) throw err;
   
    

    const person = result.find(p => p.id === req.query.id);
    res.render("index", {
      title: "Homepage",
      people: result
    });


    db.close();
  });
});

 
});


app.get("/profile", (req, res) => {

//****************** */
MongoClient.connect(dbDetails.url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbDetails.database);
  dbo.collection(dbDetails.collection).find({}).toArray(function(err, result)  {
    if (err) throw err;
   
    

    const person = result.find(p => p.id === req.query.id);
    res.render("profile", {
      title: `About ${person.firstname} ${person.lastname}`,
      person
    });


    db.close();
  });
});
//********************* */


});




const server = app.listen(process.env.PORT || 7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
