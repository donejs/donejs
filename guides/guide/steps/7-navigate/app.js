import { DefineMap, route, RoutePushstate } from 'can';
import 'can-debug#?./is-dev';

const AppViewModel = DefineMap.extend({
  env: {
    default: () => ({NODE_ENV:'development'}),
    serialize: false
  },
  title: {
    default: '<%= name %>',
    serialize: false
  },
  routeData: {
    default: route.data
  },
  pageComponent: {
    async get() {
      let page = this.routeData.page;
      let Component = (await import(`~/components/${page}/`)).default;
      return new Component();
    }
  }
});

route.urlData = new RoutePushstate();
route.register("{page}", { page: "home" });

export default AppViewModel;
