import fixture from 'can-fixture';
import State from '../state';

const store = fixture.store([
  { name: 'Calisota', short: 'CA' },
  { name: 'New Troy', short: 'NT'}
], State.connection.algebra);

fixture('/api/states/{short}', store);

export default store;
