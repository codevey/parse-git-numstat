module.exports = class Cursor {
  constructor(lines) {
    this.lines = lines;
    this.idx = -1;
  }

  hasNext() {
    return this.idx + 1 < this.lines.length;
  }

  next() {
    this.idx++;
    return this.current();
  }

  nextWhile(condition) {
    const lines = [];

    while (condition(this.next())) {
      lines.push(this.current());
    }

    return lines;
  }

  current() {
    return this.lines[this.idx];
  }

  peek() {
    return this.lines[this.idx + 1];
  }

  index() {
    return this.idx;
  }
};
