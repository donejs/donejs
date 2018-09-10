import { DefineMap, route, RoutePushstate } from 'can';
import 'can-debug#?./is-dev';

const AppViewModel = DefineMap.extend({
  title: {
    default: 'place-my-order',
    serialize: false
  },
  routeData: {
    default: route.data
  },
  pageComponent: {
    async get() {
      let page = this.routeData.page;

      switch(page) {
        case "home":
          let Home = (await import("~/home.component")).default;
          return new Home();
        case "restaurants":
          let RestaurantList = (await import("~/restaurant/list/")).default;
          return new RestaurantList();
        case "order-history":
          let OrderHistory = (await import("~/order/history.component")).default;
          return new OrderHistory();
      }
    }
  }
});

route.urlData = new RoutePushstate();
route.register('{page}', { page: 'home' });
route.register('{page}/{slug}', { slug: null });
route.register('{page}/{slug}/{action}', { slug: null, action: null });

export default AppViewModel;
