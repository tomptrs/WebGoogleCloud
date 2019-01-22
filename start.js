//https://codelabs.developers.google.com/codelabs/cloud-vision-nodejs/index.html?index=..%2F..%2Findex#0


//DEPLOY TO APP ENGINE
//https://cloud.google.com/appengine/docs/standard/nodejs/quickstart

//Deploy to computer engine
// NOT ** https://medium.com/google-cloud/node-to-google-cloud-compute-engine-in-25-minutes-7188830d884e
//https://codelabs.developers.google.com/codelabs/cloud-create-a-nodejs-vm/index.html?index=..%2F..index#3

'use strict';

// [START gae_node_request_example]
var express = require('express');
var app = express();
var bodyparser = require("body-parser");
require('dotenv').config();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true })); 
var request = require('request');

app.use(express.static(__dirname + '/views'));


/*************************************************GOOGLE CLOUD VISION************************************************************************************ */
/*
GOOGLE CLOUD VISION API
*/

var dataString = {

  "requests": [{
    "image": {
      "source": {
        "imageUri": "gs://my-image-bucket-tom/dvw.jpg"
      }
    },
    "features": [
      {
        "type": "LABEL_DETECTION",
        "maxResults": 10
      }
    ]
  }]
};



var labels = [];

request.post({
  url: 'https://vision.googleapis.com/v1/images:annotate?key='+process.env.VISION_KEY,
  body: dataString,
  json: true
}, function (error, response, body) {
  console.log(body);
  console.log(error);
  console.log(body.responses);
  labels = body.responses;
});

/**
 * 
 * END CLOUD VISION API
 */

/************************************************************************************************************************************* */



/*******************************************************FIRESTORE****************************************************************************** */
/**
 * 
 * FIRESTORE 
 */


var admin = require("firebase-admin");

var serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pathhunt-219508.firebaseio.com"
});

var db = admin.firestore();
/*
Result variable => checking vision API with new firestore objects
*/
var results = [];

/*
REALTIME FIRESTORE UPDATES
*/
var currentDate = new Date();
currentDate.setHours(currentDate.getHours() - 1);
console.log("current date = " + currentDate.toLocaleString());
db.collection("guesses").where("timestamp",">=",currentDate.toLocaleString())
  .onSnapshot(function (doc) {

    results = [];
    doc.forEach(function (doc2) {

      let isCorrect = false;
      console.log("*******************");
      if (labels.length > 0) {
        labels[0].labelAnnotations.forEach(function (item) {

          if (doc2.data().value == item.description) {
            isCorrect = true;
          }
        });
        if (isCorrect)
          results.push({
            "value": doc2.data(),
            "color": "green"
          });
        else
          results.push({
            "value": doc2.data(),
            "color": "red"
          });

        console.log(results);
      }


    });
  });



/*******************************************************REST API****************************************************************************** */
/*
START HTTP API
*/

/*
Index Page
*/
app.get("/", function (req, res) {


  res.sendFile(__dirname + '/views/start.html');

});

/*
Test API to view results of google vision API
*/
app.get("/test", function (req, res) {
  res.json(labels[0].labelAnnotations);
});


/*
get matches vision - firestore
 */
app.get("/results", function (req, res) {
  res.json(results);
});

app.get("/start", function (req, res) {
  //setup current date & time
currentDate = new Date();

currentDate.setHours(currentDate.getHours() - 1);
  res.json("");
});


/*
Process the new data : 
  send it to firestore
  GET REALTIME UPDATES IN FIRESTORE SECTION!
 */
app.post("/process", function (req, res) {

  var curDate = new Date();
  db.collection("guesses").doc().set({
      value: req.body.tag,
      timestamp: curDate.toLocaleString()
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
  
    
    res.sendFile(__dirname + '/views/start.html');


});




/**************************************************START SERVER*********************************************************************************** */


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END gae_node_request_example]

//PORT FORWARDING
//https://gist.github.com/kentbrew/776580