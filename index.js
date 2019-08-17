const matchGroups = require('./lib/match-groups');
const dayjs = require('dayjs');

module.exports = function (log) {
  const parsedLog = [];

  const lines = log.split(/\r?\n/g);
  const cursor = new Cursor(lines);

  while (cursor.hasNext() && cursor.peek().length > 0) {
    const sha = matchGroups(/commit\s(?<sha>.*)/, cursor.next()).sha;

    if (!sha) {
      throw new Error(`Could not parse git log entry with no sha given at line ${cursor.index()}`);
    }

    // TODO: Parse author!
    let author = cursor.next();
    let merge = null;

    if (author.indexOf('Merge') >= 0) {
      merge = author;
      author = cursor.next();
    }

    if (!author) {
      throw new Error(`Could not parse git log entry with no author given at line ${cursor.index()}`);
    }

    const dateRaw = matchGroups(/Date:\s+\w+\s(?<date>.*)/, cursor.next()).date;
    const date = dayjs(dateRaw, 'MMM D HH:mm:ss YYYY ZZ').toDate();

    // skip newline
    cursor.next();

    const message = cursor
      .nextWhile(line => line.length > 0)
      .map(line => line.trim())
      .reduce((accumulator, current, idx) => idx === 0 ? current : accumulator + '\n' + current, '');

    const stat = parseStat(cursor);

    // skip trailing newline - already done by nextWhile
    // cursor.next()

    parsedLog.push({
      sha,
      author: matchGroups(/Author:\s(?<name>.*?)\s<(?<email>.*?)>/, author),
      merge,
      date,
      message,
      stat
    });
  }

  return parsedLog;
};

function parseStat (cursor) {
  if (!cursor.hasNext() || cursor.peek().indexOf('commit ') === 0) {
    return [];
  }

  return cursor
    .nextWhile(line => line.length > 0)
    .map(line => matchGroups(/(?<added>\d+|-)\s+(?<deleted>\d+|-)\s+(?<filepath>.+)/, line))
    .map(stat => {
      const renames = matchGroups(/(?<prefix>.*)\{(?<from>.+)\s=>\s(?<to>.+)\}(?<postfix>.*)/, stat.filepath);

      if (!renames) {
        return stat;
      }

      return Object.assign({}, stat, {
        filepath: `${renames.prefix}${renames.to}${renames.postfix}`,
        renames: `${renames.prefix}${renames.from}${renames.postfix}`
      });
    })
    .map(stat => Object.assign({}, stat, {
      added: stat.added === '-' ? null : parseInt(stat.added, 10),
      deleted: stat.deleted === '-' ? null : parseInt(stat.deleted, 10)
    }));
}

class Cursor {
  constructor (lines) {
    this.lines = lines;
    this.idx = -1;
  }

  hasNext () {
    return (this.idx + 1) < this.lines.length;
  }

  next () {
    this.idx++;
    return this.current();
  }

  nextWhile (condition) {
    const lines = [];

    while (condition(this.next())) {
      lines.push(this.current());
    }

    return lines;
  }

  current () {
    return this.lines[this.idx];
  }

  peek () {
    return this.lines[this.idx + 1];
  }

  index () {
    return this.idx;
  }
}
