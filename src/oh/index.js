import ClearStaleOauth2CodePlugin from "./plugins/clear-stale-oauth2-code"
import OperationPermissionsPlugin from "./plugins/operation-permissions"
import TopBarWithEnvSwitchingPlugin from "./plugins/top-bar-with-env-switching"
import UseAndPersistOidcLoginHintPlugin from "./plugins/use-and-persist-oidc-login-hint"

const Oh = {
  plugins: {
    ClearStaleOauth2CodePlugin,
    OperationPermissionsPlugin,
    TopBarWithEnvSwitchingPlugin,
    UseAndPersistOidcLoginHintPlugin,
  },
}

export default Oh
