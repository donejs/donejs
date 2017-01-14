import $ from 'jquery';
import can from 'can/';
import Event from './event';
import 'can/construct/super/';
import 'can/control/plugin/';
import 'can/view/stache/';
import 'can/list/promise/';
import 'can/map/define/';

import '../components/upcoming-events/upcoming-events';
import '../components/upcoming-event/upcoming-event';

var template = can.stache('<upcoming-events events="{events}"></upcoming-events>');

var UpcomingEvents = can.Control.extend({
  pluginName: 'upcomingEvents',
  defaults: {
    apiKey: null,
    calendarId: null
  }
}, {
  init: function(el, options) {
    this.update(options);
  },
  update: function(options) {
    this._super(options);
    var vm = new ViewModel(options);
    this.element.html(template(vm));
  }
});

export var ViewModel = can.Map.extend({
  define: {
    events: {
      Value: Event.List,
      get: function(currentValue) {
        currentValue.replace(Event.findAll( this.attr() ));
        return currentValue;
      }
    }
  }
});

export default UpcomingEvents;
