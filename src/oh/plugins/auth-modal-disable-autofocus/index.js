export default () => ({
  statePlugins: {
    auth: {
      wrapActions: {
        showDefinitions: (ori) => (...args) => {
          const res = ori(...args);
          requestAnimationFrame(() => document.querySelector(".dialog-ux .auth-container input:focus")?.blur());
          return res;
        },
      },
    },
  },
});
