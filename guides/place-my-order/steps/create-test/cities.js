import fixture from 'can-fixture';
import City from '../city';

const store = fixture.store([
  { state: 'CA', name: 'Casadina' },
  { state: 'NT', name: 'Alberny' }
], City.connection.algebra);

fixture('/api/cities/{name}', store);

export default store;
