import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';
import 'can-debug#?./is-dev';

const AppViewModel = DefineMap.extend({
  page: 'string',
  title: {
    default: 'donejs-chat',
    serialize: false
  }
});

route.register('/{page}', { page: 'home' });

export default AppViewModel;
