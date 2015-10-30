var $ = require('jquery');
module.exports = function(){
	$('span[line-highlight]').each(function(i, el){

		var $el = $(el);
		var lines = $el.attr('line-highlight');
		var codeBlock = $el.parent().prev('pre').children('code');
		var lineMap = { 0: [] };
		var k = 0;


		codeBlock.children().each(function(i, el){
			var nodeText = $(el).text();

			if (/\n/.test(nodeText)) {
				var cNames = $(el).attr('class');
				var str = nodeText.split('\n');

				for (var j = 0; j < str.length; j++) {
					var text = j === (str.length - 1) ? str[j] : str[j] + '\n';
					var newNode = document.createElement('span');
					newNode.className = cNames;
					$(newNode).text(text);
					lineMap[k].push(newNode);
					k++;
				}
			} else {
				lineMap[k].push(el);
			}
		});

		console.log(lineMap);
	})
}