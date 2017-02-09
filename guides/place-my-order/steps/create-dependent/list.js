import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import template from './list.stache';
import Restaurant from 'place-my-order/models/restaurant';
import State from 'place-my-order/models/state';
import City from 'place-my-order/models/city';

export var ViewModel = DefineMap.extend({
  states: {
    get() {
      return State.getList({});
    }
  },
  state: {
    type: 'string',
    value: null,
    set() {
      // Remove the city when the state changes
      this.city = null;
    }
  },
  cities: {
    get() {
      let state = this.state;

      if(!state) {
        return null;
      }

      return City.getList({ state });
    }
  },
  city: {
    type: 'string',
    value: null
  },
  restaurants: {
    get() {
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
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  ViewModel: ViewModel,
  template: template
});
