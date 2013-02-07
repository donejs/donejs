steal(	'steal/generate',
		'steal/generate/system.js',
		'steal/generate/inflector.js',
		function(steal){

	

	var upper = function(parts){
		for(var i =0; i < parts.length; i++){
			parts[i] = parts[i].charAt(0).toUpperCase()+parts[i].substr(1)
		}
		return parts
	}
	/**
	 * Creates a model at the location provided
	 */
	steal.generate.model = function(arg){
		
		// make sure we have a module id
		if(arg.indexOf(".") > -1){
			print("JMVC's generators use module ids. Please remove any periods (.).");
			quit();
		}
		var md = steal.generate.convert(arg);
		
			path =  arg;
		
		var folder = md.parentModule;
		if(!folder){
			print("! Error: Models need to be part of an app");
			quit();
		}
		if(!steal.File(folder).exists()){
			print("! Error: folder "+folder+" does not exist!");
			quit();
		}
		
		md.path_to_steal = new steal.File(path).pathToRoot();
		
		//check pluralization of last part
		if(md.pluralAlias === md.alias){
			print("! Warning: Model names should be singular.  I don't think "+md._alias+" is singular!")	
		}
		
		// generate the files
		steal.generate("jmvc/generate/templates/model", md.appPath, md)
		
		try{
			// steal this model in models.js
			// steal.generate.insertSteal(md.appPath+"/models/models.js", "./"+md.underscore+".js");
			
			// steal this model's unit test in qunit.js
			steal.generate.insertSteal(md.appPath+"/"+md.appName+"_test.js", "./models/"+md._alias+"_test.js");
		} catch (e) {
			if(e.type && e.type == "DUPLICATE"){
				print("! Error: This model was already created!")	
				quit();
			}
		}
		
		var text = readFile("jmvc/generate/templates/fixturemake.ejs");
		var fixturetext = new steal.EJS({
			text: text
		}).render(md);
		
		
		if(readFile(md.appPath+"/models/fixtures/fixtures.js").indexOf(fixturetext) == -1){
			steal.generate.insertCode(md.appPath+"/models/fixtures/fixtures.js", fixturetext);
		}
		
		
	}
	
	
	
});