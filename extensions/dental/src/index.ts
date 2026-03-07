import { id } from './id';
import getCommandsModule from './getCommandsModule';
import DentalViewerLayout from './ViewerLayout/DentalViewerLayout';

// Import dental theme CSS — loaded when the extension registers
import './theme/DentalTheme.css';

// Import toolbar button definitions
import dentalToolbarButtons from './getToolbarModule';

import dentalHangingProtocol from './hangingprotocols/dentalHangingProtocol';

const dentalExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id,

  getCommandsModule,

  getHangingProtocolModule() {
    return [
      {
        name: dentalHangingProtocol.id,
        protocol: dentalHangingProtocol,
      },
    ];
  },

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
