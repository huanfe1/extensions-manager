<div align="center">

# Extensions Manager

A Chrome extension to manage all your installed extensions.

![Preview](/resources/preview.jpg)

</div>

## Features

- View all installed extensions
- Enable/disable extensions with one click
- Open extension details page
- Uninstall extensions
- Auto-updates when extensions change
- Supports English and Chinese

## Installation

### Build from Source

```bash
git clone https://github.com/huanfe1/extensions-manager.git
cd extensions-manager
pnpm install
pnpm build
```

### Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` directory

## Development

```bash
pnpm install
pnpm dev
```

Load the extension following the steps above, and it will hot-reload on changes.

## Requirements

- Node.js >= 22.15.1
- pnpm >= 10.11.0

## License

MIT License - see [LICENSE](LICENSE) for details
