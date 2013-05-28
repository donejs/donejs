@page services Ajax Service Guidelines
@parent tutorials 9

JavaScriptMVC's flexibility allows it to 
be used with almost any service layer.  However, 
this guide details suggests a service layer design 
that minimizes the amount of extra work to get JavaScriptMVC running.

In general, the service layer should be as 
thin as possible and reflect the Database 
queries and results the server must make 
to get the data.  This keeps things flexible 
from the client's perspective.

## JSON Rest Part 1

The best over-all service layer can be described as JSON REST.  

JSON is used as the data received and sometimes sent to the server.

[REST](http://en.wikipedia.org/wiki/Representational_state_transfer Representational State Transfer) is 
where there are resource urls that are 
modified with <code>GET POST PUT</code> and <code>DELETE</code> methods.  

A brief example is a service API for messages.  The server might expose the 
following METHOD and URLS:

<code>GET /messages        </code> - gets an array of messages from the server.
<code>GET /messages/{id}   </code> - gets a single message from the server.
<code>POST /messages       </code> - creates a message from the server.
<code>PUT /messages/{id}   </code> - updates a message from the server.
<code>DELETE /messages/{id}</code> - destroys a message from the server.

## Query String Params

Before going into detail about what each 
<code>METHOD URL</code> does, it's worth 
quickly describing how parameters are 
passed to the query string.  [can.Model] passes 
parameters to your framework of choices ajax handler
and that gets converted by [can.param]. 
For example, if we wanted
all messages for a given user, 
sorted first by date, then by the users's name, 
we might call something like:

    $.get('/messages',{
      userId: 5, 
      order: ['createdAt ASC','user.name ASC'] 
    })
    
Which produces:

@codestart text
GET /messages?
        userId=5&
        order%5B%5D=createdAt+ASC&
        order%5B%5D=user.name+ASC
@codeend

Lets walk through each REST service example.

## GET /messages

A request to GET /messages should return 
all message records visible to the 
requesting user.  The data should look like:

    {
      "data": [
          {
             "id" : 1,
             "fromUserId": 921,
             "text": "Hello World",
             "createdAt" : 1024324214123
          },
          {
             "id" : 2,
             "fromUserId": 923,
             "text": "Goodnight World",
             "createdAt" : 23524365346543
          },
          ...
      ],
      "count": 100 
    }

Where:

 - <code>data</code> - has an array of objects (in this case 100), 
   each object contains the data for a single message.
 - <code>count</code> - lists the number of items that 
   would be returned if a limit was not used.  In this 
   case, no limit was used so count matches the number of items.
   

<code>GET /messages</code> will typically take 
arguments passed in as name=value parameters 
in the query string like:

>  <code>GET /messages?limit=10&offset=20&order[]=createdAt+DESC</code>

Common name / values are:

 - <code>limit</code> - the total number of items to return
 - <code>offset</code> - the position in the 'total' set to start returning items
 - <code>order</code> - an array of 'NAME SORTORDER' pairs


You'll notice that these properties can effectively be sent straight away to a DB query.

#### Relationships

Often, you want to get all data for a particular item.  For example, 
all messages from user 52.  Instead of requesting something like:

>  <code>GET /users/52/messages</code>

A request should be made to:

>  <code>GET /messages?fromUserId=52</code>

The service should limit messages to only those where <code>fromUserId = 52</code>.

### Related Data

Another common problem is when, for 
performance reasons, you want the 'joined' 
data for a particular field.  For example, 
when getting messages, you might want to also 
want to get the user data from fromUserId.  

In this case, we encourage the use 
of an 'include' option which 
signifies including additional data like:

>  <code>GET /messages?include[]=fromUser</code>

The fromUser data will be added to each message object like:

    {
      "data": [
          {
             "id" : 1,
             "fromUserId": 921,
             "text": "Hello World",
             "createdAt" : 1024324214123,
             "fromUser": {
               "id" : 921,
               "name" : "Justin Meyer"
             }
          },
          ...
      ],
      "count": 100 
    }

## GET /messages/{id}

Gets a single item from the server.  It should return just the JSON data for the object like:

    ->{
        "id" : 1,
        "fromUserId": 921,
        "text": "Hello World",
        "createdAt" : 1024324214123
    }

    
## POST /messages

Creates a message on the server.  Typically, 
the body of this request is JSON data that 
looks exactly like the data from a GET request, 
but without the id property or any properties 
the server might add.  For example, I can 
create a message by sending:

    POST /messages
    {
        "fromUserId": 921,
        "text": "A new message"
    }

The server is going to add the id and createdAt property and should return those as JSON in the response:

    ->{
        "id": 22,
        "createdAt": 1224324214123
    }
    
## PUT /messages/{id}

This updates a resource.  Similar to POST, 
the body should be JSON that matches what 
the data from a GET request looks 
like.  However, only fields that are changing 
are necessary to send.  For example, we we 
want to update the text of a message:

    PUT /messages/22
    {
      'text': "An updated EVIL message"
    }  

The response should have any fields that were 
modified or adjusted on the server.  For 
example, the server might filter the word 
"EVIL" out of messages and be updating some 
'updatedAt' property.  It should return:

    ->{
      'text' : "An updated message",
      'updatedAt' : 123254356346241
    }

If no filtering or modifying of other changes 
happened, the server can just return 
an empty object: <code>{}</code>.

## DELETE /messages/{id}

Destroys a resource from the server.  

## Sending Dates

The best way of sending dates is an integer representing the Julian date like:

    createdAt: 12313123133423

Where we can convert that easily to a JavaScript date like

    new Date(123123133423)

## CUD Multiple Items with a Single Request

Often, you want to create, update, or delete items with a single request.  This is
most often done with [can.Model.List].


## Handling Errors

When an error happens, make sure your server sends back the 
proper HTTP status code.  The response body should be a JSON object with
property names mapped to an array of errors:

    {
       email : ["Formatting is incorrect","No email is provided"]
    }
    
    