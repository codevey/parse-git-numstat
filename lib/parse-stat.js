const matchGroups = require('./match-groups');
const parseRename = require('./parse-rename');

module.exports = function parseStat(cursor) {
  if (!cursor.hasNext() || cursor.peek().indexOf('commit ') === 0) {
    return [];
  }

  return cursor
    .nextWhile(line => line.length > 0)
    .map(line => matchGroups(/(?<added>\d+|-)\s+(?<deleted>\d+|-)\s+(?<filepath>.+)/, line))
    .map(stat => Object.assign({}, stat, parseRename(stat.filepath)))
    .map(parseStatLine);
};

function parseStatLine(stat) {
  if (stat.added == '-' || stat.deleted == '-') {
    return Object.assign({}, stat, { added: null, deleted: null, binary: true });
  }

  return Object.assign({}, stat, {
    added: parseInt(stat.added, 10),
    deleted: parseInt(stat.deleted, 10),
  });
}
