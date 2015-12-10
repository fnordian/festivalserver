var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;
var fileSystem = require('fs');
var path = require('path');
var urlParser = require('url');
var queryParser = require('querystring');

console.log("started");


http.createServer(function(req, res) {

  var filePath = "/tmp/out.wav";
	var text = queryParser.parse(urlParser.parse(req.url).query).text;


  var child = exec("text2wave -o " + filePath + " -f 8000", function(error, stdout, stderr) {

    if (error !== null) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'

      });
      res.write("error");

    } else {

      var stat = fileSystem.statSync(filePath);

      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Length': stat.size
      });

      var readStream = fileSystem.createReadStream(filePath);

      readStream.pipe(res);
			fileSystem.unlinkSync(filePath);

    }
  });

	console.log("text: " + text);

	if (text !== undefined) {
  	child.stdin.write(text);
	}
  child.stdin.end();
}).listen(3000);
