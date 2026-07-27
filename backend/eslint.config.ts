import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: ["dist/**", "node_modules/**"],
	},
	{
		files: ["**/*.{js,mjs,cjs}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.node,
		},
	},
	...tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.node,
		},
		rules: {
			// "no-console": "warn",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_" },
			],
		},
	},
]);
