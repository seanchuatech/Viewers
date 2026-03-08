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
      <div className="flex items-center gap-2">
        {isDentalTheme ? (
          <span className="text-xl">🦷</span>
        ) : (
          <Icons.OHIFLogo />
        )}
        <span className="text-foreground text-sm font-semibold">Dental Practice</span>
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
      SecondaryClassName="!left-[160px]" // Move secondary toolbar slightly to the left
      PatientInfo={
        <div className="flex items-center gap-4 mr-4">
           {/* Move ToothSelector to the right side, before patient info */}
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
            className="hover:bg-muted"
            onClick={() => {
              commandsManager.run('undo');
            }}
          >
            <Icons.Undo className="" />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-muted"
            onClick={() => {
              commandsManager.run('redo');
            }}
          >
            <Icons.Redo className="" />
          </Button>
        </div>
      }
    >
      <Toolbar buttonSection="primary" />
    </Header>
  );
}

export default PracticeHeader;
