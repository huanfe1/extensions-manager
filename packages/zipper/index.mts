import { IS_FIREFOX } from '@extension/env';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { zipBundle } from './lib/index.js';

const rootDir = resolve(import.meta.dirname, '..', '..', '..');
const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'));
const fileName = `${pkg.name}`;

await zipBundle({
    distDirectory: resolve(rootDir, 'dist'),
    buildDirectory: resolve(rootDir, 'dist-zip'),
    archiveName: IS_FIREFOX ? `${fileName}.xpi` : `${fileName}.zip`,
});
