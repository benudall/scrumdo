var https = require('https');
var Handlebars = require('handlebars');
var fs = require('fs');


var before = "2016-11-06";
var after = "2016-10-31";

var options = {
	host: 'app.scrumdo.com',
	path: '/api/v3/organizations/aqueduct1/projects/szki-car-production-j5555/search?q=before:'+before+',after:'+after+',cell:Done',
	headers: {
		'Authorization': 'Basic YmVudTpUb3dlcjEyOQ=='
	}
}

https.get(options, (res) => {
	rawresponse = '';
	res.on('data', (d) => {
		rawresponse += d.toString();
	})
	res.on('end', () => {
		response=JSON.parse(rawresponse);
		console.log("Found "+response.items.length+" tickets");
		
		
		var template = fs.readFileSync('report.hbs').toString();
		var compiled = Handlebars.compile(template);
		//define extra vars for template here
		response.date = new Date().toJSON().replace(/T/g," ").replace(/:/g,"-").replace(/\.\d{3}Z/g,"");
		response.start=after;
		response.end=before;
		response.items=response.items.sort(function(a,b){return a.number-b.number});
		
		fs.writeFileSync("Scrumdo Report "+response.date+".html",compiled(response));
		console.log("Scrumdo Report "+response.date+".html created");
		console.log("END");
	})
}).on('error', (e) => {
	console.error(e);
});