import $ from 'jquery';
import can from 'can/';
import Bit from './bit';
import 'can/construct/super/';
import 'can/control/plugin/';
import 'can/view/stache/';
import 'can/list/promise/';
import 'can/map/define/';

import '../components/bithub-embed/bithub-embed';
import '../components/bithub-bit/bithub-bit';

var template = can.stache('<bithub-embed bits="{bits}"></bithub-embed>');

var BithubEmbed = can.Control.extend({
  pluginName: 'bithubEmbed',
  defaults: {
    hubId: null,
    tenant_name: null,
    view: 'public',
    offset: 0,
    limit: 50
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
    bits: {
      Value: Bit.List,
      get: function(currentValue) {
        currentValue.replace(Bit.findAll( this.attr() ));
        return currentValue;
      }
    }
  }
});

export default BithubEmbed;
