import { Types } from '@ohif/core';
import { id } from './id';
import getCommandsModule from './getCommandsModule';
import DentalViewerLayout from './ViewerLayout/DentalViewerLayout';
import PracticeHeader from './components/PracticeHeader';

// Import dental theme CSS — loaded when the extension registers
import './theme/DentalTheme.css';

// Import toolbar button definitions
import dentalToolbarButtons from './getToolbarModule';

const dentalExtension: Types.Extensions.Extension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id,

  getCommandsModule,

  getToolbarModule() {
    return dentalToolbarButtons;
  },

  getLayoutTemplateModule({ servicesManager, extensionManager, commandsManager, hotkeysManager }) {
    function DentalViewerLayoutWithServices(props) {
      return DentalViewerLayout({
        servicesManager,
        extensionManager,
        commandsManager,
        hotkeysManager,
        Header: PracticeHeader, // Pass the custom header
        ...props,
      });
    }

    return [
      {
        name: 'dentalViewerLayout',
        id: 'dentalViewerLayout',
        component: DentalViewerLayoutWithServices,
      },
    ];
  },
};

export default dentalExtension;
