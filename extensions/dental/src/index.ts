import { Types } from '@ohif/core';
import { id } from './id';

// Import dental theme CSS — loaded when the extension registers
import './theme/DentalTheme.css';

const dentalExtension: Types.Extensions.Extension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id,
};

export default dentalExtension;
