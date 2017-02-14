import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';

const AppViewModel = DefineMap.extend({
  page: 'string',
  slug: 'string',
  action: 'string',

  title: {
    value: 'place-my-order',
    serialize: false
  }
});

route('{page}', { page: 'home' });
route('{page}/{slug}', { slug: null });
route('{page}/{slug}/{action}', { slug: null, action: null });

export default AppViewModel;
