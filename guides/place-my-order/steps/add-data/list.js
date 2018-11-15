import { Component } from 'can';
import './list.less';
import view from './list.stache';
import Restaurant from '~/models/restaurant';

const RestaurantList = Component.extend({
  tag: 'pmo-restaurant-list',
  view,
  ViewModel: {
    // EXTERNAL STATEFUL PROPERTIES
    // These properties are passed from another component. Example:
    // value: {type: "number"}

    // INTERNAL STATEFUL PROPERTIES
    // These properties are owned by this component.
    restaurants: {
      default() {
        return Restaurant.getList({});
      }
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


import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './list.less';
import view from './list.stache';
import Restaurant from '~/models/restaurant';

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
