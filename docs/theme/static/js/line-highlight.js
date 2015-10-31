var $ = require('jquery');

var getLines = function (lineString) {
	var lineArray = lineString.split(',');
	var result = {};

	for (var i = 0; i < lineArray.length; i++) {
		var val = lineArray[i];

		// Matches any string with 1+ digits dash 1+ digits
		// will ignore non matching strings
		if(/^([\d]+-[\d]+)$/.test(val)) {
			var values = val.split('-'),
				start = (values[0] - 1),
				finish = (values[1] - 1);

			for (var j = start; finish >= j; j++) {
				result[j] = true;
			}
		//matches one or more digits
		} else if (/^[\d]+$/.test(val)) {
			result[val - 1] = true;
		}

	}
	return result;
};

module.exports = function() {
	$('span[line-highlight]').each(function(i, el){

		var $el = $(el);
		var lines = getLines($el.attr('line-highlight'));
		var codeBlock = $el.parent().prev('pre').children('code');


		var lineMap = { 0: [] };
		var k = 0;

		codeBlock.children().each(function(i, el){
			var nodeText = $(el).text();

			if (/\n/gm.test(nodeText)) {
				var cNames = $(el).attr('class');
				var str = nodeText.split('\n');
				var l = str.length

				for (var j = 0; j < l; j++) {
					var text = j === (l - 1) ? str[j] : str[j] + '\n';
					var newNode = document.createElement('span');
					newNode.className = cNames;
					$(newNode).text(text);
					lineMap[k].push(newNode);
					
					if(j !== (l - 1)) {
						k++;
						lineMap[k] = [];
					}
				}
			} else {
				lineMap[k].push(el);
			}
		});

		codeBlock.empty();

		for (var key in lineMap) {
		   if (lineMap.hasOwnProperty(key)) {
			   	var newNode = document.createElement('span');
					newNode.className = lines[key] ? 'line highlight': 'line' ;
					$(newNode).append(lineMap[key]);
					codeBlock.append(newNode);
		   }
		 }
	});
}