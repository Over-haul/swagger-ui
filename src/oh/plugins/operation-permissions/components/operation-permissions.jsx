import React from "react"
import PropTypes from "prop-types"

class OperationPermissions extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showDetails: false,
    }
  }

  onToggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails })
  }

  render() {
    // normalize and sort permissions
    const permissions = this.props.permissions
      .map(permission => ({
        name: permission.get("name"),
        details: permission.get("details") || "No details",
      }))
      .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)

    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <div className="tab-header"><h4>Related user permissions</h4></div>
          { !permissions.size ? null : this.state.showDetails ?
              <button className="btn cancel" onClick={this.onToggleDetails}>Cancel</button>
              : <button className="btn" onClick={this.onToggleDetails}>Show details</button>
          }
        </div>
        <div className="opblock-description-wrapper">
          {
            permissions.size ? permissions.map((permission, index) => (
              <span
                className="code user-permission-name"
                key={index}

              >{permission.name}</span>
            ))
            : <div className="user-permissions-none"><p>No permissions</p></div>
          }
          {
            !this.state.showDetails || !permissions.size ? null :
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th className="col_header">Permission</th>
                      <th className="col_header">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    permissions.map((permission, index) => (
                      <tr key={index}>
                        <td>{permission.name}</td>
                        <td>{permission.details}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    )
  }
}

OperationPermissions.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default OperationPermissions
