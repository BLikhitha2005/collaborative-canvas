class StateManager {
  constructor() {
    this.strokes = [];
  }

  addStroke(stroke) {
    this.strokes.push(stroke);
  }

  undo(userId) {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      if (this.strokes[i].userId === userId) {
        this.strokes.splice(i, 1);
        break;
      }
    }
  }

  getAll() {
    return this.strokes;
  }
}

module.exports = StateManager;
