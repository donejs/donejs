/* global moment */
import $ from 'jquery';
// import moment from 'moment'; // added globally
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './upcoming-event.stache!';
import 'dotdotdot';

export const ViewModel = Map.extend({
  define: {
    eventBody: {
      get: function() {
        return (this.attr('model.description') || '').trim();
      }
    },
    eventDate: {
      get: function() {
        var start = this.attr('model.start');
        var startDate = start.attr('date');
        var startDateTime = start.attr('dateTime');
        if (startDateTime) {
          var datetime = moment.tz(startDateTime, 'America/Chicago').tz(start.attr('timeZone'));
          return datetime.format('MMM Do, YYYY — h:mma');
        } else if (startDate) {
          var date = moment(startDate, moment.ISO_8601);
          return date.format('MMM Do, YYYY');
        }
      }
    },
    eventGroup: {
      get: function() {
        var lastLineSplit = this.attr('lastDescriptionLineSplit');
        return (lastLineSplit[0] || '').trim();
      }
    },
    eventLocation: {
      get: function() {
        return this.attr('model.location') || '';
      }
    },
    lastDescriptionLineSplit: {
      get: function() {
        var description = (this.attr('model.description') || '').trim();
        var lines = description.split(/\r?\n/);
        var lastLine = (lines.length) ? lines[lines.length - 1] : '';
        return lastLine.split(': ', 2);
      }
    },
    url: {
      get: function() {
        var lastLineSplit = this.attr('lastDescriptionLineSplit');
        return (lastLineSplit[1] || '').trim();
      }
    }
  }
});

export default Component.extend({
  tag: 'upcoming-event',
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
