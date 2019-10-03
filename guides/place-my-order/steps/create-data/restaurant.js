import { DefineMap, DefineList, superModel } from 'can';
import loader from '@loader';
import { ItemsList } from "./item";

const Restaurant = DefineMap.extend({
  seal: false
}, {
  '_id': {
    type: 'any',
    identity: true
  },
  menu:{
    type: {
      lunch: {
        Type: ItemsList
      },
      dinner: {
        Type: ItemsList
      }
    }
  }
});

Restaurant.List = DefineList.extend({
  '#': Restaurant
});

Restaurant.connection = superModel({
  url: loader.serviceBaseURL + '/api/restaurants',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant'
});

export default Restaurant;
