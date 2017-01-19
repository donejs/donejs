/* global moment */
import can from 'can/';
// import moment from 'moment'; // added global
import 'can/model/';
import 'can/map/define/';
import 'can/list/promise/';

export const Event = can.Model.extend({
  findAll: 'GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events?key={apiKey}',
  parseModels: function(data, xhr) {
    return data && data.items;
  }
}, {
  define: {
    startTimestamp: {
      get: function() {
        var start = this.attr('start');
        var startDateTime = start.attr('dateTime') || start.attr('date');
        return moment(startDateTime).format('X');
      },
      serialize: true
    }
  }
});

export default Event;
