import js from '@eslint/js';
import path from "path";
import { fileURLToPath } from "url";
import typescriptParser from "@typescript-eslint/parser";
import Import from "eslint-plugin-import";
import React from "eslint-plugin-react";
import ReactHooks from "eslint-plugin-react-hooks";
import Prettier from "eslint-plugin-prettier";
import globals from "globals";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import { fixupPluginRules, fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const compatWithRecommended = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
  });
export default defineConfig([
  globalIgnores([""functions/*"","node_modules/",".DS_Store","dist/",".vscode/",".idea/",".firebase/*.cache","*.log","functions/lib",".secret.local",".cache/","coverage/","dist/*","!dist/index.html",".DS_Store?","._*",".Spotlight-V100",".Trashes","ehthumbs.db","Thumbs.db"]),
  {
    extends: fixupConfigRules(compatWithRecommended.extends(
      js.configs.recommended,
      "plugin:react/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "plugin:@typescript-eslint/recommended"
    )),
    plugins: {
      import: fixupPluginRules(Import),
      react: fixupPluginRules(React),
      "react-hooks": fixupPluginRules(ReactHooks),
      prettier: fixupPluginRules(Prettier)
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es6,
        ...globals.node
      },
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            "jsx": true
        }
      }
    },
    rules: {
      "@typescript-eslint/array-type": [
            "error",
            {
                "default": "array-simple"
            }
        ],
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-shadow": "error",
      "arrow-body-style": "error",
      "eol-last": "warn",
      "import/no-useless-path-segments": "error",
      "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index"
                ],
                "newlines-between": "always-and-inside-groups",
                "pathGroups": [
                    {
                        "pattern": "react+(|-**)",
                        "group": "external",
                        "position": "before"
                    },
                    {
                        "pattern": "@entur/**",
                        "group": "external",
                        "position": "after"
                    },
                    {
                        "pattern": "@pages/**",
                        "group": "internal",
                        "position": "after"
                    },
                    {
                        "pattern": "@components/**",
                        "group": "internal",
                        "position": "after"
                    }
                ],
                "warnOnUnassignedImports": true,
                "pathGroupsExcludedImportTypes": []
            }
        ],
      "no-console": "error",
      "no-shadow": "off",
      "object-shorthand": ["error", "always"],
      "prefer-const": "warn",
      "prettier/prettier": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
      "react/jsx-no-undef": [
            "error",
            {
                "allowGlobals": true
            }
        ],
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",
      "react/no-unused-prop-types": "error",
      "react/no-unused-state": "error",
      "react/no-will-update-set-state": "error",
      "react/prefer-stateless-function": "warn",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "warn",
      "react/sort-prop-types": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "no-unused-vars": ["warn", {"caughtErrors":"none"}],
      "no-constant-binary-expression": 'off',
      "no-empty-static-block": 'off',
      "no-new-native-nonconstructor": 'off',
      "no-unused-private-class-members": 'off'
    },
  }
]);
