const { expect } = require('chai');
const matchGroups = require('../../lib/match-groups');

describe('match-groups', () => {
  it('should build object from match groups', () => {
    const author = matchGroups(/Author:\s(?<name>.*?)\s<(?<email>.*?)>/, 'Author: saintedlama <christoph.walcher@gmail.com>');

    expect(author).to.deep.equal({ name: 'saintedlama', email: 'christoph.walcher@gmail.com' });
  });
});
