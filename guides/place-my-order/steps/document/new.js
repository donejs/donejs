import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './new.less';
import view from './new.stache';
import Restaurant from '~/models/restaurant';
import Order from '~/models/order';

/**
 * @add ~/order/new
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
    * @property {Promise} saveStatus
    *
    * a Promise that contains the status of the order when
    * it is being saved.
    */
  saveStatus: '*',
  /**
   * @property {~/models/order} order
   *
   * the order that is being processed. will
   * be an empty new order inititally.
   */
  order: {
    Default: Order
  },
  /**
    * @property {Promise} restaurantPromise
    *
    * a Promise that contains the restaurant that is being
    * ordered from.
    */
  get restaurantPromise() {
    return Restaurant.get({ _id: this.slug });
  },
  /**
   * @property {~/models/restaurant} restaurant
   *
   * the restaurant that is being ordered from.
   */
  restaurant: {
    get(lastSetVal, resolve) {
      this.restaurantPromise.then(resolve);
    }
  },
  /**
    * @property {Boolean} canPlaceOrder
    *
    * boolean indicating whether the order
    * can be placed.
    */
  get canPlaceOrder() {
    return this.order.items.length;
  },
  /**
   * @function placeOrder
   *
   * save the current order and update the status deferred.
   */
  placeOrder(ev) {
    ev.preventDefault();
    let order = this.order;
    order.restaurant = this.restaurant._id;
    this.saveStatus = order.save();
  },
  /**
   * @function startNewOrder
   *
   * resets the order form, so a new order can be placed.
   */
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
