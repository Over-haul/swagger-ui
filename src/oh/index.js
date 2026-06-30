import AuthModalDisableAutofocusPlugin from "./plugins/auth-modal-disable-autofocus"
import AuthModalEasyClosePlugin from "./plugins/auth-modal-easy-close"
import ClearStaleOauth2CodePlugin from "./plugins/clear-stale-oauth2-code"
import OperationPermissionsPlugin from "./plugins/operation-permissions"
import TopBarWithEnvSwitchingPlugin from "./plugins/top-bar-with-env-switching"
import UseAndPersistOidcLoginHintPlugin from "./plugins/use-and-persist-oidc-login-hint"

const Oh = {
  plugins: {
    AuthModalDisableAutofocusPlugin,
    AuthModalEasyClosePlugin,
    ClearStaleOauth2CodePlugin,
    OperationPermissionsPlugin,
    TopBarWithEnvSwitchingPlugin,
    UseAndPersistOidcLoginHintPlugin,
  },
}

export default Oh
