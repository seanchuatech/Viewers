import { Types } from '@ohif/core';
import { id } from './id';
import getCommandsModule from './getCommandsModule';

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
};

export default dentalExtension;
