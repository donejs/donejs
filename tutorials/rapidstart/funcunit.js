
    steal('funcunit', function(){
      
    module('todos', {
      setup: function(){
        S.open("//todos/todos.html");
      }
    })
    
    test('open first todo', function(){
      S(".todo:first").click();
      S("#editor").val("wake up", "First Todo added correctly");
    })
    
    })