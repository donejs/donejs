import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import loader from '@loader';

const Item = DefineMap.extend({
  price: 'number'
});

const ItemsList = DefineList.extend({
  '#': Item
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

const Order = DefineMap.extend({
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

const algebra = new set.Algebra(
  set.props.id('_id')
);

Order.List = DefineList.extend({
  '#': Order
});

Order.connection = superMap({
  url: loader.serviceBaseURL + '/api/orders',
  Map: Order,
  List: Order.List,
  name: 'order',
  algebra
});

export default Order;
