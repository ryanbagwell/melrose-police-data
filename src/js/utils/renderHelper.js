import React from 'react';
import ReactDOM from 'react-dom';

export default function(component, container, props = {}, callback = function() {}) {

  if (typeof component === 'function') {
    component = React.createElement(component, props);
  }

  if (typeof (container) === 'string') {
    container = document.getElementById(container) || document.querySelector(container);
  }

  if (typeof (container) !== 'undefined') {
    return ReactDOM.render(component, container, callback);
  }

  return null;

}
