import { DefineMap, DefineList, superModel, QueryLogic } from 'can';
import loader from '@loader';

const Status = QueryLogic.makeEnum(["new", "preparing", "delivery", "delivered"]);

const Order = DefineMap.extend('Order', {
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

Order.List = DefineList.extend('OrderList', {
  '#': Order
});

Order.connection = superModel({
  url: loader.serviceBaseURL + '/api/orders',
  Map: Order,
  List: Order.List,
  name: 'order'
});

export default Order;
