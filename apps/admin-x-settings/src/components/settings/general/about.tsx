import NiceModal from '@ebay/nice-modal-react';
import {Icon, Modal, Separator} from '@tryghost/admin-x-design-system';
import {type RoutingModalProps, useRouting} from '@tryghost/admin-x-framework/routing';
import {linkToGitHubReleases} from '../../../utils/link-to-github-releases';
import {showDatabaseWarning} from '../../../utils/show-database-warning';
import {useGlobalData} from '../../providers/global-data-provider';
import {useUpgradeStatus} from '../../providers/settings-app-provider';

const AboutModal = NiceModal.create<RoutingModalProps>(({}) => {
    const {updateRoute} = useRouting();
    const globalData = useGlobalData();
    let config = globalData.config;
    const upgradeStatus = useUpgradeStatus();

    function copyrightYear():number {
        const date = new Date();
        return date.getFullYear();
    }

    function hasDeveloperExperiments():boolean {
        if (config.enableDeveloperExperiments) {
            return true;
        } else {
            return false;
        }
    }

    function showSystemInfo() : boolean {
        const isPro = !!config.hostSettings?.siteId;

        if (isPro) {
            return false;
        }

        return true;
    }

    return (
        <Modal
            afterClose={() => {
                updateRoute('');
            }}
            cancelLabel=''
            footer={(<></>)}
            topRightContent='close'
            width={540}
        >
            <div className='flex flex-col gap-4 pb-7 text-sm'>
                <svg fill="none" height="48" viewBox="0 0 44 44" width="48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 38 C22 38 22 20 22 14" stroke="#1c1f1a" strokeLinecap="round" strokeWidth="2"/>
                    <path d="M22 20 C18 18 10 16 8 10 C8 10 14 8 18 12 C20 14 22 18 22 20Z" fill="#2d5a3d"/>
                    <path d="M22 26 C26 22 34 20 38 14 C38 14 32 10 27 15 C24 18 22 24 22 26Z" fill="#4a7c59"/>
                    <circle cx="22" cy="38" fill="#1c1f1a" r="2"/>
                </svg>
                <div className='mt-3 flex flex-col gap-1.5'>
                    {
                        upgradeStatus?.message && (
                            <div className='gh-prose-links mb-4 rounded-sm border border-green p-5'>
                                <strong>Update available!</strong>
                                <div dangerouslySetInnerHTML={{__html: upgradeStatus.message}}/>
                            </div>
                        )
                    }
                    {
                        linkToGitHubReleases(config.version) && (
                            <div><strong>Version:</strong> <a className='text-green' href={linkToGitHubReleases(config.version)} rel="noopener noreferrer" target="_blank">{config.version}</a></div>
                        ) || (
                            <div><strong>Version:</strong> {config.version}</div>
                        )
                    }
                    {
                        showSystemInfo() && (
                            <>
                                <div><strong>Environment:</strong> {config.environment}</div>
                                <div><strong>Database:</strong> {config.database}</div>
                                <div><strong>Mail:</strong> {config.mail ? config.mail : 'Native'}</div>
                            </>
                        )
                    }
                    {
                        hasDeveloperExperiments() && (
                            <div><strong>Developer experiments:</strong> Enabled</div>
                        )
                    }

                    {
                        showSystemInfo() && showDatabaseWarning(config.environment, config.database) && (
                            <div className='text-red-500 dark:text-red-400'>
                                 You are running an unsupported database in production. Please <a href="https://ghost.org/docs/faq/supported-databases/" rel="noopener noreferrer" target="_blank">upgrade to MySQL 8</a>.
                            </div>
                        )
                    }
                </div>
                <Separator />
                <div className='flex flex-col gap-1.5'>
                    <a className='flex items-center gap-2 hover:text-grey-900 dark:hover:text-grey-400' href="https://ghost.org/docs/" rel="noopener noreferrer" target="_blank"><Icon name='book-open' size='sm' /> User documentation</a>
                    <a className='flex items-center gap-2 hover:text-grey-900 dark:hover:text-grey-400' href="https://forum.ghost.org/" rel="noopener noreferrer" target="_blank"><Icon name='question-circle' size='sm' /> Get help with Fairstack</a>
                    <a className='flex items-center gap-2 hover:text-grey-900 dark:hover:text-grey-400' href="https://ghost.org/docs/contributing/" rel="noopener noreferrer" target="_blank"><Icon name='angle-brackets' size='sm' /> Get involved</a>
                </div>
                <Separator />
                <p className='max-w-[460px] text-xs'>
                    Built on Ghost &mdash; Copyright © 2013 &ndash; {copyrightYear()} Ghost Foundation, released under the <a className='text-green' href="https://github.com/TryGhost/Ghost/blob/main/LICENSE" rel="noopener noreferrer" target="_blank">MIT license</a>. Fairstack is powered by <a className='text-green' href="https://ghost.org/" rel="noopener noreferrer" target="_blank">Ghost</a>, a registered trademark of <a className='text-green' href="https://ghost.org/trademark/" rel="noopener noreferrer" target="_blank">Ghost Foundation Ltd</a>.
                </p>
            </div>
        </Modal>
    );
});

export default AboutModal;
