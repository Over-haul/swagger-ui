export default () => ({
  statePlugins: {
    auth: {
      wrapActions: {
        authPopup: (original) => (url, oauth2Data) => {
          if (oauth2Data.auth) {
            // Clear stale code from previous session
            // see: https://github.com/swagger-api/swagger-ui/pull/10693
            delete oauth2Data.auth.code
          }
          return original(url, oauth2Data)
        }
      }
    }
  }
})
