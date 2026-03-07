import i18n from 'i18next';
import { id } from './id';
import {
  initToolGroups,
  toolbarButtons,
  cornerstone,
  ohif,
  dicomsr,
  dicomvideo,
  basicLayout,
  basicRoute,
  extensionDependencies as basicDependencies,
  mode as basicMode,
  modeInstance as basicModeInstance,
} from '@ohif/mode-basic';

// ---------------------------------------------------------------------------
// Extension dependencies — everything from basic + the dental extension
// ---------------------------------------------------------------------------
export const extensionDependencies = {
  ...basicDependencies,
  '@ohif/extension-dental': '^0.0.1',
};

// ---------------------------------------------------------------------------
// Layout — re-use the basic layout for now (will be replaced in Phase A5)
// ---------------------------------------------------------------------------
export const dentalLayout = {
  ...basicLayout,
  id: ohif.layout,
  props: {
    ...basicLayout.props,
  },
};

// ---------------------------------------------------------------------------
// Route — mounts at /dental
// ---------------------------------------------------------------------------
export const dentalRoute = {
  ...basicRoute,
  path: 'dental',
  layoutInstance: dentalLayout,
};

// ---------------------------------------------------------------------------
// Mode instance
// ---------------------------------------------------------------------------
export const modeInstance = {
  ...basicModeInstance,
  id,
  routeName: 'dental',
  displayName: i18n.t('Modes:Dental Viewer'),
  routes: [dentalRoute],
  extensions: extensionDependencies,
};

// ---------------------------------------------------------------------------
// Mode export
// ---------------------------------------------------------------------------
const mode = {
  ...basicMode,
  id,
  modeInstance,
  extensionDependencies,
};

export default mode;
export { initToolGroups, toolbarButtons };
