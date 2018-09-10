import { DefineMap, route, RoutePushstate, value } from 'can';
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
          if(this.routeData.slug) {
            if(this.routeData.action === "order") {
                let OrderNew = (await import("~/order/new")).default;
                return new OrderNew({
                  viewModel: {
                    slug: value.from(this.routeData, "slug")
                  }
                });
            } else {
              let RestaurantDetails = (await import("~/restaurant/details.component")).default;
              return new RestaurantDetails({
                viewModel: {
                  value.from(this.routeData, "slug")
                }
              });
            }
          }
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
