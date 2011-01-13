steal.loadedProductionCSS = true;

steal
	.plugins('steal/less')
	.then(function($){
		steal.less('site')
	})
	.plugins('jquery/controller', 'jquery/view/ejs')
	.then(function($){

jQuery.Controller.extend('Feed',
/* @Static */
{
},
/* @Prototype */
{
	date_template: '{day}, {date} {month} {year}',
	days : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	linkify : function(text){
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(exp,"<a href='$1'>$1</a>");
	},
	formatDate : function(date_string){
		var date = new Date(date_string);
		return $.String.sub(this.date_template, {
			day: this.days[date.getDay()],
			date: date.getDate(),
			month: this.months[date.getMonth()],
			year: date.getFullYear()
		});
	}
});


Feed.extend('TwitterFeed',
/* @Static */
{
},
/* @Prototype */
{
	template: "<li><p>{tweet}</p><div class='date'>{date}</div></li>",
	init : function(){
		var twitterUrl = 'http://twitter.com/status/user_timeline/javascriptmvc.json?count=30';
		$.ajax({
			url: twitterUrl,
			dataType: 'jsonp',
			success: this.callback('insertTwitterFeed')
		});
	},
	insertTwitterFeed : function(data){
		var tweets = [];
		for(var i = 0, ii = data.length; i < ii; i++){ //Filter out direct replies
			var tweet = data[i];
			if(tweet.text.charAt(0) != '@' && tweets.length < 6){
				var formattedDate = this.formatDate(tweet.created_at);
				tweets.push($.String.sub(this.template, {tweet: this.linkify(tweet.text), date: formattedDate}));
			}
		}
		this.element.html('<ul>' + tweets.join('') + '</ul>');
	},
	linkify : function(text){
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(exp,"<a href='$1'>$1</a>");
	}
});

Feed.extend('ForumFeed',
/* @Static */
{
	loadData : function(data){
		$('#forum-feed').data("controllers")['forum_feed'].insertForumFeed(data.value.items);
	}
},
/* @Prototype */
{
	template : '<li><a href="{href}"><strong>{title}</strong>{author} - {date}</a></li>',
	init : function(){
		var forumUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_id=a6c6d9c200823b78d02087c6ea16b9ad&_render=json&_callback=ForumFeed.loadData';
		$.ajax({
			url: forumUrl,
			dataType: 'script'
		});
	},
	insertForumFeed : function(data){
		var html = [];
		for(var i = 0, ii = data.length; i < 6 && i < data.length; i++){
			var d = {
				title  : data[i].title,
				author : data[i]['dc:creator'],
				date   : this.formatDate(data[i].pubDate),
				href   : data[i].link
			}
			html.push($.String.sub(this.template, d));
		}
		if(html.length > 0){
			this.element.find('ul').html(html.join(''));
		}
	}
});

Feed.extend('BlogFeed',
/* @Static */
{
	loadData : function(data){
		$('#blog').data("controllers")['blog_feed'].insertBlogFeed(data.news);
	}
},
/* @Prototype */
{
	init : function(){
		var forumUrl = 'http://jupiterjs.com/news/feed/javascriptmvc.json?callback=BlogFeed.loadData';
		$.ajax({
			url: forumUrl,
			dataType: 'script'
		});
	},
	formatDate : function(date_string){
		var parts = date_string.split("-"),
			date = parts[2].split("T")[0];
		return {
			date: parseInt(date, 10),
			month: this.months[parseInt(parts[1], 10)-1],
			year: parseInt(parts[0], 10)
		};
	},
	insertBlogFeed : function(data){
		var html = [], d, date, li;
		for(var i = 0, ii = data.length; i < 6 && i < data.length; i++){
			date = this.formatDate(data[i].publish_date);
			d = {
				title  : data[i].title,
				month  : date.month,
				date   : date.date,
				year   : date.year,
				body   : data[i].body,
				id	   : data[i].id
			}
			li = $.View("//jmvc/site/views/blog.ejs", d);
			html.push(li);
		}
		if(html.length > 0){
			this.element.html(html.join(''));
		}
	}
});

$('#twitter-feed').twitter_feed();
$('#forum-feed').forum_feed();
$('#blog').blog_feed();

// for the builder page
$(document).ready(function(){
	if ($("#jquerymx").length) {
		$("<link href='../../jmvc/site/builder.css' rel='stylesheet' type='text/css' />")
			.appendTo($("#jquerymx iframe")[0].contentDocument.body);
	}
})

});