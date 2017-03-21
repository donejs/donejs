import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './messages.less';
import view from './messages.stache';
import Message from '../models/message';

export const ViewModel = DefineMap.extend({
  get messagesPromise() {
    return Message.getList({});
  }
});

export default Component.extend({
  tag: 'chat-messages',
  ViewModel,
  view
});
