/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require("express");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require("cfenv");

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + "/public"));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

//Watson Visual Recognition code
app.get("/watson/imageRecognition/", function(req, res){
	
	var watson = require("watson-developer-cloud");
	var request = require('request');
	//var fs = require('fs');

//Desafio 8-------------------------------------------------------------------

	var visual_recognition = watson.visual_recognition({
	  api_key: "FIX",
	  version: "v3",
	  version_date: "2016-05-20"
	});

//Fim do desafio 8------------------------------------------------------------

	var params = {
	  images_file: request(req.query.imageToBeSent),
		classifier_ids: ["object_1799881148"]
	};

	visual_recognition.classify(params, function(err, content) {
		if (err){
			console.error(err);
		}else{
			res.json(content);
			console.log(content);
		}
	});
});

//Function to train Watson
app.get("/watson/trainWatson/", function(req, res){
	var watson = require('watson-developer-cloud');
	var fs = require('fs');

	var visual_recognition = watson.visual_recognition({
		api_key: "FIX",
	  version: "v3",
	  version_date: "2016-05-20"
	});

	var params = {
		name: 'object',
		rock_positive_examples: fs.createReadStream('./classifier_images/rock.zip'),
		paper_positive_examples: fs.createReadStream('./classifier_images/paper.zip'),
		scissors_positive_examples: fs.createReadStream('./classifier_images/scissors.zip')
	};

	visual_recognition.createClassifier(params, 
	function(err, response) {
		if (err)
			console.log(err);
		else
			console.log(JSON.stringify(response, null, 2));
			res.json(response);
	});
});

//Retrieve classifier information
app.get("/watson/getClassifierInfo/", function(req, res){
	var watson = require('watson-developer-cloud');

	var visual_recognition = watson.visual_recognition({
		api_key: "FIX",
	  version: "v3",
	  version_date: "2016-05-20"
	});
	
	visual_recognition.getClassifier({
		classifier_id: req.query.classifierName },
		function(err, response) {
		if (err)
			console.log(err);
		else
			console.log(JSON.stringify(response, null, 2));
			res.json(response);
		}
	);
});

//Retrieve all classifiers
app.get("/watson/getAllClassifiers/", function(req, res){
	var watson = require('watson-developer-cloud');

	var visual_recognition = watson.visual_recognition({
		api_key: "FIX",
	  version: "v3",
	  version_date: "2016-05-20"
	});

	visual_recognition.listClassifiers({},
		function(err, response) {
		if (err)
			console.log(err);
		else
			console.log(JSON.stringify(response, null, 2));
			res.json(response);
		}
	);
});

//Delete a classifier
app.get("/watson/deleteClassifier/", function(req, res){
	var watson = require('watson-developer-cloud');

	var visual_recognition = watson.visual_recognition({
		api_key: "FIX",
	  version: "v3",
	  version_date: "2016-05-20"
	});

	visual_recognition.deleteClassifier({
		classifier_id: req.query.classifierName },
		function(err, response) {
		if (err)
			console.log(err);
		else
			console.log(JSON.stringify(response, null, 2));
			console.log("Classifier " + req.query.classifierName + " deleted")
		}
	);
});
