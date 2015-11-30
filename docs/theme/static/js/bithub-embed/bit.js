/* global moment */
import can from 'can/';
// import moment from 'moment'; // added global
import 'can/model/';
import 'can/map/define/';
import 'can/list/promise/';

export const Bit = can.Model.extend({
  findAll: 'GET http://bithub.com/api/v3/embeds/{hubId}/entities'
}, {
  define: {
    thread_updated_at: {
      set: function(val) {
        var momentThreadUpdatedAt = moment(val);
        this.attr({
          formattedThreadUpdatedAt: momentThreadUpdatedAt.format('LL'),
          formattedThreadUpdatedAtDate: momentThreadUpdatedAt.format('YYYY-MM-DD')
        });
        return val;
      }
    }
  },
  isTumblrImage: function() {
    return this.isPhoto() && this.isTumblr();
  },
  isInstagramImage: function() {
    return this.isPhoto() && this.attr('feed_name') === 'instagram';
  },
  isPhoto: function() {
    return this.attr('type_name') === 'photo';
  },
  isTumblr: function() {
    return this.attr('feed_name') === 'tumblr';
  },
  isTwitterFollow: function() {
    return this.attr('feed_name') === 'twitter' && this.attr('type_name') === 'follow';
  },
  isYoutube: function() {
    return this.attr('feed_name') === 'youtube';
  },
  youtubeEmbedURL: function() {
    return this.attr('url').replace(/watch\?v=/, 'embed/');
  },
  isMeetupEvent: function() {
    return this.attr('feed_name') === 'meetup' && this.attr('type_name') === 'event';
  }
});

export default Bit;
