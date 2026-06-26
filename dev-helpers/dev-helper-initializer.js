/* eslint-disable no-undef */
window.onload = function() {
  window["SwaggerUIBundle"] = window["swagger-ui-bundle"]
  window["SwaggerUIStandalonePreset"] = window["swagger-ui-standalone-preset"]
  window["OhBundle"] = window["oh-bundle"]
  // Build a system
  const ui = SwaggerUIBundle({
    urlsFrom: [
      { name: "petstore", url: "./specs.json" },
      { name: "dev", url: "./examples/specs.dev.json" },
    ],
    dom_id: "#swagger-ui",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl,
      OhBundle.plugins.OperationPermissionsPlugin,
      OhBundle.plugins.TopBarWithEnvSwitchingPlugin
    ],
    // requestSnippetsEnabled: true,
    layout: "StandaloneLayout"
  })

  window.ui = ui

  ui.initOAuth({
    clientId: "your-client-id",
    clientSecret: "your-client-secret-if-required",
    realm: "your-realms",
    appName: "your-app-name",
    scopeSeparator: " ",
    scopes: "openid profile email phone address",
    additionalQueryStringParams: {},
    useBasicAuthenticationWithAccessCodeGrant: false,
    usePkceWithAuthorizationCodeGrant: false
  })
}
