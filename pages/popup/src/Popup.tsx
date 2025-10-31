import { t } from '@extension/i18n';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ErrorDisplay, LoadingSpinner, cn } from '@extension/ui';
import { ExtensionManager } from '@src/ExtensionManager';
import '@src/Popup.css';
import { useEffect, useRef, useState } from 'react';

const Popup = () => {
    const refreshRef = useRef<(() => void) | undefined>(undefined);
    const [isSystemLight, setIsSystemLight] = useState(true);

    useEffect(() => {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const applyScheme = () => {
            const light = !mql.matches;
            setIsSystemLight(light);
            document.documentElement.style.colorScheme = light ? 'light' : 'dark';
        };
        applyScheme();
        const listener = () => applyScheme();
        mql.addEventListener?.('change', listener);
        return () => {
            mql.removeEventListener?.('change', listener);
            document.documentElement.style.colorScheme = '';
        };
    }, []);

    const handleRefresh = () => {
        refreshRef.current?.();
    };

    return (
        <div className={cn('App min-w-[400px]', isSystemLight ? 'bg-slate-50' : 'bg-gray-800')}>
            <header className={cn('App-header border-b px-4 py-3', isSystemLight ? 'border-gray-200 bg-white' : 'border-gray-600 bg-gray-900')}>
                <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <i className={cn('i-mingcute-apps-2-line text-xl', isSystemLight ? 'text-blue-600' : 'text-blue-400')}></i>
                        <h1 className={cn('text-lg font-semibold', isSystemLight ? 'text-gray-900' : 'text-gray-100')}>{t('appTitle')}</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleRefresh}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95',
                                isSystemLight ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200',
                            )}
                            title={t('refreshList')}
                        >
                            <i className="i-mingcute-refresh-3-line text-xl"></i>
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex flex-1 flex-col overflow-hidden p-4">
                <ExtensionManager isLight={isSystemLight} refreshRef={refreshRef} />
            </main>
        </div>
    );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
