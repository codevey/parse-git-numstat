# Parse Git Numstat

Parses git logs created with attached numstat option like `git log --numstat > gitlog.txt`

[![CircleCI](https://circleci.com/gh/codevey/parse-git-numstat.svg?style=svg)](https://circleci.com/gh/codevey/parse-git-numstat)

## Usage

```bash
npm i parse-git-numstat
```

```js
    const fs = require('fs');
    const parse = require('parse-git-numstat');

    const gitlog = fs.readFileSync('location/to/gitlog.txt', { encoding: 'utf-8' });
    const commits = parse(gitlog);

    console.log(commits[0]);
```

Prints

```js
{ sha: '...',
    branches: [...],    // field available when using --decorate
    tags: [...],        // field available when using --decorate
    author: { name: '...', email: '...' },
    merge: null,
    date: '2019-06-01T15:49:20.000Z',
    message: 'chore: initial commit',
    stat: [
        { added: 16, deleted: 0, filepath: '.editorconfig' },
        { added: 7, deleted: 0, filepath: '.gitignore' },
        { added: 23, deleted: 0, filepath: 'README.md' },
        { added: 16, deleted: 0, filepath: 'index.js' },
        { added: 30, deleted: 0, filepath: 'lib/i2c-connection-async.js' },
        { added: 134, deleted: 0, filepath: 'lib/sensor.js' },
        { added: 21, deleted: 0, filepath: 'lib/util.js' },
        { added: 4187, deleted: 0, filepath: 'package-lock.json' },
        { added: 34, deleted: 0, filepath: 'package.json' },
        { added: 9, deleted: 0, filepath: 'test.js' }
    ]
}
```

## Parsing Branches and Tags

If `tags` and `branches` should be parsed the git log has to be generate using the `--decorate` switch

```bash
git log --numstat --decorate > gitlog.txt
```

or

```bash
git log --numstat --decorate=full > gitlog.txt
```
