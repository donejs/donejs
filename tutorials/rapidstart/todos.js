steal('can',
      './todos.ejs',
      'can/util/fixture',
      function(can, todosEJS){
      	
	Todo = can.Model({
		findAll : "GET /todos",
		findOne : "GET /todos/{id}",
		create  : "POST /todos",
		update  : "PUT /todos/{id}",
		destroy : "DELETE /todos/{id}"
	},
	{});
      	
    // our list of todos
    var TODOS = [
        {id: 1, name: "wake up"},
        {id: 2, name: "take out trash"},
        {id: 3, name: "do dishes"}
    ]; 
    can.fixture({
      // findAll
      "GET /todos": function(){
        return TODOS
      },
      // findOne
      "GET /todos/{id}": function(orig){
        return TODOS[(+orig.data.id)-1];
      },
      // create
      "POST /todos": function(request){
        TODOS.push(request.data);
        return {id: TODOS.length}
      },
      // update
      "PUT /todos/{id}": function(){
        return {};
      },
      // destroy
      "DELETE /todos/{id}": function(){
        return {};
      }
    });

	// THE CONTROLLERS
    Todos = can.Control({
      init: function( element ){
        Todo.findAll({}, function(todos){
          element.html( todosEJS( todos ) );
        });
      },
      "li click": function(li){
        li.trigger('selected', li.data('todo') );
      },
      "li .destroy click": function(el, ev){
        // get the li element that has the model
        var li = el.closest('li');
        
        // get the model and destroy it
        li.data('todo').destroy();
      }
    })

    Editor = can.Control({
      todo: function(todo){
        this.options.todo =  todo;
        this.on();
        this.setName();
      },
      // a helper that sets the value of the input
      // to the todo's name
      setName: function(){
        this.element.val(this.options.todo.name);
      },
      // listen for changes in the todo
      // and update the input
      "{todo} updated" : function(){
        this.setName();
      },
      // when the input changes
      // update the todo instance
      "change" : function(){
        var todo = this.options.todo
        todo.attr('name',this.element.val() )
        todo.save();
      }
    });

    Routing = can.Control({
      init : function(){
        this.editor = new Editor("#editor")
        new Todos("#todos");
      },
      // the index page
      "route" : function(){
         $("#editor").hide();
      },
      "todos/:id route" : function(data){
        $("#editor").show();
        Todo.findOne(data, $.proxy(function(todo){
          this.editor.todo(todo);
        }, this))
      },
      ".todo selected" : function(el, ev, todo){
        can.route.attr('id',todo.id);
      }
    });
    
    // create routing controller
    new Routing(document.body);



})