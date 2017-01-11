import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './new.less';
import view from './new.stache';
import Restaurant from 'place-my-order/models/restaurant';
import Order from 'place-my-order/models/order';

export const ViewModel = DefineMap.extend({
  slug: 'string',
  order: {
    Value: Order
  },
  saveStatus: '*',
  canPlaceOrder: {
    get() {
      let items = this.order.items;
      return items.length;
    }
  },
  placeOrder() {
    let order = this.order;
    order.restaurant = this.restaurant._id;
    this.saveStatus = order.save();
    return false;
  },
  startNewOrder() {
    this.order = new Order();
    this.statusStatus = null;
    return false;
  }
});

export default Component.extend({
  tag: 'pmo-order-new',
  ViewModel,
  view
});
