import { DefineMap, DefineList, superModel, QueryLogic } from 'can';
import loader from '@loader';
import io from 'steal-socket.io';

const Item = DefineMap.extend({
  seal: false
}, {
  price: 'number'
});

const ItemsList = DefineList.extend({
  '#': Item,
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

const Status = QueryLogic.makeEnum(["new", "preparing", "delivery", "delivered"]);

const Order = DefineMap.extend({
  seal: false
}, {
  '_id': {
    type: 'any',
    identity: true
  },
  name: 'string',
  address: 'string',
  phone: 'string',
  restaurant: 'string',

  status: {
    default: 'new',
    Type: Status
  },
  items: {
    Default: ItemsList
  },
  get total() {
    let total = 0.0;
    this.items.forEach(item =>
        total += parseFloat(item.price));
    return total.toFixed(2);
  },
  markAs(status) {
    this.status = status;
    this.save();
  }
});

Order.List = DefineList.extend({
  '#': Order
});

Order.connection = superModel({
  url: loader.serviceBaseURL + '/api/orders',
  Map: Order,
  List: Order.List,
  name: 'order'
});

const socket = io(loader.serviceBaseURL);

socket.on('orders created', order => Order.connection.createInstance(order));
socket.on('orders updated', order => Order.connection.updateInstance(order));
socket.on('orders removed', order => Order.connection.destroyInstance(order));

export default Order;
