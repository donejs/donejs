import { DefineMap, route } from 'can';
import RoutePushstate from 'can-route-pushstate';
import debug from 'can-debug#?./is-dev';

//!steal-remove-start
if(debug) {
	debug();
}
//!steal-remove-end

const AppViewModel = DefineMap.extend("AppViewModel", {
  page: 'string',
  slug: 'string',
  action: 'string',
  env: {
    default: () => ({NODE_ENV:'development'})
  },
  title: {
    default: 'place-my-order'
  },
  routeData: {
    default: () => route.data
  }
});

route.urlData = new RoutePushstate();
route.register("{page}", { page: "home" });
route.register('{page}/{slug}', { slug: null });
route.register('{page}/{slug}/{action}', { slug: null, action: null });

export default AppViewModel;
