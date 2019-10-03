const fs = require('fs');
const parseGitlog = require('../');

const contents = fs.readFileSync(process.argv[2], { encoding: 'utf-8' });

const commits = parseGitlog(contents);

console.log(
  commits
    .map(c => c.branches)
    .filter(branches => branches)
    .join('\n'),
);
