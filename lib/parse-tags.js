module.exports = function parseTags(decoration) {
  if (!decoration) {
    return;
  }

  const prefix = 'tag: ';
  const tags = decoration
    .split(',')
    .map(d => d.trim())
    .filter(d => d && d.startsWith(prefix))
    .map(d => d.substring(prefix.length));

  return tags;
};
