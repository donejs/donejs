//js save/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('save/save.html', {
		markdown : ['save']
	});
});