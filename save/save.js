steal(
    './models/models.js',       // steals all your models
    './fixtures/fixtures.js',   // sets up fixtures for your models
    'save/component',
    function(){                 // configure your application
        $("#saveController").save_component();
    })
