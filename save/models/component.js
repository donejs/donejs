steal('jquery/model',
      function(){

/**
 * @class Webportal.Models.Component
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend component services.  
 */
$.Model('Save.Models.Component',
/* @Static */
{   
    
    attributes: {
        'commands': 'Save.Models.Command.models'
    }
},
/* @Prototype */
{
    'serialize': function() {
        console.log("serialize component", this, this.id);
        return this._super();
    }
});

})
