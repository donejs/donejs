import Component from 'can/component/';
import Map from 'can/map/';
import template from './upcoming-events.stache!';
import 'can/map/define/';
import 'can/list/promise/';

export const ViewModel = Map.extend({
  define: {
    events: {
      value: []
    },
    visibleEvents: {
      // This methods will give the three next upcoming
      // events, supplemented by past events if needed
      get: function() {
        let events = this.attr('events').serialize();

        // Filter out recurring events (like the contributors meeting)
        events = events.filter(function(event) {
          return !event.recurringEventId;
        });

        // The current installed version of can for this version of DocumentJS
        // has neither a sort method nor a sort plugin.
        events.sort((a,b) => {
          return a.startTimestamp - b.startTimestamp;
        });

        // get next 3 events, or all future events + past events up to 3
        for (let i=events.length-1, l = i, now = Date.now(); i>=0; i--) {
          if (events[i].startTimestamp*1000 < now && l-i >= 3) {
            events = events.slice(i+1, i+4);
            break;
          }
        }

        return events;
      }
    }
  }
});

export default Component.extend({
  tag: 'upcoming-events',
  scope: ViewModel,
  template
});
