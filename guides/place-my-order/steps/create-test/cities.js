import { fixture } from 'can';
import City from '../city';

const store = fixture.store([
  { state: 'CA', name: 'Casadina' },
  { state: 'NT', name: 'Alberny' }
], City.connection.queryLogic);

fixture('/api/cities/{name}', store);

export default store;
