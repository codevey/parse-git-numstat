const { expect } = require('chai');
const parseBranches = require('../../lib/parse-branches');

describe('parse-branches', () => {
  it('should parse an undefined decoration as undefined', () => {
    const branches = parseBranches(undefined);

    expect(branches).to.be.undefined;
  });

  it('should parse a decoration with a branch', () => {
    const branches = parseBranches('origin/release-v6.11.1');

    expect(branches).to.deep.equal(['origin/release-v6.11.1']);
  });

  it('should parse a decoration with multiple branches', () => {
    const branches = parseBranches('origin/release-v6.11.1, origin/release-6.11.1');

    expect(branches).to.deep.equal(['origin/release-v6.11.1', 'origin/release-6.11.1']);
  });

  it('should parse a decoration containing other refs than branches', () => {
    const branches = parseBranches('tag: v6.11.1, origin/release-v6.11.1, origin/release-6.11.1');

    expect(branches).to.deep.equal(['origin/release-v6.11.1', 'origin/release-6.11.1']);
  });
});
