import { Component } from 'can';
import './list.less';
import view from './list.stache';
import Restaurant from '~/models/restaurant';
import State from '~/models/state';
import City from '~/models/city';

const RestaurantList = Component.extend({
  tag: 'pmo-restaurant-list',
  view,
  ViewModel: {
    // EXTERNAL STATEFUL PROPERTIES
    // These properties are passed from another component. Example:
    // value: {type: "number"}

    // INTERNAL STATEFUL PROPERTIES
    // These properties are owned by this component.
    get states() {
      return State.getList();
    },
    state: {
      type: 'string',
      default: null
    },
    get cities() {
      let state = this.state;

      if(!state) {
        return null;
      }

      return City.getList({ filter: { state } });
    },
    city: {
      type: 'string',
      value({lastSet, listenTo, resolve}) {
        listenTo(lastSet, resolve);
        listenTo('state', () => resolve(null));
        resolve(null)
      }
    },
    get restaurants() {
      let state = this.state;
      let city = this.city;

      if(state && city) {
        return Restaurant.getList({
          filter: {
            'address.state': state,
            'address.city': city
          }
        });
      }

      return null;
    },

    // DERIVED PROPERTIES
    // These properties combine other property values. Example:
    // get valueAndMessage(){ return this.value + this.message; }

    // METHODS
    // Functions that can be called by the view. Example:
    // incrementValue() { this.value++; }

    // SIDE EFFECTS
    // The following is a good place to perform changes to the DOM
    // or do things that don't fit in to one of the areas above.
    connectedCallback(element){

    }
  }
});

export default RestaurantList;
export const ViewModel = RestaurantList.ViewModel;
