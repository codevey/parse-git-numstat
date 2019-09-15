const { expect } = require('chai');
const parseRename = require('../../lib/parse-rename');

describe('parse-rename', () => {
  it('should return object containg filepath if no rename was detected', () => {
    const nonRename = 'src/Tasks/Microsoft.NET.Build.Extensions.Tasks/Microsoft.NET.Build.Extensions.Tasks.csproj';
    const statObj = parseRename(nonRename);

    expect(statObj).to.deep.equal({ filepath: nonRename });
  });

  it('should return object with renames for a "from => to" rename', () => {
    const fromToRename = '{Dapper.Tests => Dapper.Tests.Performance}/EntityFramework/EFContext.cs';
    const statObj = parseRename(fromToRename);

    expect(statObj).to.deep.equal({
      filepath: 'Dapper.Tests.Performance/EntityFramework/EFContext.cs',
      renames: 'Dapper.Tests/EntityFramework/EFContext.cs',
    });
  });

  it('should return object with renames for a "=> to" rename', () => {
    const toRename =
      'msbuildExtensions/{ => Microsoft}/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets';
    const statObj = parseRename(toRename);

    expect(statObj).to.deep.equal({
      filepath: 'msbuildExtensions/Microsoft/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets',
      renames: 'msbuildExtensions/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets',
    });
  });

  it('should return object with renames for a "from => " rename', () => {
    const toRename =
      'msbuildExtensions/{Microsoft => }/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets';
    const statObj = parseRename(toRename);

    expect(statObj).to.deep.equal({
      filepath: 'msbuildExtensions/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets',
      renames: 'msbuildExtensions/Microsoft/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets',
    });
  });
});
