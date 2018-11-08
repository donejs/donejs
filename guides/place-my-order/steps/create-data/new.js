import { Component } from 'can';
import './new.less';
import view from './new.stache';
import Restaurant from '~/models/restaurant';
import Order from '~/models/order';

export const PmoOrderNew = Component.extend({
  tag: 'pmo-order-new',
  view,
  ViewModel: {
    // EXTERNAL STATEFUL PROPERTIES
    // These properties are passed from another component. Example:
    // value: {type: "number"}
    slug: 'string',

    // INTERNAL STATEFUL PROPERTIES
    // These properties are owned by this component.
    saveStatus: '*',
    order: {
      Default: Order
    },
    get restaurantPromise() {
      return Restaurant.get({ _id: this.slug });
    },
    restaurant: {
      get(lastSetVal, resolve) {
        this.restaurantPromise.then(resolve);
      }
    },
    get canPlaceOrder() {
      return this.order.items.length;
    },

    // DERIVED PROPERTIES
    // These properties combine other property values. Example:
    // get valueAndMessage(){ return this.value + this.message; }

    // METHODS
    // Functions that can be called by the view. Example:
    // incrementValue() { this.value++; }
    placeOrder(ev) {
      ev.preventDefault();
      let order = this.order;
      order.restaurant = this.restaurant._id;
      this.saveStatus = order.save();
    },
    startNewOrder() {
      this.order = new Order();
      this.saveStatus = null;
    },

    // SIDE EFFECTS
    // The following is a good place to perform changes to the DOM
    // or do things that don't fit in to one of the areas above.
    connectedCallback(element){

    }
  }
});

export default PmoOrderNew;
export const ViewModel = PmoOrderNew.ViewModel;
