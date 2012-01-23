steal('jquery/model',
      function(){

/**
 * @class Webportal.Models.Component
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend component services.  
 */
$.Model('Save.Models.Command', 
/* @Static */
{
},

/* @Prototype */
{
    toString: function() {
        return this.name;
    },
    
    'serialize': function() {
        console.log("serialize this command: ", this);
        return this._super();
    }
});

})
