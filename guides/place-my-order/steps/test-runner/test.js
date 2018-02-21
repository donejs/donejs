import F from 'funcunit';
import QUnit from 'steal-qunit';

import '~/restaurant/list/list-test';

F.attach(QUnit);

QUnit.module('place-my-order functional smoke test', {
  beforeEach() {
    F.open('./development.html');
  }
});

QUnit.test('place-my-order main page shows up', function() {
  F('title').text('place-my-order', 'Title is set');
});
