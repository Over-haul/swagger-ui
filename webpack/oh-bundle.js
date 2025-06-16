/**
 * @prettier
 */

const configBuilder = require("./_config-builder")

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
  },
  {
    entry: {
      "oh-bundle": ["./src/oh/index.js"],
    },

    output: {
      globalObject: "this",
      library: {
        name: "OhBundle",
        export: "default",
      },
    },
  }
)

module.exports = result
