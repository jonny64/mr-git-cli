const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginNoFloatingPromise = require("eslint-plugin-no-floating-promise");
const pluginSonarjs = require("eslint-plugin-sonarjs");

// @todo #0:1h fix npx eslint . cause 'Warning: React version not specified in eslint-plugin-react settings.'
module.exports = [{
	files: ["**/*.js"],
	languageOptions: {
		sourceType: "commonjs",
		globals: globals.node,
	},
	plugins: {
		"no-floating-promise": pluginNoFloatingPromise,
		sonarjs: pluginSonarjs,
	},
	rules: {
		...pluginJs.configs.recommended.rules,
		...pluginSonarjs.configs.recommended.rules,
		"no-unused-vars": "off",
		"sonarjs/sonar-no-unused-vars": "off",
		"sonarjs/sonar-no-fallthrough": "off",
		"sonarjs/todo-tag": "off",
		"sonarjs/aws-restricted-ip-admin-access": "off",

		"no-floating-promise/no-floating-promise": "error",
		"sonarjs/cognitive-complexity": ["error", 15],
	},
}];
