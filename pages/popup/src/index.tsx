import Popup from '@src/Popup';
import '@src/index.css';
import { createRoot } from 'react-dom/client';

// 确保 chrome API 可用
if (typeof chrome === 'undefined' && typeof browser !== 'undefined') {
    // Firefox 兼容性
    (window as any).chrome = browser;
}

const init = () => {
    const appContainer = document.querySelector('#app-container');
    if (!appContainer) {
        throw new Error('Can not find #app-container');
    }
    const root = createRoot(appContainer);

    root.render(<Popup />);
};

init();
