/* global moment */
import $ from 'jquery';
// import moment from 'moment'; // added globally
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './bithub-bit.stache!';
import 'dotdotdot';

export const ViewModel = Map.extend({
  define: {
    eventDate: {
      get: function() {
        var datetime = moment(this.attr('model.thread_updated_at'), moment.ISO_8601)
        return datetime.format('MMM Do YYYY - h:mma z');
      }
    },
    eventGroup: {
      get: function() {
        return this.attr('model.group_name');
      }
    },
    eventLocation: {
      get: function() {
        // parse location here
        return this.attr('model.location') || '';
      }
    },
    eventBody: {
      get: function() {
        return $(this.attr('model.body'))
          .find('img').attr('src', '').end()
          .find('br + br').remove().end();
      }
    }
  }
});

export default Component.extend({
  tag: 'bithub-bit',
  scope: ViewModel,
  events: {
    inserted: function(el, ev) {
      el.find('.event-description').dotdotdot();
    },
    removed: function(el, ev) {
      el.find('.event-description').dotdotdot('destroy');
    }
  },
  template
});
