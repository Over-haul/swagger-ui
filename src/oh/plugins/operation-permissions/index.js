import OperationPermissions from "./components/operation-permissions"
import OperationExt from "./wrap-components/operation-ext"

export default () => ({
  components: {
    OperationPermissions
  },
  fn: {
    permissionsFromExtensions: (extensions) => ({
      permissions: extensions.get("x-user-permissions") || [],
      extensions: extensions.delete("x-user-permissions")
    })
  },
  wrapComponents: {
    OperationExt
  }
})
