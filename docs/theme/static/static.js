steal("./content_list.js",
    "./frame_helper.js",
    "./versions.js",
    "./styles/styles.less!",
    "./prettify",function(ContentList, FrameHelper, Versions){
        var codes = document.getElementsByTagName("code");
        for(var i = 0; i < codes.length; i ++){
            var code = codes[i];
            if(code.parentNode.nodeName.toUpperCase() === "PRE"){
                code.className = code.className +" prettyprint";
            }
        }
        prettyPrint();

        new ContentList(".contents");
        new FrameHelper(".docs");
        new Versions( $("#versions, .sidebar-title:first") );


        $('textarea').click(function(){
            this.select();
        });


        if($('.twitter-follow-button').length) {
            // replace the "Follow @canjs!" link with a little wiget with follower count.
            $('#twitter-wjs').remove();
            !function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (!d.getElementById(id)) {
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, "script", "twitter-wjs");
        }

        $('.triptych .box').hover(function(){}, function(){}).click(function(event){
            var target = $(this).data('target');
            $('html, body').animate({
                scrollTop: $( '#' + target ).offset().top
            }, 500);

        });
        $('.triptych a').click(function(){
            event.stopPropagation();
        });

    });


