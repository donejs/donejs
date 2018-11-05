import { Component } from 'can';
import './messages.less';
import view from './messages.stache';
import Message from '../models/message';

export default Component.extend({
  tag: 'chat-messages',
  view,
  ViewModel: {
    // EXTERNAL STATEFUL PROPERTIES
    // These properties are passed from another component. Example:
    // value: {type: "number"}

    // INTERNAL STATEFUL PROPERTIES
    // These properties are owned by this component.
    message: { default: "This is the chat-messages component" },

    // DERIVED PROPERTIES
    // These properties combine other property values. Example:
    // get valueAndMessage(){ return this.value + this.message; }
    get messagesPromise() {
      return Message.getList({});
    },

    // METHODS
    // Functions that can be called by the view. Example:
    // incrementValue() { this.value++; }

    // SIDE EFFECTS
    // The following is a good place to perform changes to the DOM
    // or do things that don't fit in to one of the areas above.
    connectedCallback(element){

    }
  }
});
