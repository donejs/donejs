@page done Upgrading to 3.3
@parent tutorials 11

JavaScriptMVC 3.3 introduces a lot of new features to build large and responsive applications. As such, there are a few changes from 3.2 and this guide walks through the API differences between the versions.

## CanJS

[canjs Can] has replaced the previous MVC internals of JavaScript MVC, but provides backwards compatability to jQuery MX. jQuery MX $.Class, $.Model, and $.Controller will not be supported in future versions, and we urge you to switch to using can.

## Steal

[stealjs Steal] in 3.3 has support for AMD modules. Steal will still load resources as 3.2, however will also now follow the pattern for dependencies represented by a string id.

So, as a simple example:

	steal('fooResource', function(foo) {});

In the above example, "foo" refers to the module returned by fooResource/fooResource.js.

This leads to the gotcha when defining "$" in the previous syntax. So code that used to look like:

	steal('jquery', 'someResource')
	.then('someController', function($) {});

The above will not work as expected, because "$" will refer to a module returned by "someController" or undefined. In 3.3, a simple change will fix this issue for jQuery users:

	steal('jquery', 'someResource')
	.then('someController', function() {});

## $.Class.prototype.callback

"callback" has been deprecated and is now "proxy" to match jQuery's API.

3.2:

	$.Controller('foo', {}, {
		init: function() {
			$.get('/resource', this.callback('render'));
		},

		render: function() {}
	});

3.3:

	$.Controller('foo', {}, {
		init: function() {
			$.get('/resource', this.proxy('render'));
		},

		render: function() {}
	});

## $.View

$.View() now returns a document fragment to aid with faster rendering within your application. However, when nesting templates, you'll need the actual html string returned by $.View.render as opposed to the document fragment.

Within your EJS templates in 3.2:

	<div>
		<%== $.View('//sometemplate.ejs', {}) %>
	</div>

3.3:

	<div>
		<%== $.View.render('//sometemplate.ejs', {}) %>
	</div>