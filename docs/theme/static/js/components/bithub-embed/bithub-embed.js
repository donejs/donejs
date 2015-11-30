import Component from 'can/component/';
import Map from 'can/map/';
import template from './bithub-embed.stache!';
import 'can/map/define/';
import 'can/list/promise/';

export const ViewModel = Map.extend({
  define: {
    bits: {
      value: []
    },
    visibleBits: {
      // This methods will give the three next upcoming
      // events, supplemented by past events if needed
      get: function() {
        let bits = this.attr('bits').attr();
        // The current installed version of can for this version of DocumentJS
        // has neither a sort method nor a sort plugin.
        bits.sort((a,b) => {
          return a.thread_updated_ts - b.thread_updated_ts;
        });
        // get next 3 events, or all future events + past events up to 3
        for (let i=bits.length-1, l = i, now = Date.now(); i>=0; i--) {
          if (bits[i].thread_updated_ts*1000 < now && l-i >= 3) {
            bits = bits.slice(i+1, i+4);
            break;
          }
        }

        return bits;
      }
    }
  }
});

export default Component.extend({
  tag: 'bithub-embed',
  scope: ViewModel,
  template
});
