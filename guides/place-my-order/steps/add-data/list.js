import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import template from './list.stache';
import Restaurant from 'place-my-order/models/restaurant';

export var ViewModel = DefineMap.extend({
  restaurants: {
    value() {
      return Restaurant.getList({});
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  ViewModel: ViewModel,
  template: template
});
