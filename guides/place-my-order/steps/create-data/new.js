import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './new.less';
import view from './new.stache';
import Restaurant from 'place-my-order/models/restaurant';
import Order from 'place-my-order/models/order';

export const ViewModel = DefineMap.extend({
  slug: 'string',
  saveStatus: '*',
  order: {
    Value: Order
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
  placeOrder(ev) {
    ev.preventDefault();
    let order = this.order;
    order.restaurant = this.restaurant._id;
    this.saveStatus = order.save();
  },
  startNewOrder() {
    this.order = new Order();
    this.saveStatus = null;
  }
});

export default Component.extend({
  tag: 'pmo-order-new',
  ViewModel,
  view
});
