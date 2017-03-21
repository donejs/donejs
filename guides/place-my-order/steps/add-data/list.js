import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './list.less';
import view from './list.stache';
import Restaurant from 'place-my-order/models/restaurant';

export const ViewModel = DefineMap.extend({
  restaurants: {
    value() {
      return Restaurant.getList({});
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  ViewModel,
  view
});
