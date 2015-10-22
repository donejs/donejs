@page Matrix
@parent DoneJS
@hide sidebar

@body
## Performance Features

DoneJS is configured for maximum performance right out of the box.

### Server Side Rendered

DoneJS applications are written as [Single Page Applications](http://en.wikipedia.org/wiki/Single-page_application),
and are able to be rendered on the server by running the same code. This is known as [Isomorphic JavaScript](http://isomorphic.net/javascript), or [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9).

Server side rendering (SSR) provides two large benefits over traditional single page apps: much better page load performance and SEO support.

SSR apps return fully rendered HTML. Traditional single page apps return a page with a spinner. The difference to your users is a noticeable difference in perceived page load performance:

<img src="./static/img/donejs-server-render-diagram.svg" alt="donejs-server-render-diagram.svg" />

Compared to other server side rendering systems, which require additional code and infrastructure to work correctly, DoneJS is uniquely designed to make turning on SSR quick and easy, and the server it runs is lightweight and fast.

#### Page load performance

Server side rendered SPAs can load pre-rendered HTML immediately. It can also cache HTML and serve it from a CDN.

Traditional SPAs must load the JS, execute, request data, and render before the user sees content.

#### SEO

Search engines can't easily index SPAs. Server side rendering fixes that problem entirely. Even if [Google can understand some JavaScript now](http://googlewebmastercentral.blogspot.ca/2014/05/understanding-web-pages-better.html), many other search engines cannot.

Since search engines see the HTML your server returns, if you want search engines finding your pages, you'll want Google and other search engines seeing fully rendered content, not the spinners that normally load after initial SPAs load.

#### How it works

DoneJS implements SSR with a single context virtual DOM.

**Single context** means every request to the server reuses the same context: including memory, modules, and even the same instance of the application.

**Virtual DOM** means a virtual representation of the DOM: the fundamental browser APIs that manipulate the DOM, but stubbed out.

When using DoneJS SSR, the same app that runs on the client is loaded in Node. When a request comes in:
 1. The server handles the incoming request by reusing the application that is already running in memory. It doesn't reload the application (single context is optional, so reload is something you can opt into) which means the initial response is very fast.
 1. The app renders content the same way it would in the browser, but with a mocked out virtual DOM, which is much faster than a real DOM.
 1. The server waits for all your asynchronous data requests to finish before signaling that rendering is complete (more on how that works below).
 1. When rendering is complete, the virtual DOM renders the string representation of the DOM, which is sent back to the client.


Since SSR produces fully rendered HTML, it's possible to insert a caching layer, or use a service like Akamai, to serve most requests. Traditional SPAs don't have this option.

Rather than a virtual DOM, other SSR systems use a headless browser on the server, like PhantomJS, which uses a real DOM. These systems are much slower and require much more intensive server resources.

Some systems, even if they do use a virtual DOM, require a new browser instance entirely, or at the very least, reloading the application and its memory for each incoming request, which also is slower and more resource intensive than DoneJS SSR.

##### Prepping your app for SSR

Any app that is rendered on the server needs a way to notify the server that any pending asynchronous data requests are finished, and the app can be rendered.

React and other frameworks that support SSR don't provide much in the way of solving this problem. You're left to your own devices to check when all asychronous data requests are done, and delay rendering.

DoneJS provides two easy mechanisms for notifying the server when data is finished loading.

The more common way is to make data requests in the template, which is possible via can-connect's [can-tag feature](http://connect.canjs.com/doc/can-connect%7Ccan%7Ctag.html). It calls a method internally that tells the server to wait for its promise to resolve. You just write your template, turn on SSR, and everything works seamlessly:

```
<message-model get-list="{}">
  {{#each ./value}}
    <div>{{text}}</div>
  {{/each}}
</message-model>
```

If you're making data requests in JavaScript, just add one line to do this manually:

```
this.attr( "%root" ).waitFor( promise );
```

The server will wait for all promises registered via `waitFor` before it renders the page. In a full component that might look like this:

```
can.Component.extend({
  tag: "user-name",
  template: can.stache( "{{user.name}}" ),
  viewModel: {
    init: function () {
      var promise = User.getOne( { id: this.attr( "id" ) } );
      this.attr( "%root" ).waitFor( promise );
      promise.then( ( user ) => { this.attr( "user", user ); } );
    }
  }
});
```

<a class="btn" href="https://github.com/canjs/can-ssr"><span>View the Documentation</span></a>
<a class="btn" href="/Guide.html"><span>View the Guide</span></a>

_Server side rendering is a feature of [can-ssr](https://github.com/canjs/can-ssr)_
<div class="matrix-wrapper">
  <div class="matrix-legend" id="js-matrix-legend-affix">
    <div class="title">LEGEND</div>
    <ul>
      <li>
        <img class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
        <div>EXCELLENT</div>
      </li>
      <li>
        <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
        <div>VERY GOOD</div>
      </li>
      <li>
        <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
        <div>GOOD</div>
      </li>
      <li>
        <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
        <div>FAIR</div>
      </li>
      <li>
        <img class="matrix-rating-icon" src="/static/img/icon-poor.svg">
        <div>POOR</div>
      </li>
    </ul>
  </div>
  <div class="table-wrapper">
    <div class="scrollable">
      <table id="js-matrix-table-affix" class="matrix-table responsive">
      <thead>
        <tr>
          <th class="features">FEATURES</th>
          <th><img class="framework-logo" src="/static/img/donejs-logo-matrix.png"></th>
          <th><img class="framework-logo" src="/static/img/angular-logo.png"></th>
          <th><img class="framework-logo" src="/static/img/backbone-logo.png"></th>
          <th><img class="framework-logo" src="/static/img/ember-logo.png"></th>
        </tr>
      </thead>
        <tbody>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-poor.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-poor.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
          <tr>
            <td class="features">
              <div class="feature-description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
            </td>
            <td>
              <img data-toggle="popover" data-placement="right" data-html="true" data-content='<a href="http://www.donejs.com">Vivamus sagittis</a> lacus vel augue laoreet rutrum faucibus.' class="matrix-rating-icon" src="/static/img/icon-excellent.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-very-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-good.svg">
            </td>
            <td>
              <img class="matrix-rating-icon" src="/static/img/icon-fair.svg">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
