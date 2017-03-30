import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './donejs-number-input.less';
import view from './donejs-number-input.stache';

export const ViewModel = DefineMap.extend({
	value: {
		value: 0,
		type: 'number',
		set(value) {
			if(value > this.max) {
				return this.max;
			}

			if(value < this.min) {
				return this.min;
			}

			return value;
		}
	},
	max: {
		value: Infinity,
		type: 'number'
	},
	min: {
		value: 0,
		type: 'number'
	},
	increment() {
		this.value++;
	},
	decrement() {
		this.value--;
	}
});

export default Component.extend({
	tag: 'donejs-number-input',
	ViewModel,
	view
});
