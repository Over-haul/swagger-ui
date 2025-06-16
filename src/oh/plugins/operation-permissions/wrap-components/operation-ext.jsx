import React from "react"
import { OperationExt as Original } from "core/components/operation-extensions"

const OperationExt = (props) => {
  const extensions = props.extensions.delete("x-user-permissions")

  if(extensions.size > 0) {
    return <Original {...props} extensions={extensions} />
  }
}
OperationExt.propTypes = Original.propTypes

export default () => OperationExt
