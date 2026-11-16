import { readFileSync } from 'node:fs';
import { parse } from './parse.js';

const input = process.argv[2]
  ? readFileSync(process.argv[2], 'utf8')
  : readFileSync(0, 'utf8');
process.stdout.write(parse(input));
