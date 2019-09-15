const matchGroups = require('./match-groups');

module.exports = function(filepath) {
  const renames = matchGroups(/(?<prefix>.*)\{(?<from>.*)\s=>\s(?<to>.*)\}(?<postfix>.*)/, filepath);

  if (!renames) {
    return {
      filepath,
    };
  }

  return {
    filepath: `${renames.prefix}${renames.to}${renames.postfix}`.replace('//', '/'),
    renames: `${renames.prefix}${renames.from}${renames.postfix}`.replace('//', '/'),
  };
};
