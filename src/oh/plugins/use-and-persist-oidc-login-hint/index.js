export default (system) => {
  const getOidcSchemes = () =>
    system.specSelectors.securityDefinitions()?.filter((d) => d.get("type") === "openIdConnect" && d.get("openIdConnectUrl"))

  const getLoginHints = () => {
    try {
      return JSON.parse(localStorage.getItem("login_hints")) || {}
    } catch (e) {
      console.error("OidcLoginHintPlugin: failed to parse login_hints from localStorage", e)
      return {}
    }
  }

  // Store the login hints in localStorage, so they persist across page
  const saveLoginHint = (oidcUrl, preferredUsername) => {
    const hints = getLoginHints()
    hints[oidcUrl] = preferredUsername
    localStorage.setItem("login_hints", JSON.stringify(hints))
  }

  // Re-initialize OAuth config, so following logins to the same IDP will
  // use the login_hint from localStorage
  const applyLoginHint = (oidcUrl) => {
    const hint = getLoginHints()[oidcUrl]
    if (hint) {
      const currentConfig = system.authSelectors.getConfigs() || {}
      const { additionalQueryStringParams } = currentConfig
      system.authActions.configureAuth({
        ...currentConfig,
        additionalQueryStringParams: { ...additionalQueryStringParams, login_hint: hint }
      })
    }
  }

  const handleResponse = (response) => {
    if (!response.url || !response.body || response.status >= 400) {
      return response
    }

    const oidcSchemes = getOidcSchemes()
    if (!oidcSchemes) return response

    // When resolving the OpenID Connect URLs, if we have a login hint for that
    // identity provider (from a previous login), we can add it to the OAuth
    // config so that the user doesn't have to re-enter their username.
    if (oidcSchemes.some((d) => d.get("openIdConnectUrl") === response.url)) {
      applyLoginHint(response.url)
      return response
    }

    // If the response is from a token endpoint, we can extract the preferred_username
    // from the id_token and store it in localStorage for future logins.
    const securityScheme = oidcSchemes.find((d) => d.getIn(["openIdConnectData", "token_endpoint"]) === response.url)
    if (securityScheme) {
      try {
        const claims = JSON.parse(atob(response.body.id_token.split(".")[1]))
        if (claims.preferred_username) {
          const oidcUrl = securityScheme.get("openIdConnectUrl")
          saveLoginHint(oidcUrl, claims.preferred_username)
          applyLoginHint(oidcUrl)
        }
      } catch (e) {
        console.error("OidcLoginHintPlugin: failed to parse id_token", e)
      }
    }

    return response
  }

  return {
    statePlugins: {
      configs: {
        wrapActions: {
          loaded: (original) => (...args) => {
            original(...args)
            // Wrap fn.fetch directly — configsActions.update can't store
            // functions because the UPDATE_CONFIGS reducer uses fromJS(),
            // which silently drops non-serializable values like functions.
            const originalFetch = system.fn.fetch
            system.fn.fetch = (req) => {
              const responseInterceptor = req.responseInterceptor
              req.responseInterceptor = (res) => {
                const intercepted = responseInterceptor ? responseInterceptor(res) : res
                return handleResponse(intercepted)
              }
              return originalFetch(req)
            }
          }
        }
      }
    }
  }
}
