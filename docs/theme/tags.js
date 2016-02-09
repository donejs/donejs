var fs = require('fs');
var path = require('path');
var typeConverters = {
  stache: 'html',
  mustache: 'html',
  component: 'html'
};
var convertType = function(type) {
  return typeConverters[type] || type;
};

module.exports = function (existingTags) {
    /*
  	* Adds support for @line-highlight which highlights the specified lines of
  	* code in a previous code block.
    */
    existingTags.highlight = {
      add: function(line, curData) {
          var lines = line.replace("@highlight","").trim();
          var html = "<span line-highlight='"+lines+"'></span>";
          var validCurData =  (curData && curData.length !== 2);
          var useCurData = validCurData && (typeof curData.description === "string") && !curData.body;

          if(useCurData) {
              curData.description += html;
          } else {
              this.body += html;
          }
      }
    };

    existingTags.sourceref = {
      add: function(line, curData) {
        var file = line.replace("@sourceref","").trim();
        var type = convertType(path.extname(file).substring(1));
        var validCurData =  (curData && curData.length !== 2);
        var useCurData = validCurData && (typeof curData.description === "string") && !curData.body;
        var markdown = '\n```' + type + '\n' + fs.readFileSync(file).toString() + '\n```\n';

        if(useCurData) {
            curData.description += markdown;
        } else {
            this.body += markdown;
        }
      }
    };

  return existingTags;
};
