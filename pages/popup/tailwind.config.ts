import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons';
import { withUI } from '@extension/ui';

export default withUI({
    content: ['index.html', 'src/**/*.tsx'],
    plugins: [
        iconsPlugin({
            collections: getIconCollections(['mingcute']),
        }),
    ],
});
