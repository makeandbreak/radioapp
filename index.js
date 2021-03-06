// Copyright 2015 makeandbreak (github.com user id) 

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the software, and to permit
// persons to whom the Software is furnished to do so, subject to the 
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRENTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE 
// USE OR OTHER DEALINGS IN THE SOFTWARE.  


// https can be used if certificates are created and related code is uncommented 

var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
var stations = require("./stations.json");
var util = require('util');
var exec = require('child_process').exec;
// for ssl: var https = require('https'); 

// for ssl: require('ssl-root-cas').addFile('./file.crt');

var childclear;
var childadd;
var childplay;

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var options = {
    // for ssl: key: fs.readFileSync('./file.pem'),
    // for ssl: cert: fs.readFileSync('./file.crt')
};

// for ssl: var serverPort = 443;
var serverPort = 8081;

// for ssl: var server = https.createServer(options, app);

global.selectedID = 0;

app.get('/', function (req, res) {

    fs.readFile( __dirname + "/" + "index.htm", "utf8", function (err, data){

        var list = stations["stations"];
       
        var newLines = "";

        list.forEach(function(entry) {

            if (entry.id == global.selectedID){
                newLines += '<li><a id="' + entry.id + '" onclick="selectStation(this)" class="active" href="#">' + entry.name + '</a></li>';
            } 
            else
            {
                newLines += '<li><a id="' + entry.id + '" onclick="selectStation(this)" href="#">' + entry.name + '</a></li>';
            };

        });

	data = data.replace("#station_list#", newLines);
       
        res.end( data);
    });   

});

app.get("/setStation/:id", function(req, res){

     console.log("getStation() : " + req.params.id);

     var list = stations["stations"];

     var url;
     var playType;

     list.forEach(function(entry) {
         
         if (entry.id == req.params.id) {
             url = entry.url;
             srcType = entry.type;
         };

     });

     childclear = exec("mpc clear", function(error, stdout, stderr) {
         console.log('stdout: ' + stdout);
         console.log('stderr: ' + stderr);

         if (error != null) {
             console.log('exec error: ' + error);
         }

         var command = "unknown";

         if (srcType == "Playlist") {
             command = "load";
         }

         if (srcType == "Stream") {
            command = "add"
         }

         childadd = exec("mpc " + command + " " + url, function(error, stdout, stderr) {
             console.log('stdout:' + stdout);
             console.log('stderr:' + stderr);

             if (error != null) {
                 console.log('exec error: ' + error); 
             } 

             var playCommand = "unknown"

             if (playType == "Playlist") {
                playCommand = "load"
             }
             
             if (playType == "Stream") {
                playCommand = "add"
             }            

             childplay = exec("mpc play 1", function(error, stdout, stderr) {
                 console.log('stdout:' + stdout);
                 console.log('stderr:' + stderr);

                 if (error != null) {
                     console.log('exec error: ' + error);  
                 }

             });

         });                   
         
     });

     res.end("end")

});


var server = app.listen(serverPort, function () {
// for ssl: server.listen(serverPort, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Radio app listening at http://%s:%s", host, port)

})