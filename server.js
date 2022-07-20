const express = require("express");
//const people = require("./people.json"); //we are using MongoDB instead of json file
const MongoClient = require('mongodb').MongoClient;; 
const app = express();
const dbDetails = require("./database");  //This has connection url and db name only.
const multer  =   require('multer');  
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    console.log("**********");
    console.log(req.body);
    cb(null, req.body.id + '.jpg')
  }
})

const upload = multer({ storage: storage })


app.set("view engine", "pug");
// serve static files from the `public` folder
app.use(express.static(__dirname + "/public"));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


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

app.get("/addProfileForm", (req, res) => {
  res.render("addProfileForm", {
    title: `Add New profile`,
   
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


// Handling data after submission of form
app.post("/feedback_form", upload.single('avatar'),function (req, res1) {
  //console.log(req);
  var myobj = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
      tagline: req.body.tagline,
      link: req.body.link,
      id: req.body.id,
      
  };
  MongoClient.connect(dbDetails.url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbDetails.database);
    dbo.collection(dbDetails.collection).insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      res1.render('addProfileForm',
      { msg: "profile successfully saved." });
           
      db.close();
    })
    
    });
  }); 
  
    

const server = app.listen(process.env.PORT || 7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
