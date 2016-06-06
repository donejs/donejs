import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';

const AppViewModel = DefineMap.extend({
  route: "string",
  page: "string",
  slug: "string",
  action: "string",

  message: {
    value: 'Hello World!',
    serialize: false
  },
  title: {
    value: 'place-my-order',
    serialize: false
  }
});

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

export default AppViewModel;
