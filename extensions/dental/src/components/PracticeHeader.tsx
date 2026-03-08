import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Icons, useModal, Button } from '@ohif/ui-next';
import { useSystem } from '@ohif/core';
import { Toolbar } from '@ohif/extension-default';
import { Types } from '@ohif/core';
import { preserveQueryParameters } from '@ohif/app';
import ToothSelector from './ToothSelector';
import { useDentalStore } from '../stores/useDentalStore';

// We import these from the default extension's specific paths since they aren't exported from index
import HeaderPatientInfo, { PatientInfoVisibility } from '@ohif/extension-default/src/ViewerLayout/HeaderPatientInfo/HeaderPatientInfo';

const ToothIcon = () => (
  <span className="text-xl mr-1">🦷</span>
);

/**
 * PracticeHeader — replaces the standard OHIF ViewerHeader.
 * Uses the standard Header component to ensure toolbar functionality.
 */
function PracticeHeader({ appConfig }: withAppTypes<{ appConfig: AppTypes.Config }>) {
  const { servicesManager, extensionManager, commandsManager } = useSystem();
  const { customizationService } = servicesManager.services;
  const isDentalTheme = useDentalStore(state => state.isDentalTheme);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { show } = useModal();

  // ── Navigation ──────────────────────────────────────────────
  const onClickReturnButton = () => {
    const { pathname } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);
    const dataSourceName = pathname.substring(dataSourceIdx + 1);
    const existingDataSource = extensionManager.getDataSources(dataSourceName);

    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1 && existingDataSource) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }
    preserveQueryParameters(searchQuery);

    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString()),
    });
  };

  // ── Settings menu ───────────────────────────────────────────
  const AboutModal = customizationService.getCustomization(
    'ohif.aboutModal'
  ) as Types.MenuComponentCustomization;

  const UserPreferencesModal = customizationService.getCustomization(
    'ohif.userPreferencesModal'
  ) as Types.MenuComponentCustomization;

  const menuOptions = [
    {
      title: AboutModal?.menuTitle ?? t('Header:About'),
      icon: 'info',
      onClick: () =>
        show({
          content: AboutModal,
          title: AboutModal?.title ?? t('AboutModal:About OHIF Viewer'),
          containerClassName: AboutModal?.containerClassName ?? 'max-w-md',
        }),
    },
    {
      title: UserPreferencesModal?.menuTitle ?? t('Header:Preferences'),
      icon: 'settings',
      onClick: () =>
        show({
          content: UserPreferencesModal,
          title: UserPreferencesModal?.title ?? t('UserPreferencesModal:User preferences'),
          containerClassName:
            UserPreferencesModal?.containerClassName ?? 'flex max-w-4xl p-6 flex-col',
        }),
    },
  ];

  if (appConfig.oidc) {
    menuOptions.push({
      title: t('Header:Logout'),
      icon: 'power-off',
      onClick: async () => {
        navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
      },
    });
  }

  // ── Custom Logo / Branding ──────────────────────────────────
  const whiteLabeling = {
    createLogoComponentFn: () => (
      <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
        {isDentalTheme ? (
          <ToothIcon />
        ) : (
          <Icons.OHIFLogo className="w-8 h-8" />
        )}
        <span className="text-foreground text-sm font-semibold truncate">Dental Practice</span>
      </div>
    ),
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <Header
      menuOptions={menuOptions}
      isReturnEnabled={!!appConfig.showStudyList}
      onClickReturnButton={onClickReturnButton}
      WhiteLabeling={whiteLabeling}
      Secondary={<Toolbar buttonSection="secondary" />}
      SecondaryClassName="!left-[200px]" // Move secondary toolbar further right to avoid logo overlap
      PatientInfo={
        <div className="flex items-center gap-4 mr-4">
           {/* ToothSelector on the right side, before patient info */}
           <ToothSelector />
           {appConfig.showPatientInfo !== PatientInfoVisibility.DISABLED && (
             <HeaderPatientInfo
               servicesManager={servicesManager}
               appConfig={appConfig}
             />
           )}
        </div>
      }
      UndoRedo={
        <div className="text-primary flex cursor-pointer items-center">
          <Button
            variant="ghost"
            className="hover:bg-muted h-8 w-8 p-0 flex items-center justify-center"
            onClick={() => {
              commandsManager.run('undo');
            }}
          >
            <Icons.Undo />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-muted h-8 w-8 p-0 flex items-center justify-center"
            onClick={() => {
              commandsManager.run('redo');
            }}
          >
            <Icons.Redo />
          </Button>
        </div>
      }
    >
      <Toolbar buttonSection="primary" />
    </Header>
  );
}

export default PracticeHeader;
