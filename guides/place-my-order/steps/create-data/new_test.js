import QUnit from 'steal-qunit';
import { ViewModel } from './new';

// ViewModel unit tests
QUnit.module('place-my-order/order/new');

QUnit.test('canPlaceOrder', function(){
  var vm = new ViewModel({
    order: { items: [1] }
  });
  QUnit.equal(vm.attr('canPlaceOrder'), true, 'can place an order');
});
