import React from "react"
import {
    Button,
    Kbd,
    LucideIcon,
    SidebarHeader
} from "@tryghost/shade"
import { useBrowseSite } from "@tryghost/admin-x-framework/api/site";
import { useCurrentUser } from "@tryghost/admin-x-framework/api/current-user";
import { isContributorUser } from "@tryghost/admin-x-framework/api/users";

const ctrlOrCmd = navigator.userAgent.indexOf('Mac') !== -1 ? 'command' : 'ctrl';
const searchShortcut = ctrlOrCmd === 'command' ? '⌘K' : 'Ctrl+K';

// Search is currently handled by the Ember app, firing a keyboard event avoids needing to sync state
const openSearchModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const searchShortcutEvent = new KeyboardEvent('keydown', {
        key: 'k',
        keyCode: 75, // Ember uses keymaster.js which still uses keyCode
        metaKey: ctrlOrCmd === 'command',
        ctrlKey: ctrlOrCmd === 'ctrl'
    });
    document.dispatchEvent(searchShortcutEvent);
}

function AppSidebarHeader({ ...props }: React.ComponentProps<typeof SidebarHeader>) {
    const { data: currentUser } = useCurrentUser();
    const site = useBrowseSite();
    const title = site.data?.site.title ?? "";
    const siteIcon = site.data?.site.icon;
    const showSearch = currentUser && !isContributorUser(currentUser);

    return (
        <SidebarHeader {...props}>
            <div className="flex flex-col items-stretch gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-md bg-transparent border-0 flex-shrink-0">
                            {siteIcon ? (
                                <img
                                    src={siteIcon}
                                    alt="Site icon"
                                    className="w-full h-full rounded-md object-cover"
                                />
                            ) : (
                                <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 38 C22 38 22 20 22 14" stroke="#1c1f1a" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M22 20 C18 18 10 16 8 10 C8 10 14 8 18 12 C20 14 22 18 22 20Z" fill="#2d5a3d"/>
                                    <path d="M22 26 C26 22 34 20 38 14 C38 14 32 10 27 15 C24 18 22 24 22 26Z" fill="#4a7c59"/>
                                    <circle cx="22" cy="38" r="2" fill="#1c1f1a"/>
                                </svg>
                            )}
                        </div>
                        <div className="font-semibold text-[15px] text-foreground overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                            {title}
                        </div>
                    </div>
                </div>
                {showSearch && (
                    <Button
                        variant="outline"
                        className="flex items-center justify-between text-muted-foreground hover:text-gray-700 hover:bg-background text-base [&_svg]:stroke-2 pr-2 shadow-xs hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-800 h-[38px] dark:bg-gray-950"
                        onClick={openSearchModal}
                    >
                        <div className="flex items-center gap-2">
                            <LucideIcon.Search className="text-muted-foreground" />
                            Search site
                        </div>
                        <Kbd className="text-gray-500 bg-transparent shadow-none dark:text-gray-800" style={{textShadow: 'none'}}>{searchShortcut}</Kbd>
                    </Button>
                )}
            </div>
        </SidebarHeader>
    );
}

export default AppSidebarHeader;
