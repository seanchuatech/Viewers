/**
 * Commands for the Dental extension.
 */
function getCommandsModule({ commandsManager }) {
  const actions = {
    /**
     * Toggle the dental theme on/off by adding or removing the
     * `.dental-theme` class on `document.body`.
     */
    toggleDentalTheme: () => {
      document.body.classList.toggle('dental-theme');
    },
  };

  const definitions = {
    toggleDentalTheme: {
      commandFn: actions.toggleDentalTheme,
    },
  };

  return { actions, definitions };
}

export default getCommandsModule;
