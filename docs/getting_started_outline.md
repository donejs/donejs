## 1. Install

Define a public folder for client code and a place for your server-side rendering code.

In your server:

> npm install done-server-side-render

In your public folder:

> npm install donejs --save



- ¿ Should we have two donejs, possibly not if it's only going to do server side rendering ?


## 2. Setting up server side rendering

#### 1. Create a template

Create `public/pmo/main.stache`

```
<html>
  <head>
    <title>Place My Order</title>
    {{asset "css"}}
  </head>
  <body>
    <can-import from="pmo/app" [.]="{value}" />
    <h1>{{message}}</h1>
    {{asset "inline-cache"}}

    {{#isProduction}}
    <script src="/node_modules/steal/steal.production.js" main="pmo/main.stache!done-autorender"></script>
    {{else}}
    <script src="/node_modules/steal/steal.js"></script>
    {{/isProduction}}
  </body>
</html>
```

- ¿ DocType ?

#### 2.  Create the application view model

```
// pmo/app.js
import AppMap from "can/map/app/";

const AppState = AppMap.extend({
  message: "Hello World!"
});

export default AppState;
```

- ¿ pmo/pmo ?

#### 3. Create a file like:

```
var ssr = require("done-server-side-render");
var url = require("url");

var render = ssr({
  config: path.join(__dirname, "..", "/public/package.json!npm"),
  main: "pmo/layout.stache!done-autorender"
});

express.use("/", function(req, res){
    var pathname = url.parse(req.url).pathname;

    render(pathname).then(html => res.send(html))
}));
```

set package.json:

```
"scripts": {
    "start": "node lib/index.js",
```

#### 4. Serve!

Run:

>  npm start

Open your browser.

Enjoy!


## 3. Setting up routing.
## 4. Getting data from the server and showing it in the page.
## 5. Settup up a real-time connection.