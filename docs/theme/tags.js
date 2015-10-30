module.exports = function (existingTags) {
    /*
	* Adds support for @line-highlight which highlights the specified lines of
	* code in a previous code block. 
    */
    existingTags["highlight"] = {
        add: function(line, curData) {
            var lines = line.replace("@highlight","").trim(),
                html = "<span line-highlight='"+lines+"'></span>",
                validCurData =  (curData && curData.length !== 2),
                useCurData = validCurData && (typeof curData.description === "string") && !curData.body;
            
            if(useCurData) {
                curData.description += html;
            } else {
                this.body += html;
            }
        }
    }

    return existingTags;
}