steal.plugins('jquery', 'phui/tabs').then('scrollTo',
	"../../jmvcdoc/resources/highlight",'../../jmvcdoc/resources/languages/javascript','../../jmvcdoc/resources/languages/www',
function(){
	 hljs.initHighlighting();
	$(function(){
		$("code").each(function(){
			hljs.highlightBlock(this)
		})
		$('.tabs').phui_ui_tabs().parent().hide();
		$('h3').click(function(){
			var h3 = $(this)
			h3.next().show('fast', function(){
				
				//$(window).scrollTop(h3.offset().top )
			});
			$.scrollTo(h3,'fast')
		})
	})
		
	
})


.plugins('jquery/event/drop').then(function(){
	$('.drag').live("draginit", function(){})
	$('.drop').live("dropover", function(){
		$(this).addClass('over')
	}).live("dropout", function(){
		$(this).removeClass('over')
	})
})


.plugins('jquery/controller/history','jquery/lang/json').then(function(){
	$.Controller.extend("History",{
		"history.** subscribe" : function(called, data){
			$("#history_record").prepend(called+" "+$.toJSON(data)+"<br/>")
		}
	})
	$("#history").history();
})
.plugins('jquery/event/default').then(function(){
	$('.toggler').live('default.toggle',function(){
		$(this).toggleClass('toggle')
	})
	$('.toggler').live('click',function(){
		$(this).trigger('toggle')
	})
	var count = 0;
	$(document.documentElement).bind('toggle', function(ev){
		if(++count > 5){
			ev.preventDefault();
		}
	})
})
//then
.then(function(){
	$("#destroyME").bind("destroyed",function(){
		alert('destroyed!')
	})
	$("#destroy").bind("click", function(){
		$("#destroyME").remove();
	})
}).plugins('jquery/event/hover').then(function(){
	$('.hovers').live('hoverenter', function(){
		$(this).addClass('hover')
	}).live('hoverleave', function(){
		$(this).removeClass('hover')
	})
}).plugins('jquery/event/select').then( function(){
	var sout, sin;
	$('#select').delegate('.select',"selectin",function(ev){});
	$('#select').delegate('.select',"selectout",function(ev){
		if(!ev.relatedTarget){
			$(this).hide('slow');
		}
	})
}).plugins('jquery/dom/dimensions').then(function(){
	$("#animateOuter").click(function(){
		$('.hasPadding').animate({outerHeight: 100})
	})
}).plugins('jquery/dom/form_params').then(function(){
	$("#fp").submit(function(e){
		e.preventDefault();
		$("#fpOut").text($.toJSON($(this).formParams()))
	})
})
