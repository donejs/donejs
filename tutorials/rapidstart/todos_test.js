steal('funcunit', function(S){
      
    module('todos', {
      setup: function(){
        S.open("//tutorials/rapidstart/todos.html");
      }
    })
    
    test('edit first todo', function(){
      S(".todo:first").click();
      S("#editor").val("wake up", "First Todo added correctly");
    })
    
})