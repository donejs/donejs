import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './list.stache';
import Restaurant from 'place-my-order/models/restaurant';

export var ViewModel = Map.extend({
  define: {
    restaurants: {
      value() {
        return Restaurant.getList({});
      }
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  viewModel: ViewModel,
  template: template
});
