import { fixture } from 'can';
import State from '../state';

const store = fixture.store([
  { name: 'Calisota', short: 'CA' },
  { name: 'New Troy', short: 'NT'}
], State.connection.queryLogic);

fixture('/api/states/{short}', store);

export default store;
