var https = require('https');
var request = require('sync-request')
var fs = require('fs');
var Handlebars = require('handlebars');


var options = {
	host: 'app.scrumdo.com',
	path: '/api/v3/organizations/aqueduct1/projects/szki-car-production-j5555/search?q=before:%202016-11-06,%20after:%202016-10-31,%20cell:%20Done',
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
		for(x=0;x<response.items.length;x++){
			console.log(response.items[x].number);
			console.log(response.items[x].summary);
			
		}
	})
}).on('error', (e) => {
	console.error(e);
});