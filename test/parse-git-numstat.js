const parseLog = require('../');
const { expect } = require('chai');

describe('parse-git-numstat', () => {
  it('should parse one log entry', () => {
    const parsedLogEntries = parseLog(initialCommit);

    expect(parsedLogEntries).to.have.length(1);

    const parsedLogEntry = parsedLogEntries[0];
    expect(parsedLogEntry.sha).to.equal('c8ebaf0b5af9db85b7694f07261ef2d0a651c27c');
    expect(parsedLogEntry.author).to.deep.equal({ name: 'saintedlama', email: 'christoph.walcher@gmail.com' });
    expect(parsedLogEntry.date).to.deep.equal(new Date(Date.UTC(2019, 5, 1, 15, 49, 20)));

    expect(parsedLogEntry.message).to.equal('chore: initial commit');
    expect(parsedLogEntry.stat).to.have.length(10);
    expect(parsedLogEntry.stat[0]).to.deep.equal({ added: 16, deleted: 0, filepath: '.editorconfig' });
  });

  it('should parse multiple log entry', () => {
    const parsedLogEntries = parseLog(multipleCommits);

    expect(parsedLogEntries).to.have.length(3);

    expect(parsedLogEntries[0].sha).to.equal('c8ebaf0b5af9db85b7694f07261ef2d0a651c27c');
    expect(parsedLogEntries[1].sha).to.equal('94b289c2987aca16a299b989dd47183e573d0b4f');
    expect(parsedLogEntries[2].sha).to.equal('4e665307bc02af812f6b11626f685b7246e19451');
  });

  it('should parse log entry from binary line stat', () => {
    const parsedLogEntries = parseLog(commitWithNonNumericLinestat);

    expect(parsedLogEntries).to.have.length(1);

    const parsedLogEntry = parsedLogEntries[0];
    expect(parsedLogEntry.sha).to.equal('56abcad5df3424ba2c8f9079f8ddf00ac992bef9');

    expect(parsedLogEntry.stat[0]).to.deep.equal({
      filepath: 'NHibernate/Iesi.Collections.dll',
      binary: true,
      added: null,
      deleted: null,
    });

    expect(parsedLogEntry.stat[1]).to.deep.equal({
      filepath: 'NHibernate/LinFu.DynamicProxy.dll',
      binary: true,
      added: null,
      deleted: null,
    });

    expect(parsedLogEntry.stat[2]).to.deep.equal({
      filepath: 'NHibernate/NHibernate.ByteCode.LinFu.dll',
      binary: true,
      added: null,
      deleted: null,
    });

    expect(parsedLogEntry.stat[3]).to.deep.equal({
      filepath: 'NHibernate/NHibernate.dll',
      binary: true,
      added: null,
      deleted: null,
    });
  });

  it('should parse multiline messages', () => {
    const parsedLogEntries = parseLog(multilineMessage);

    expect(parsedLogEntries).to.have.length(1);
    const parsedLogEntry = parsedLogEntries[0];
    expect(parsedLogEntry.message).to.equal(`VS 2017 .csproj Migration
Due to the way VS test works (by injecting an executable entry point)...`);
  });

  it('should parse log entry stat with rename', () => {
    const parsedLogEntries = parseLog(commitWithRenameLinestat);

    expect(parsedLogEntries).to.have.length(1);
    const parsedLogEntry = parsedLogEntries[0];

    expect(parsedLogEntry.stat[0].filepath).to.equal('Dapper.Tests.Performance/EntityFramework/EFContext.cs');
    expect(parsedLogEntry.stat[0].renames).to.equal('Dapper.Tests/EntityFramework/EFContext.cs');
  });

  it('should parse log entry stat with complex rename', () => {
    const parsedLogEntries = parseLog(commitWithComplexRenameLinestat);

    expect(parsedLogEntries).to.have.length(1);
    const parsedLogEntry = parsedLogEntries[0];

    expect(parsedLogEntry.stat[0].filepath).to.equal(
      'src/Tasks/Microsoft.NET.Build.Extensions.Tasks/Microsoft.NET.Build.Extensions.Tasks.csproj',
    );
    expect(parsedLogEntry.stat[0].renames).to.be.undefined;

    expect(parsedLogEntry.stat[1].filepath).to.equal(
      'src/Tasks/Microsoft.NET.Build.Extensions.Tasks/msbuildExtensions-ver/Microsoft.Common.targets/ImportAfter/Microsoft.NET.Build.Extensions.targets',
    );
    expect(parsedLogEntry.stat[1].renames).to.be.undefined;

    expect(parsedLogEntry.stat[2].filepath).to.equal(
      'src/Tasks/Microsoft.NET.Build.Extensions.Tasks/msbuildExtensions/Microsoft/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets',
    );
    expect(parsedLogEntry.stat[2].renames).to.equal(
      'src/Tasks/Microsoft.NET.Build.Extensions.Tasks/msbuildExtensions/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets',
    );
  });
});

/* eslint-disable no-tabs */
const initialCommit = `commit c8ebaf0b5af9db85b7694f07261ef2d0a651c27c
Author: saintedlama <christoph.walcher@gmail.com>
Date:   Sat Jun 1 17:49:20 2019 +0200

    chore: initial commit

16	0	.editorconfig
7	0	.gitignore
23	0	README.md
16	0	index.js
30	0	lib/i2c-connection-async.js
134	0	lib/sensor.js
21	0	lib/util.js
4187	0	package-lock.json
34	0	package.json
9	0	test.js

`;

const multipleCommits = `commit c8ebaf0b5af9db85b7694f07261ef2d0a651c27c
Author: saintedlama <christoph.walcher@gmail.com>
Date:   Sat Jun 1 17:49:20 2019 +0200

    chore: initial commit

16	0	.editorconfig
7	0	.gitignore
23	0	README.md
16	0	index.js
30	0	lib/i2c-connection-async.js
134	0	lib/sensor.js
21	0	lib/util.js
4187	0	package-lock.json
34	0	package.json
9	0	test.js

commit 94b289c2987aca16a299b989dd47183e573d0b4f
Author: saintedlama <christoph.walcher@gmail.com>
Date:   Sat Jun 1 17:50:42 2019 +0200

    chore: correct module name to import

1	1	README.md

commit 4e665307bc02af812f6b11626f685b7246e19451
Author: saintedlama <christoph.walcher@gmail.com>
Date:   Sat Jun 1 17:52:01 2019 +0200

    chore(release): 1.0.0

5	0	CHANGELOG.md

`;

const multilineMessage = `commit ae7a29a9f1ef7b13a67f05aaa59f3e9d9e653e7f
Author: Nick Craver <nrcraver@gmail.com>
Date:   Sat Mar 25 19:34:10 2017 -0400

    VS 2017 .csproj Migration
    Due to the way VS test works (by injecting an executable entry point)...

`;

const commitWithNonNumericLinestat = `commit 56abcad5df3424ba2c8f9079f8ddf00ac992bef9
Author: Sam Saffron <sam@stackoverflow.com>
Date:   Wed Apr 6 15:23:46 2011 +1000

    Added nhibernate

-	-	NHibernate/Iesi.Collections.dll
-	-	NHibernate/LinFu.DynamicProxy.dll
-	-	NHibernate/NHibernate.ByteCode.LinFu.dll
-	-	NHibernate/NHibernate.dll
33	0	NHibernate/NHibernateHelper.cs
20	0	NHibernate/Post.hbm.xml
12	0	NHibernate/hibernate.cfg.xml
17	1	PerformanceTests.cs
38	0	PerformanceTests.cs.rej
4	4	Program.cs
11	0	Program.cs.rej
17	1	SqlMapper.csproj
44	0	SqlMapper.csproj.rej

`;

const commitWithRenameLinestat = `commit ae7a29a9f1ef7b13a67f05aaa59f3e9d9e653e7f
Author: Nick Craver <nrcraver@gmail.com>
Date:   Sat Mar 25 19:34:10 2017 -0400

    VS 2017 .csproj Migration

6	5	{Dapper.Tests => Dapper.Tests.Performance}/EntityFramework/EFContext.cs

`;

const commitWithComplexRenameLinestat = `commit b9648939ce3916d33862de367609c729e9278bf1
Author: Daniel Plaisted <daplaist@microsoft.com>
Date:   Fri Jun 9 16:58:51 2017 -0700

    Move Microsoft.NET.Build.Extensions into Microsoft subfolder

2	2	src/Tasks/Microsoft.NET.Build.Extensions.Tasks/Microsoft.NET.Build.Extensions.Tasks.csproj
1	1	src/Tasks/Microsoft.NET.Build.Extensions.Tasks/msbuildExtensions-ver/Microsoft.Common.targets/ImportAfter/Microsoft.NET.Build.Extensions.targets
0	0	src/Tasks/Microsoft.NET.Build.Extensions.Tasks/msbuildExtensions/{ => Microsoft}/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.ConflictResolution.targets
0	0	src/Tasks/Microsoft.NET.Build.Extensions.Tasks/msbuildExtensions/{ => Microsoft}/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.NETFramework.targets
0	0	src/Tasks/Microsoft.NET.Build.Extensions.Tasks/msbuildExtensions/{ => Microsoft}/Microsoft.NET.Build.Extensions/Microsoft.NET.Build.Extensions.targets
1	1	test/Microsoft.NET.TestFramework/RepoInfo.cs

`;
