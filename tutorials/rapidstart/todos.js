steal('can/util',
      'can/model',
      'can/util/fixture',
      'can/view/ejs',
      'can/view/modifiers',
      'can/control',
      'can/control/route',
      'can/control/plugin',
      function(can){
// THE MODEL
can.Model('Todo', {
	findAll : "GET /todos",
	findOne : "GET /todos/{id}",
	create  : "POST /todos",
	update  : "PUT /todos/{id}",
	destroy : "DELETE /todos/{id}"
},
{});

// THE FIXTURES
// our list of todos
var TODOS = [
    {id: 1, name: "wake up"},
    {id: 2, name: "take out trash"},
    {id: 3, name: "do dishes"}
];
// findAll
can.fixture("GET /todos", function(){
	return TODOS
});

// findOne
can.fixture("GET /todos/{id}", function(orig){
	return TODOS[(+orig.data.id)-1];
})

// create
var id= 4;
can.fixture("POST /todos", function(){
	return {id: (id++)}
})

// update
can.fixture("PUT /todos/{id}", function(){
	return {};
})

// destroy
can.fixture("DELETE /todos/{id}", function(){
	return {};
});

// THE CONTROLLERS
Todos = can.Control({
  "init" : function( element , options ){
    this.element.html('todos.ejs', Todo.findAll({}) )
  },
  "li click" : function(li){
    li.trigger('selected', li.data('model') );
  },
  "li .destroy click" : function(el, ev){
    el.closest('.todo')
    .data('model')
    .destroy();
    ev.stopPropagation();
  },
  "{Todo} destroyed" : function(Todo, ev, destroyedTodo){
    this.element.find('.todo_' + destroyedTodo.id).remove();
  },
  "{Todo} updated" : function(Todo, ev, updatedTodo){
    this.element.find('.todo_' + updatedTodo.id)
                .replaceWith('todos.ejs',[updatedTodo]);
  }
});

Editor = can.Control({
  update : function(options){
    can.extend(this.options, options);
    this.on();
    this.setName();
  },
  // a helper that sets the value of the input
  // to the todo's name
  setName : function(){
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
      this.editor.update({todo: todo});
    }, this))
  },
  ".todo selected" : function(el, ev, todo){
    can.route.attr('id',todo.id);
  }
});

// create routing controller
new Routing(document.body);



})