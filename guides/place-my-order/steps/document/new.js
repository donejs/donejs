import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './new.less';
import template from './new.stache';
import Restaurant from 'place-my-order/models/restaurant';
import Order from 'place-my-order/models/order';

/**
 * @add place-my-order/order/new
 */
export const ViewModel = DefineMap.extend({
  /**
   * @property {string} slug
   *
   * the restaurants slug (short name). will
   * be used to request the actual restaurant.
   */
  slug: 'string',
  /**
   * @property {place-my-order/models/order} order
   *
   * the order that is being processed. will
   * be an empty new order inititally.
   */
  order: {
    value: Order
  },
  /**
    * @property {Promise} saveStatus
    *
    * a Promise that contains the status of the order when
    * it is being saved.
    */
  saveStatus: '*',
  canPlaceOrder: {
    get() {
      let items = this.order.items;
      return items.length;
    }
  },
  /**
   * @function placeOrder
   *
   * save the current order and update the status deferred.
   *
   * @return {boolean} false to prevent the form submission
   */
  placeOrder() {
    let order = this.order;
    order.restaurant = this.restaurant._id;
    this.saveStatus = order.save();
    return false;
  },
  /**
   * @function startNewOrder
   *
   * resets the order form, so a new order can be placed.
   *
   * @return {boolean} false to prevent the form submission
   */
  startNewOrder() {
    this.order = new order();
    this.saveStatus = null;
    return false;
  }
});

export default Component.extend({
  tag: 'pmo-order-new',
  ViewModel: ViewModel,
  template
});
