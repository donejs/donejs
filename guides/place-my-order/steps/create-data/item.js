import { DefineMap, DefineList} from 'can';

export const Item = DefineMap.extend({
  seal: false
}, {
  price: 'number'
});

export const ItemsList = DefineList.extend({
  '#': Item,
  has: function(item) {
    return this.indexOf(item) !== -1;
  },

  toggle: function(item) {
    var index = this.indexOf(item);

    if (index !== -1) {
      this.splice(index, 1);
    } else {
      this.push(item);
    }
  }
});
