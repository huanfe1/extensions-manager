import { t } from '@extension/i18n';
import { cn } from '@extension/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

// 安全获取 chrome API
const getChromeAPI = (): typeof chrome | undefined => {
    if (typeof window !== 'undefined') {
        return (window as unknown as { chrome?: typeof chrome }).chrome;
    }
    if (typeof globalThis !== 'undefined') {
        return (globalThis as unknown as { chrome?: typeof chrome }).chrome;
    }
    return undefined;
};

interface ExtensionInfo {
    id: string;
    name: string;
    enabled: boolean;
    iconUrl?: string;
}

interface ExtensionItemProps {
    extension: ExtensionInfo;
    onToggle: (id: string, enabled: boolean) => void;
    onUninstall: (id: string, name: string) => void;
    onOpenDetails: (id: string) => void;
    isLight: boolean;
}

const ExtensionItem = ({ extension, onToggle, onUninstall, onOpenDetails, isLight }: ExtensionItemProps) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        onToggle(extension.id, !extension.enabled);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        // 获取鼠标位置，并调整以确保菜单不会超出视窗
        const x = e.clientX;
        const y = e.clientY;
        // 菜单宽度约 140px，高度约 40px
        // 如果靠近右边缘，从右侧显示；如果靠近底部，向上显示
        const menuWidth = 140;
        const menuHeight = 40;
        const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
        const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

        setMenuPosition({ x: adjustedX, y: adjustedY });
        setShowContextMenu(true);
    };

    const handleUninstall = () => {
        setShowContextMenu(false);
        onUninstall(extension.id, extension.name);
    };

    const handleOpenDetails = () => {
        setShowContextMenu(false);
        onOpenDetails(extension.id);
    };

    // 点击外部关闭菜单
    useEffect(() => {
        if (!showContextMenu) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node) && itemRef.current && !itemRef.current.contains(event.target as Node)) {
                setShowContextMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showContextMenu]);

    const defaultIcon =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjRjNGNEY2Ii8+PHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOC4wMDAwMSA0QzkuMTA0NTcgNCAxMC4wMDAwMSA0Ljg5NTQzIDEwLjAwMDAxIDZIMTMuOTk5OEMxNC41NTIzIDYgMTQuOTk5OCA2LjQ0Nzc2IDE0Ljk5OTggN0MxNC45OTk4IDcuNTUyMjggMTQuNTUyMyA4IDEzLjk5OTggOEg5Ljk5OTk5QzkuOTk5OTkgOS4xMDQ1NyA5LjEwNDU3IDEwIDguMDAwMDEgMTBDNi44OTU0NSAxMCA2LjAwMDAxIDkuMTA0NTcgNi4wMDAwMSA4SDIuMDAwMDFDMS40NDc3MiA4IDEuMDAwMDEgNy41NTIyOCAxLjAwMDAxIDdDMS4wMDAwMSA2LjQ0Nzc2IDEuNDQ3NzIgNiAyLjAwMDAxIDZINi4wMDAwMUM2LjAwMDAxIDQuODk1NDMgNi44OTU0NSA0IDguMDAwMDEgNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz48L3N2Zz4=';

    return (
        <div className="relative">
            <div
                ref={itemRef}
                onContextMenu={handleContextMenu}
                className={cn(
                    'flex items-center gap-3 rounded-lg p-3 transition-colors',
                    isLight ? 'border border-gray-200 bg-white hover:bg-gray-100' : 'border border-gray-600 bg-gray-800 hover:bg-gray-700',
                )}
            >
                <img
                    src={extension.iconUrl || defaultIcon}
                    alt={extension.name}
                    className="h-10 w-10 flex-shrink-0 rounded"
                    onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = defaultIcon;
                    }}
                />
                <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-medium', isLight ? 'text-gray-900' : 'text-gray-100')}>{extension.name}</p>
                </div>
                <button
                    onClick={handleToggle}
                    className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                        extension.enabled
                            ? isLight
                                ? 'bg-blue-600 focus:ring-blue-500'
                                : 'bg-blue-500 focus:ring-blue-400'
                            : isLight
                              ? 'bg-gray-300 focus:ring-gray-400'
                              : 'bg-gray-600 focus:ring-gray-500',
                    )}
                    role="switch"
                    aria-checked={extension.enabled}
                >
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', extension.enabled ? 'translate-x-6' : 'translate-x-1')} />
                </button>
            </div>
            {showContextMenu && (
                <div
                    ref={contextMenuRef}
                    className={cn('fixed z-50 min-w-[140px] rounded-lg border p-1.5 shadow-lg', isLight ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800')}
                    style={{
                        left: `${menuPosition.x}px`,
                        top: `${menuPosition.y}px`,
                    }}
                    onContextMenu={e => e.preventDefault()}
                >
                    <button
                        onClick={handleOpenDetails}
                        className={cn(
                            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                            isLight ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700',
                        )}
                    >
                        <i className="i-mingcute-external-link-line text-base"></i>
                        {t('openDetails')}
                    </button>
                    <button
                        onClick={handleUninstall}
                        className={cn(
                            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                            isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20',
                        )}
                    >
                        <i className="i-mingcute-delete-2-line text-base"></i>
                        {t('uninstallExtension')}
                    </button>
                </div>
            )}
        </div>
    );
};

interface ExtensionManagerProps {
    isLight: boolean;
    refreshRef?: React.MutableRefObject<(() => void) | undefined>;
}

export const ExtensionManager = ({ isLight, refreshRef }: ExtensionManagerProps) => {
    const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadExtensions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 获取 chrome API
            const chromeAPI = getChromeAPI();
            const management = chromeAPI?.management;

            // 再次检查 API 可用性
            if (!management?.getAll) {
                throw new Error(t('managementApiUnavailable'));
            }

            const allExtensions = await management.getAll();

            // 获取当前扩展 ID
            const currentExtensionId = chromeAPI?.runtime?.id;

            // 过滤掉当前扩展本身和Chrome内置扩展
            const filteredExtensions = allExtensions
                .filter((ext: chrome.management.ExtensionInfo) => {
                    // 排除当前扩展
                    if (currentExtensionId && ext.id === currentExtensionId) return false;
                    // 排除Chrome内置扩展（类型为 'chrome'）
                    if (ext.type === 'chrome') return false;
                    // 排除未安装或卸载的扩展
                    return ext.installType !== 'other';
                })
                .map((ext: chrome.management.ExtensionInfo) => ({
                    id: ext.id,
                    name: ext.name,
                    enabled: ext.enabled,
                    iconUrl: ext.icons?.[ext.icons.length - 1]?.url,
                }))
                .sort((a: ExtensionInfo, b: ExtensionInfo) => a.name.localeCompare(b.name));

            setExtensions(filteredExtensions);
        } catch (err) {
            console.error('Failed to load extensions:', err);
            setError(t('failedToLoadExtensions'));
        } finally {
            setLoading(false);
        }
    }, []);

    // 暴露刷新函数给父组件
    useEffect(() => {
        if (refreshRef) {
            refreshRef.current = loadExtensions;
        }
    }, [loadExtensions, refreshRef]);

    useEffect(() => {
        // 检查 chrome API 是否可用
        const chromeAPI = getChromeAPI();

        if (!chromeAPI) {
            setError(t('chromeApiUnavailable'));
            setLoading(false);
            return;
        }

        // 检查 chrome.management API 是否可用
        if (!chromeAPI.management || typeof chromeAPI.management.getAll !== 'function') {
            const debugInfo = {
                chrome: !!chromeAPI,
                management: !!chromeAPI.management,
                getAll: typeof chromeAPI.management?.getAll,
                runtime: !!chromeAPI.runtime,
                runtimeId: chromeAPI?.runtime?.id,
                permissions: chromeAPI?.runtime?.getManifest?.()?.permissions,
            };
            console.error('Chrome Management API 检查失败:', debugInfo);
            setError(t('managementApiUnavailable'));
            setLoading(false);
            return;
        }

        console.log('Chrome Management API 可用:', {
            runtimeId: chromeAPI.runtime?.id,
            hasManagement: !!chromeAPI.management,
            hasGetAll: typeof chromeAPI.management.getAll === 'function',
        });

        // 使用局部变量存储 chrome API 引用
        const management = chromeAPI.management;

        loadExtensions();

        // 监听扩展状态变化
        const handleExtensionEnabled = (id: string, enabled: boolean) => {
            setExtensions(prev => prev.map(ext => (ext.id === id ? { ...ext, enabled } : ext)));
        };

        if (management.onEnabled) {
            management.onEnabled.addListener((info: chrome.management.ExtensionInfo) => {
                handleExtensionEnabled(info.id, true);
            });
        }

        if (management.onDisabled) {
            management.onDisabled.addListener((info: chrome.management.ExtensionInfo) => {
                handleExtensionEnabled(info.id, false);
            });
        }

        if (management.onInstalled) {
            management.onInstalled.addListener(() => {
                loadExtensions();
            });
        }

        if (management.onUninstalled) {
            management.onUninstalled.addListener(() => {
                loadExtensions();
            });
        }

        return () => {
            // 清理监听器（Chrome Extension API 不支持手动移除监听器）
        };
    }, [loadExtensions]);

    const handleToggle = async (id: string, enabled: boolean) => {
        try {
            setError(null);

            // 获取 chrome API
            const chromeAPI = getChromeAPI();
            const management = chromeAPI?.management;

            // 检查 API 可用性
            if (!management?.setEnabled) {
                throw new Error(t('managementApiUnavailable'));
            }

            await management.setEnabled(id, enabled);
            // 状态会通过监听器自动更新
        } catch (err) {
            console.error('Failed to toggle extension:', err);
            const extensionName = extensions.find(ext => ext.id === id)?.name || t('extension');
            const action = enabled ? t('enable') : t('disable');
            setError(t('failedToToggleExtension', [action, extensionName]));
            // 重新加载扩展列表以确保状态同步
            setTimeout(() => {
                loadExtensions();
            }, 500);
        }
    };

    const handleUninstall = async (id: string, name: string) => {
        try {
            setError(null);

            // 获取 chrome API
            const chromeAPI = getChromeAPI();
            const management = chromeAPI?.management;

            // 检查 API 可用性
            if (!management?.uninstall) {
                throw new Error(t('managementApiUnavailable'));
            }

            // Chrome 会显示自己的确认对话框
            await management.uninstall(id, { showConfirmDialog: true });
            // 扩展会在卸载后通过 onUninstalled 监听器自动从列表中移除
        } catch (err) {
            console.error('Failed to uninstall extension:', err);
            const errMessage = (err as Error).message || '';
            // 如果用户取消了浏览器确认对话框，也会抛出错误，这是正常的
            if (errMessage.includes('cancel') || errMessage.includes('user')) {
                // 用户取消，不需要显示错误
                return;
            }
            setError(t('failedToUninstallExtension', [name]));
        }
    };

    const handleOpenDetails = (id: string) => {
        // 打开 Chrome 扩展管理页面
        const url = `chrome://extensions/?id=${id}`;
        const chromeAPI = getChromeAPI();
        if (chromeAPI?.tabs?.create) {
            chromeAPI.tabs.create({ url });
        }
    };

    if (loading) {
        return (
            <div className={cn('flex items-center justify-center p-8', isLight ? 'text-gray-600' : 'text-gray-400')}>
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="ml-2">{t('loading')}</span>
            </div>
        );
    }

    if (error && extensions.length === 0) {
        return (
            <div className={cn('p-4 text-center', isLight ? 'text-red-600' : 'text-red-400')}>
                <p>{error}</p>
                <button
                    onClick={loadExtensions}
                    className={cn('mt-2 rounded px-4 py-2 text-sm', isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600')}
                >
                    {t('retry')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            {error && <div className={cn('mb-3 rounded p-2 text-sm', isLight ? 'bg-red-50 text-red-600' : 'bg-red-900/20 text-red-400')}>{error}</div>}

            <div className="extension-list flex-1 overflow-y-auto pr-1">
                <div className="space-y-2">
                    {extensions.length === 0 ? (
                        <div className={cn('p-4 text-center', isLight ? 'text-gray-500' : 'text-gray-400')}>{t('noExtensionsFound')}</div>
                    ) : (
                        extensions.map(ext => (
                            <ExtensionItem key={ext.id} extension={ext} onToggle={handleToggle} onUninstall={handleUninstall} onOpenDetails={handleOpenDetails} isLight={isLight} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
