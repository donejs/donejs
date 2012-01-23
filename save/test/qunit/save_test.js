steal("save/models", "save/fixtures/fixtures.js")
 .then("funcunit/qunit", function(){
    
    var first;
    module("load");
    test("Loading components", function() {
        stop();
        Save.Models.Component.findAll({}, function(data) {
            ok(true, "Data received: " + JSON.stringify(data));
            equals(data.length, 1, "1 Item received");
            first = data[0];
            start();
        })
    });
    
    module("save");
    test("Saving components", function() {
        first.attr("name", "changed item");
        stop();
    
        first.save(function() {
            ok(true, "Update successfull");
            start();
        }, function() {
            ok(false, "Update failed");
            start();
        });
    });
})
