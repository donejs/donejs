steal( 'jquery/controller',
       'save/models', 
       function($){

/**
 * @class Webportal.Component.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists components and lets you destroy them.
 */
$.Controller('Save.Component',
/** @Static */
{
    defaults : {}
},
/** @Prototype */
{
    init: function() {
        Save.Models.Component.findAll({}, this.proxy(function(data) { 
            this.element.html(data.length + " items loaded: <pre>" + 
             JSON.stringify(data) + "</pre>");
            console.log(data);
            
            // try to update the first one and save it}));
            first = data[0];
            first.attr("name", "changed item");
            
            console.log(first);
            this.element.html(this.element.html() + "<br />Saving...");
            
            first.save(this.proxy(function() {
                this.element.html(this.element.html() + "<br />Update successfull!");
            }));
        }));
    }

})

});
