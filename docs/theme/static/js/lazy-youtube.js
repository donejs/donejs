/**
 * Lazy loads YouTube videos.
 *
 * Plugin initially adds the HQ thumbnail and play button to the .youtube-player div.
 * Once the user clicks the thumbnail, the regular Youtube embed iframe is added.
 *
 * First place the following HTML:
 *
 * <div class="youtube-container">
 *     <div class="youtube-player" data-videoid="C-kM0v9L9UY" data-params="start=16"></div>
 * </div>
 *
 * Run the `lazyYoutube` plugin on DOM ready.
 *
 * $(function(){
 *     $('.youtube-player').lazyYoutube();
 * });
 *
 * @param {String} data-videoid the video id.
 * @param {String} data-params the extra parameters to pass to the Youtube embed URL.
 */
(function($, undefined){
	$.fn.lazyYoutube = function(options) {

    var playButton = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path class="yt-play-button-bg" d="M.66 37.62s.66 4.7 2.7 6.77c2.58 2.71 5.98 2.63 7.49 2.91 5.43.52 23.1.68 23.12.68 0 0 14.29-.02 23.81-.71 1.32-.15 4.22-.17 6.81-2.89 2.03-2.07 2.7-6.77 2.7-6.77s.67-5.52.67-11.04V21.4c0-5.52-.67-11.04-.67-11.04s-.66-4.7-2.7-6.77C62.03.86 59.13.84 57.8.69 48.28 0 34 0 34 0c-.03 0-14.31 0-23.82.69-1.33.15-4.23.17-6.82 2.89-2.04 2.07-2.7 6.77-2.7 6.77S.11 14.85 0 19.8v8.36c.1 4.94.66 9.45.66 9.45z" fill="#1f1f1e" fill-opacity=".9"/><path d="M26.96 13.67l18.37 9.62-18.37 9.55V13.67z" fill="#fff"/><path d="M45.02 23.46l.3-.18-18.36-9.61 16.36 10.67 1.7-.88z" fill="#ccc"/></svg>';
    var defaults = {};

    var config = $.extend(defaults, options);

    return this.each(function(idx, elem) {

        var $elem = $(elem);
        var id = $elem.data('videoid');
        var params = $elem.data('params');
        var videoQuery = '?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&showinfo=0';
        var $playButton, $thumbnail;

        if( typeof params !== 'undefined') {
            videoQuery += '&' + params;
        }

        $elem.append('<img class="youtube-thumb" src="//i.ytimg.com/vi/' + id + '/hqdefault.jpg"><div class="play-button">' + playButton + '</div>');

        $thumbnail = $elem.find('.youtube-thumb');
        $playButton = $elem.find('.play-button');

        $thumbnail.hover(function(){
            $elem.toggleClass('active');
        });

        $elem.one('click', function(){
            // Hide these instead of removing so the popover click handlers can see if
            // these are within the popup window
            $thumbnail.hide();
            $playButton.hide();
            $elem.append('<iframe src="//www.youtube.com/embed/' + id + videoQuery + '" frameborder="0" class="youtube-iframe" allowfullscreen></iframe>');
        });
    });
};
})(jQuery);