import fixture from 'can-fixture';
import Restaurant from '../restaurant';

const store = fixture.store([{
  _id: 1,
  name: 'Cheese City',
  slug:'cheese-city',
  address: {
    city: 'Casadina',
    state: 'CA'
  },
  images: {
    banner: "node_modules/place-my-order-assets/images/1-banner.jpg",
    owner: "node_modules/place-my-order-assets/images/2-owner.jpg",
    thumbnail: "node_modules/place-my-order-assets/images/3-thumbnail.jpg"
  }
}, {
  _id: 2,
  name: 'Crab Barn',
  slug:'crab-barn',
  address: {
    city: 'Alberny',
    state: 'NT'
  },
  images: {
    banner: "node_modules/place-my-order-assets/images/2-banner.jpg",
    owner: "node_modules/place-my-order-assets/images/3-owner.jpg",
    thumbnail: "node_modules/place-my-order-assets/images/2-thumbnail.jpg"
  }
}], Restaurant.connection.algebra);

fixture('/api/restaurants/{_id}', store);

export default store;
