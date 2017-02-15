import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import loader from '@loader';

const Restaurant = DefineMap.extend({
  seal: false
}, {
  '_id': '*'
});

const algebra = new set.Algebra(
  set.props.id('_id'),
  {
    "address.city": function(restaurantValue, paramValue, restaurant){
      return restaurant['address.city'] === restaurantValue;
    },
    "address.state": function(restaurantValue, paramValue, restaurant){
      return restaurant['address.state'] === restaurantValue;
    }
  }
);

Restaurant.List = DefineList.extend({
  '*': Restaurant
});

Restaurant.connection = superMap({
  url: loader.serviceBaseURL + '/api/restaurants',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant',
  algebra
});

export default Restaurant;
