import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import io from 'steal-socket.io';

const Item = DefineMap.extend({
  price: 'number'
});

const ItemsList = DefineList.extend({
  '*': Item
}, {
  has: function(item) {
    return this.indexOf(item) !== -1;
  },

  toggle: function(item) {
    var index = this.indexOf(item);

    if (index !== -1) {
      this.splice(index, 1);
    } else {
      this.push(item);
    }
  }
});

export const Order = DefineMap.extend({
  seal: false
}, {
  '_id': '*',
  name: 'string',
  address: 'string',
  phone: 'string',
  restaurant: 'string',

  status: {
    value: 'new'
  },
  items: {
    Value: ItemsList
  },
  total: {
    get() {
      let total = 0.0;
      this.items.forEach(item =>
          total += parseFloat(item.price));
      return total.toFixed(2);
    }
  },

  markAs(status) {
    this.status = status;
    this.save();
  }
});

Order.List = DefineList.extend({
  '*': Order
});

export const orderConnection = superMap({
  url: '/api/orders',
  idProp: '_id',
  Map: Order,
  List: Order.List,
  name: 'order'
});

const socket = io();

socket.on('orders created', order => connection.createInstance(order));
socket.on('orders updated', order => connection.updateInstance(order));
socket.on('orders removed', order => connection.destroyInstance(order));

tag('order-model', orderConnection);

export default Order;
