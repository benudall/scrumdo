var https = require('https');
var Handlebars = require('handlebars');
var fs = require('fs');

var boardcellsoptions = {
	host: 'app.scrumdo.com',
	path: '/api/v3/organizations/aqueduct1/projects/szki-car-production-j5555/boardcell',
	headers: {
		'Authorization': 'Basic YmVudTpUb3dlcjEyOQ=='
	}
}
var iterationsoptions = {
	host: 'app.scrumdo.com',
	path: '/api/v3/organizations/aqueduct1/projects/szki-car-production-j5555/iterations',
	headers: {
		'Authorization': 'Basic YmVudTpUb3dlcjEyOQ=='
	}
}
var storiesoptions = {
	host: 'app.scrumdo.com',
	path: '/api/v3/organizations/aqueduct1/projects/szki-car-production-j5555/stories',
	headers: {
		'Authorization': 'Basic YmVudTpUb3dlcjEyOQ=='
	}
}
var data={};
//get boardcells
console.log("Getting boardcells");
https.get(boardcellsoptions, (boardcells) => {
	rawboardcells = '';
	boardcells.on('data', (d) => {
		rawboardcells += d.toString();
	})
	boardcells.on('end', () => {
		data.boardcells=JSON.parse(rawboardcells);
		console.log("Got boardcells");
		//get iterations
		console.log("Getting iterations");
		https.get(iterationsoptions,(iterations) => {
			rawiterations = '';
			iterations.on('data', (d) => {
				rawiterations += d.toString();
			})
			iterations.on('end', () => {
				data.iterations=JSON.parse(rawiterations);
				console.log("Got iterations");
				//get stories
				console.log("Getting stories");
				https.get(storiesoptions, (stories) => {
					rawstories = '';
					stories.on('data', (d) => {
						rawstories += d.toString();
					})
					stories.on('end', () => {
						data.stories=JSON.parse(rawstories);
						console.log("Got stories");
						res={};
						res.iterations=[];
						for(x=0;x<data.iterations.length;x++){
							res.iterations[x]={};
							res.iterations[x].name=data.iterations[x].name;
							res.iterations[x].id=data.iterations[x].id;
							res.iterations[x].boardcells=[];
							for(y=0;y<data.boardcells.length;y++){
								res.iterations[x].boardcells[y]={};
								res.iterations[x].boardcells[y].name=data.boardcells[y].full_label;
								res.iterations[x].boardcells[y].stories=[];
							}
						}
						
						for(x=0;x<data.stories.items.length;x++){
							for(y=0;y<res.iterations.length;y++){
								for(z=0;z<res.iterations[y].boardcells.length;z++){
									if(data.stories.items[x].iteration_id==res.iterations[y].id && data.stories.items[x].cell!=null && data.stories.items[x].cell.full_label==res.iterations[y].boardcells[z].name){
										res.iterations[y].boardcells[z].stories.push(data.stories.items[x]);
									}
								}
							}
						}
						
						var template = fs.readFileSync('report.hbs').toString();
						var compiled = Handlebars.compile(template);
						//define extra vars for template here
						res.date = new Date().toJSON().replace(/T/g," ").replace(/:/g,"-").replace(/\.\d{3}Z/g,"");
						
						fs.writeFileSync("Scrumdo Report "+res.date+".html",compiled(res));
						console.log("Scrumdo Report "+res.date+".html created");
						console.log("END");
						
						
					})
				})
			})
		})
	})
}).on('error', (e) => {
	console.error(e);
});





/*
		console.log("Found "+response.items.length+" tickets");
		
		
		var template = fs.readFileSync('report.hbs').toString();
		var compiled = Handlebars.compile(template);
		//define extra vars for template here
		response.date = new Date().toJSON().replace(/T/g," ").replace(/:/g,"-").replace(/\.\d{3}Z/g,"");
		response.items=response.items.sort(function(a,b){return a.number-b.number});
		response.cells=[];
		for(x=0;x<response.items.length;x++){
			if(response.cells.indexOf(response.items[x].cell.label)==-1){
				response.cells.push(response.items[x].cell.label)
			}
		}
		console.log(response.cells)
		
		
		fs.writeFileSync("Scrumdo Report "+response.date+".html",compiled(response));
		console.log("Scrumdo Report "+response.date+".html created");
		console.log("END");
*/