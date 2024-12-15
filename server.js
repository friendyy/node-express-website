const express = require("express");
const fs = require("fs"); // To read the JSON file
const multer = require("multer");
const app = express();
// const MongoClient = require('mongodb').MongoClient; // Database code commented out
// const dbDetails = require("./database"); // Database details commented out

const people = require("./people.json"); // Import the JSON file

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    console.log("**********");
    console.log(req.body);
    cb(null, req.body.id + '.jpg');
  }
});

const upload = multer({ storage: storage });

app.set("view engine", "pug");
// serve static files from the `public` folder
app.use(express.static(__dirname + "/public"));
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // to support URL-encoded bodies

// Homepage Route
app.get("/", (req, res) => {
  // Database code commented out
  /*
  MongoClient.connect(dbDetails.url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbDetails.database);
    dbo.collection(dbDetails.collection).find({}).toArray(function(err, result) {
      if (err) throw err;

      const person = result.find(p => p.id === req.query.id);
      res.render("index", {
        title: "Homepage",
        people: result
      });

      db.close();
    });
  });
  */

  // Using JSON data instead
  res.render("index", {
    title: "Homepage",
    people: people.profiles
  });
});

// Add Profile Form Route
app.get("/addProfileForm", (req, res) => {
  res.render("addProfileForm", {
    title: `Add New Profile`,
  });
});

// Profile Page Route
app.get("/profile", (req, res) => {
  // Database code commented out
  /*
  MongoClient.connect(dbDetails.url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbDetails.database);
    dbo.collection(dbDetails.collection).find({}).toArray(function(err, result) {
      if (err) throw err;

      const person = result.find(p => p.id === req.query.id);
      res.render("profile", {
        title: `About ${person.firstname} ${person.lastname}`,
        person
      });

      db.close();
    });
  });
  */

  // Using JSON data instead
  const person = people.profiles.find(p => p.id === req.query.id);
  if (person) {
    res.render("profile", {
      title: `About ${person.firstname} ${person.lastname}`,
      person
    });
  } else {
    res.status(404).send("Profile not found");
  }
});

// Handling Form Submission
app.post("/feedback_form", upload.single('avatar'), function (req, res1) {
  // Database code commented out
  /*
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
      { msg: "Profile successfully saved." });

      db.close();
    });
  });
  */

  // Adding the new profile to the JSON object (in-memory)
  const newProfile = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    bio: req.body.bio,
    tagline: req.body.tagline,
    link: req.body.link,
    imgSrc: req.file ? req.file.filename : null,
    id: req.body.id
  };
  people.profiles.push(newProfile);

  // Optionally save the updated data back to the JSON file
  fs.writeFile("./people.json", JSON.stringify(people, null, 2), err => {
    if (err) {
      console.error("Error saving profile to file:", err);
      res1.status(500).send("Error saving profile");
      return;
    }

    console.log("Profile successfully saved to file");
    res1.render("addProfileForm", { msg: "Profile successfully saved." });
  });
});

const server = app.listen(process.env.PORT || 7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
