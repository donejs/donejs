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
  set.props.dotNotation('address.state'),
  set.props.dotNotation('address.city')
);

Restaurant.List = DefineList.extend({
  '#': Restaurant
});

Restaurant.connection = superMap({
  url: loader.serviceBaseURL + '/api/restaurants',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant',
  algebra
});

export default Restaurant;
