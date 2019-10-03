const { expect } = require('chai');
const parseTags = require('../../lib/parse-tags');

describe('parse-tags', () => {
  it('should parse an undefined decoration as undefined', () => {
    const tags = parseTags(undefined);

    expect(tags).to.be.undefined;
  });

  it('should parse a decoration with a tag', () => {
    const tags = parseTags('tag: refs/tags/v0.1.27');

    expect(tags).to.deep.equal(['refs/tags/v0.1.27']);
  });

  it('should parse a decoration with multiple tags', () => {
    const tags = parseTags('tag: refs/tags/v0.1.27, tag: refs/tags/0.1.27');

    expect(tags).to.deep.equal(['refs/tags/v0.1.27', 'refs/tags/0.1.27']);
  });

  it('should parse a decoration containing other refs than tags', () => {
    const tags = parseTags('tag: refs/tags/v6.10.3, refs/remotes/origin/release-next-6.10.3');

    expect(tags).to.deep.equal(['refs/tags/v6.10.3']);
  });
});
