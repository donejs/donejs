import QUnit from 'steal-qunit';
import cityStore from '~/models/fixtures/cities';
import stateStore from '~/models/fixtures/states';
import restaurantStore from '~/models/fixtures/restaurants';
import { ViewModel } from './list';

QUnit.module('~/restaurant/list', {
  beforeEach() {
    localStorage.clear();
  }
});

QUnit.asyncTest('loads all states', function() {
  var vm = new ViewModel();
  var expectedStates = stateStore.getList({});

  vm.states.then(states => {
    QUnit.deepEqual(states.serialize(), expectedStates.data, 'Got all states');
    QUnit.start();
  });
});

QUnit.asyncTest('setting a state loads its cities', function() {
  var vm = new ViewModel();
  var expectedCities = cityStore.getList({ filter: { state: "CA" } }).data;

  QUnit.equal(vm.cities, null, '');
  vm.state = 'CA';
  vm.cities.then(cities => {
    QUnit.deepEqual(cities.serialize(), expectedCities, 'Got all cities');
    QUnit.start();
  });
});

QUnit.asyncTest('changing a state resets city', function() {
  var vm = new ViewModel();
  var expectedCities = cityStore.getList({ filter: { state : "CA" } }).data;

  QUnit.equal(vm.cities, null, '');
  vm.state = 'CA';
  vm.cities.then(cities => {
    QUnit.deepEqual(cities.serialize(), expectedCities, 'Got all cities');
    vm.state = 'NT';
    QUnit.equal(vm.city, null, 'City reset');
    QUnit.start();
  });
});

QUnit.asyncTest('setting state and city loads a list of its restaurants', function() {
  var vm = new ViewModel();
  vm.bind('city', () => {});
  var expectedRestaurants = restaurantStore.getList({
    filter: { address: { city: "Alberny" } }
  }).data;

  vm.state = 'NT';
  vm.city = 'Alberny';

  vm.restaurants.then(restaurants => {
    QUnit.deepEqual(restaurants.serialize(), expectedRestaurants, 'Fetched restaurants equal to expected');
    QUnit.deepEqual(restaurants.length, 1, 'Got expected number of restaurants');
    QUnit.start();
  });
});
