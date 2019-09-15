module.exports = function matchGroups(regex, text) {
  const match = text.match(regex);

  if (!match) {
    return false;
  }

  if (!match.groups) {
    return false;
  }

  return match.groups;
};
