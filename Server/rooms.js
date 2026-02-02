const StateManager = require("./state-manager");

const rooms = {
  default: new StateManager()
};

module.exports = rooms;
