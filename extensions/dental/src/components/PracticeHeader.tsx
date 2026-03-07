import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Icons, useModal } from '@ohif/ui-next';
import { useSystem } from '@ohif/core';
import { Toolbar, usePatientInfo } from '@ohif/extension-default';
import { Types } from '@ohif/core';
import { preserveQueryParameters } from '@ohif/app';

/**
 * PracticeHeader — replaces the standard OHIF ViewerHeader.
 *
 * Displays:
 *   - Practice name / logo (left)
 *   - Patient info — name, ID, sex, DOB (centre-left)
 *   - Primary toolbar (centre)
 *   - Settings menu (right)
 */
function PracticeHeader({ appConfig }: withAppTypes<{ appConfig: AppTypes.Config }>) {
  const { servicesManager, extensionManager, commandsManager } = useSystem();
  const { customizationService } = servicesManager.services;
  const { patientInfo } = usePatientInfo();

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

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="bg-muted flex h-[52px] w-full items-center border-b border-[hsl(var(--border))] px-3">
      {/* Left section — back button + practice name */}
      <div className="flex shrink-0 items-center gap-3">
        {appConfig.showStudyList && (
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-accent h-8 w-8 p-0"
            onClick={onClickReturnButton}
          >
            <Icons.ArrowLeft className="text-primary h-5 w-5" />
          </Button>
        )}

        {/* Practice branding */}
        <div className="flex items-center gap-2">
          <span className="text-primary text-lg font-bold tracking-wide">🦷</span>
          <span className="text-foreground text-sm font-semibold">Dental Practice</span>
        </div>

        {/* Separator */}
        <div className="bg-border mx-1 h-6 w-px" />

        {/* Patient info */}
        <div className="flex items-center gap-2">
          <Icons.Patient className="text-primary h-4 w-4" />
          <div className="flex flex-col leading-tight">
            <span className="text-foreground text-[13px] font-bold">
              {patientInfo.PatientName || 'Unknown Patient'}
            </span>
            <div className="text-muted-foreground flex gap-2 text-[11px]">
              <span>{patientInfo.PatientID || '—'}</span>
              {patientInfo.PatientSex && <span>{patientInfo.PatientSex}</span>}
              {patientInfo.PatientDOB && <span>{patientInfo.PatientDOB}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Centre — primary toolbar */}
      <div className="flex flex-1 items-center justify-center gap-1">
        <Toolbar buttonSection="primary" />
      </div>

      {/* Right section — secondary toolbar + undo/redo + settings */}
      <div className="flex shrink-0 items-center gap-1">
        <Toolbar buttonSection="secondary" />

        {/* Undo / Redo */}
        <Button
          variant="ghost"
          className="hover:bg-muted h-8 w-8 p-0"
          onClick={() => commandsManager.run('undo')}
        >
          <Icons.Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-muted h-8 w-8 p-0"
          onClick={() => commandsManager.run('redo')}
        >
          <Icons.Redo className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="bg-border mx-1 h-6 w-px" />

        {/* Patient label */}
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Icons.Patient className="h-4 w-4" />
          <span>Patient</span>
        </div>

        {/* Settings gear */}
        <Button
          variant="ghost"
          className="hover:bg-muted h-8 w-8 p-0"
          onClick={() => {
            if (menuOptions.length > 0) {
              menuOptions[1]?.onClick();
            }
          }}
        >
          <Icons.Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default PracticeHeader;
