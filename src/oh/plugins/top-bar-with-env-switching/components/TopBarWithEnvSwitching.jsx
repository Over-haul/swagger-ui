/**
 * This component intentionally mirrors and extends the default Swagger UI `TopBar`
 * (src/standalone/plugins/top-bar/components/TopBar.jsx).
 *
 * Key divergences from upstream TopBar:
 *   - Specs are loaded dynamically at runtime by fetching the URL provided per-env
 *     via the `urlsFrom` config option, rather than being passed in via `urls` config.
 *   - An environment switcher (buttons) is rendered alongside the spec dropdown,
 *     driven by `urlsFrom` entries. Switching envs triggers a full page reload.
 *   - The free-text URL input fallback is intentionally omitted.
 *
 */
import React from "react"
import PropTypes from "prop-types"

import { parseSearch, serializeSearch } from "core/utils"

const buildSearchUrl = (updates, removals = []) => {
  const pageUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
  const search = parseSearch()
  Object.assign(search, updates)
  removals.forEach((key) => delete search[key])
  return `${pageUrl}?${serializeSearch(search)}`
}

const replaceSearchParams = (updates, removals = []) => {
  if (window && window.history && window.history.replaceState) {
    window.history.replaceState(null, "", buildSearchUrl(updates, removals))
  }
}

class TopBarWithEnvSwitching extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedIndex: 0,
      selectedEnv: parseSearch()["urls.selectedEnv"],
      specs: [],
    }
  }

  flushAuthData() {
    const { persistAuthorization } = this.props.getConfigs()
    if (persistAuthorization) {
      return
    }
    this.props.authActions.restoreAuthorization({ authorized: {} })
  }

  loadSpec = (url) => {
    this.flushAuthData()
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  onUrlSelect = (e) => {
    const url = e.target.value || e.target.href
    this.loadSpec(url)
    this.setSelectedUrl(url)
    e.preventDefault()
  }

  setSelectedUrl = (selectedUrl) => {
    this.state.specs.forEach((spec, i) => {
      if (spec.url === selectedUrl) {
        this.setState({ selectedIndex: i })
        replaceSearchParams({ "urls.primaryName": spec.name })
      }
    })
  }

  async componentDidMount() {
    const { urlsFrom } = this.props.getConfigs()

    if (!urlsFrom || !urlsFrom.length) {
      return
    }

    const search = parseSearch()
    const selectedEnv = search["urls.selectedEnv"] || urlsFrom[0].name

    if (!search["urls.selectedEnv"]) {
      replaceSearchParams({ "urls.selectedEnv": selectedEnv })
    }

    this.setState({ selectedEnv })

    const envEntry = urlsFrom.find((entry) => entry.name === selectedEnv) || urlsFrom[0]

    try {
      const response = await fetch(envEntry.url)
      const specs = await response.json()

      const primaryName = search["urls.primaryName"]
      const matchIndex = primaryName ? specs.findIndex((spec) => spec.name === primaryName) : -1
      const selectedIndex = matchIndex >= 0 ? matchIndex : 0

      this.setState({ specs, selectedIndex })
      this.loadSpec(specs[selectedIndex].url)
    } catch (e) {
      console.error("TopBarWithEnvSwitching: failed to load specs for environment:", selectedEnv, e)
    }
  }

  switchEnv = (env) => {
    window.location.href = buildSearchUrl(
      { "urls.selectedEnv": env },
      ["urls.primaryName"]
    )
  }

  render() {
    const { getComponent, specSelectors, getConfigs } = this.props
    const { selectedEnv, specs, selectedIndex } = this.state

    const Button = getComponent("Button")
    const Link = getComponent("Link")
    const Logo = getComponent("Logo")
    const DarkModeToggle = getComponent("DarkModeToggle")

    const isLoading = specSelectors.loadingStatus() === "loading"

    const { urlsFrom } = getConfigs()

    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link>
              <Logo />
            </Link>
            {specs.length ? (
              <form className="download-url-wrapper">
                <label className="select-label" htmlFor="select">
                  <span>Select a definition</span>
                  <select
                    id="select"
                    disabled={isLoading}
                    onChange={this.onUrlSelect}
                    value={specs[selectedIndex] ? specs[selectedIndex].url : ""}
                  >
                    {specs.map((link) => (
                      <option key={link.url} value={link.url}>
                        {link.name}
                      </option>
                    ))}
                  </select>
                </label>
              </form>
            ) : null}
            {urlsFrom && urlsFrom.length ? (
              <div className="env-switcher">
                {urlsFrom.map((entry) => (
                  <Button
                    key={entry.name}
                    className={`env-switcher__btn${entry.name === selectedEnv ? " env-switcher__btn--active" : ""}`}
                    onClick={() => this.switchEnv(entry.name)}
                  >
                    {entry.name.toUpperCase()}
                  </Button>
                ))}
              </div>
            ) : null}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    )
  }
}

TopBarWithEnvSwitching.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  authActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired,
}

export default TopBarWithEnvSwitching
