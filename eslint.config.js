const globals = require ("globals")
const pluginJs = require ("@eslint/js")
const pluginNoFloatingPromise = require ("eslint-plugin-no-floating-promise")

module.exports = [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.node}},
  pluginJs.configs.recommended,
  {
	plugins: {
		"no-floating-promise": pluginNoFloatingPromise
	},
	rules: {
		"no-unused-vars": "off",
		"no-floating-promise/no-floating-promise": "error"
	},
  }
];
