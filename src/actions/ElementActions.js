var Reflux = require('reflux');

var ElementActions = Reflux.createActions([
  'createElement',
  'editElement',
  'deleteElement',
  'updateElements',
  'save'
]);

module.exports = ElementActions;
