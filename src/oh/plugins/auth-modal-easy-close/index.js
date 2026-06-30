export default () => ({
  afterLoad(system) {
    // Close auth modal if the modal is open and the user presses Escape
    document.addEventListener("keydown", e => (
      e.key === "Escape" &&
        system.authSelectors.shownDefinitions()?.size &&
        system.authActions.showDefinitions()
    ));

    // Close auth modal if the modal is open and the user clicks outside of it
    document.addEventListener("click", (e) => (
      e.target.closest(".dialog-ux") &&
        !e.target.closest(".modal-ux") &&
        system.authSelectors.shownDefinitions()?.size &&
        system.authActions.showDefinitions()
    ));
  },
});
