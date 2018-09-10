import { DefineMap, route, RoutePushstate } from 'can';
import 'can-debug#?./is-dev';

const AppViewModel = DefineMap.extend({
  title: {
    default: 'place-my-order',
    serialize: false
  },
  routeData: {
    default: route.data
  }
});

route.urlData = new RoutePushstate();
route.register('{page}', { page: 'home' });
route.register('{page}/{slug}', { slug: null });
route.register('{page}/{slug}/{action}', { slug: null, action: null });

export default AppViewModel;
