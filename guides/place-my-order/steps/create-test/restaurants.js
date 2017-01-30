import fixture from 'can-fixture';

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
}],{
  "address.city": function(restaurantValue, paramValue, restaurant){
    return restaurant.address.city === paramValue;
  },
  "address.state": function(restaurantValue, paramValue, restaurant){
    return restaurant.address.state === paramValue;
  }
});

fixture({
  'GET /api/restaurants': store.findAll,
  'GET /api/restaurants/{id}': store.findOne,
  'POST /api/restaurants': store.create,
  'PUT /api/restaurants/{id}': store.update,
  'DELETE /api/restaurants/{id}': store.destroy
});

export default store;
