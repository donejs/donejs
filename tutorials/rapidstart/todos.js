steal('jquery/class',
      'jquery/model',
      'jquery/dom/fixture',
      'jquery/view/ejs',
      'jquery/controller',
      'jquery/controller/route',
      function($){

// THE MODEL
$.Model('Todo',{
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
$.fixture("GET /todos", function(){
	return [TODOS]
});

// findOne
$.fixture("GET /todos/{id}", function(orig){
	return TODOS[(+orig.data.id)-1];
})

// create
var id= 4;
$.fixture("POST /todos", function(){
	return {id: (id++)}
})

// update
$.fixture("PUT /todos/{id}", function(){
	return {};
})

// destroy
$.fixture("DELETE /todos/{id}", function(){
	return {};
});

// THE CONTROLLERS
$.Controller("Todos",{
  "init" : function( element , options ){
    this.element.html('todos.ejs', Todo.findAll() )
  },
  "li click" : function(li){
    li.trigger('selected', li.model() );
  },
  "li .destroy click" : function(el, ev){
    el.closest('.todo')
      .model()
      .destroy();
    ev.stopPropagation();
  },
  "{Todo} destroyed" : function(Todo, ev, destroyedTodo){
    destroyedTodo.elements(this.element)
                 .remove();
  },
  "{Todo} updated" : function(Todo, ev, updatedTodo){
    updatedTodo.elements(this.element)
               .replaceWith('todos.ejs',[updatedTodo]);
  }
});

$.Controller('Editor',{
  update : function(options){
    this._super(options)
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

$.Controller("Routing",{
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
    $.route.attr('id',todo.id);
  }
});

// create routing controller
new Routing(document.body);



})