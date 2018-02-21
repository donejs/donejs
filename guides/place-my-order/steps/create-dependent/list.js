import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './list.less';
import view from './list.stache';
import Restaurant from '~/models/restaurant';
import State from '~/models/state';
import City from '~/models/city';

export const ViewModel = DefineMap.extend({
  get states() {
    return State.getList({});
  },
  state: {
    type: 'string',
    default: null,
    set() {
      // Remove the city when the state changes
      this.city = null;
    }
  },
  get cities() {
    let state = this.state;

    if(!state) {
      return null;
    }

    return City.getList({ state });
  },
  city: {
    type: 'string',
    default: null
  },
  get restaurants() {
    let state = this.state;
    let city = this.city;

    if(state && city) {
      return Restaurant.getList({
        'address.state': state,
        'address.city': city
      });
    }

    return null;
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  ViewModel,
  view
});
