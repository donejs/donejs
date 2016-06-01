import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './messages.less';
import template from './messages.stache';
import Message from '../models/message';

export const ViewModel = DefineMap.extend({
  name: 'string',
  body: 'string',

  send(event) {
    event.preventDefault();

    new Message({
      name: this.name,
      body: this.body
    }).save().then(msg => this.body = '');
  }
});

export default Component.extend({
  tag: 'chat-messages',
  ViewModel: ViewModel,
  template
});
