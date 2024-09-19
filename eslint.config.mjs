import globals from "globals";
import pluginJs from "@eslint/js";
import pluginNoFloatingPromise from "eslint-plugin-no-floating-promise";


export default [
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
