import type { ManifestType } from '@extension/shared';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

/**
 * @prop default_locale
 * if you want to support multiple languages, you can use the following reference
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
 *
 * @prop browser_specific_settings
 * Must be unique to your extension to upload to addons.mozilla.org
 * (you can delete if you only want a chrome extension)
 */
const manifest = {
    manifest_version: 3,
    default_locale: 'zh',
    name: '__MSG_extensionName__',
    browser_specific_settings: {
        gecko: {
            id: 'extensions-manager@extensions-manager.com',
            strict_min_version: '109.0',
        },
    },
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    permissions: ['tabs', 'management'],
    background: {
        service_worker: 'background.js',
        type: 'module',
    },
    action: {
        default_popup: 'popup/index.html',
        default_icon: 'icon-34.png',
    },
    icons: {
        '128': 'icon-128.png',
    },
    web_accessible_resources: [
        {
            resources: ['*.svg', 'icon-128.png', 'icon-34.png'],
            matches: ['*://*/*'],
        },
    ],
} satisfies ManifestType;

export default manifest;
