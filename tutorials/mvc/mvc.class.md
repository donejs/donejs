@page mvc.class Class
@parent mvc 0

JMVC's Controller and Model inherit from its Class helper - [jQuery.Class $.Class]. To create a class, call <code>$.Class(NAME, [classProperties, ] instanceProperties])</code>. 

    $.Class("Animal",{
      breathe : function(){
         console.log('breathe'); 
      }
    });

In the example above, instances of Animal have a <code>breathe()</code> method. We can create a new <code>Animal</code> instance and call <code>breathe()</code> on it like:

    var man = new Animal();
    man.breathe();

If you want to create a sub-class, simply call the the base class with the sub-class's name and properties:

    Animal("Dog",{
      wag : function(){
        console.log('wag');
      }
    })

    var dog = new Dog;
    dog.wag();
    dog.breathe();

### Instantiation

When a new class instance is created, it calls the class's <code>init</code> method with the arguments passed to the constructor function:

    $.Class('Person',{
      init : function(name){
        this.name = name;
      },
      speak : function(){
        return "I am "+this.name+".";
      }
    });
    
    var payal = new Person("Payal");
    assertEqual( payal.speak() ,  'I am Payal.' );

### Calling base methods

Call base methods with <code>this._super</code>.  The following overwrites person
to provide a more 'classy' greating:

    Person("ClassyPerson", {
      speak : function(){
        return "Salutations, "+this._super();
      }
    });
    
    var fancypants = new ClassyPerson("Mr. Fancy");
    assertEquals( fancypants.speak() , 'Salutations, I am Mr. Fancy.')

### Proxies

Class's callback method returns a function that has 'this' set appropriately (similar to [$.proxy](http://api.jquery.com/jQuery.proxy/)).  The following creates a clicky class that counts how many times it was clicked:

    $.Class("Clicky",{
      init : function(){
        this.clickCount = 0;
      },
      clicked: function(){
        this.clickCount++;
      },
      listen: function(el){
        el.click( this.callback('clicked') );
      }
    })
    
    var clicky = new Clicky();
    clicky.listen( $('#foo') );
    clicky.listen( $('#bar') ) ;

### Static Inheritance 

Class lets you define inheritable static properties and methods.  The following allows us to retrieve a person instance from the server by calling <code>Person.findOne(ID, success(person) )</code>.  Success is called back with an instance of Person, which has the <code>speak</code> method.

    $.Class("Person",{
      findOne : function(id, success){
        $.get('/person/'+id, function(attrs){
          success( new Person( attrs ) );
        },'json')
      }
    },{
      init : function(attrs){
        $.extend(this, attrs)
      },
      speak : function(){
        return "I am "+this.name+".";
      }
    })

    Person.findOne(5, function(person){
      assertEqual( person.speak(), "I am Payal." );
    })

### Introspection

Class provides namespacing and access to the name of the class and namespace object:

    $.Class("Jupiter.Person");

    Jupiter.Person.shortName; //-> 'Person'
    Jupiter.Person.fullName;  //-> 'Jupiter.Person'
    Jupiter.Person.namespace; //-> Jupiter
    
    var person = new Jupiter.Person();
    
    person.Class.shortName; //-> 'Person'

### Model example

Putting it all together, we can make a basic ORM-style model layer.  Just by inheriting from Model, we can request data from REST services and get it back wrapped in instances of the inheriting Model.

    $.Class("Model",{
      findOne : function(id, success){
        $.get('/'+this.fullName.toLowerCase()+'/'+id, 
          this.callback(function(attrs){
             success( new this( attrs ) );
          })
        },'json')
      }
    },{
      init : function(attrs){
        $.extend(this, attrs)
      }
    })

    Model("Person",{
      speak : function(){
        return "I am "+this.name+".";
      }
    });

    Person.findOne(5, function(person){
      alert( person.speak() );
    });

    Model("Task")

    Task.findOne(7,function(task){
      alert(task.name);
    })
    

This is similar to how JavaScriptMVC's model layer works.