import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    name: "app/files-to-include",
    files: [
      "src/**/*.{js,vue}",
    ],
  },
  {
    name: "app/files-to-ignore",
    ignores: [
      "**/dist/",
      "**/*.config*",
      "examples/**/*.{js,vue}",
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    rules: {
      "arrow-body-style": ["error", "as-needed"],
      camelcase: "error",
      curly: "error",
      "default-case": "error",
      "default-case-last": "error",
      eqeqeq: ["error", "always"],
      "max-params": ["error", 3],
      "no-alert": "error",
      "no-bitwise": "error",
      "no-caller": "error",
      "no-eval": "error",
      "no-magic-numbers": "error",
      "no-nested-ternary": "error",
      yoda: "error",
      "prefer-template": "error",
    },
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/array-bracket-newline": ["error", "consistent"],
      "@stylistic/array-element-newline": ["error", { multiline: true, minItems: 3 }],
      "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
      "@stylistic/block-spacing": "error",
      "@stylistic/brace-style": "error",
      "@stylistic/comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "never",
          exports: "never",
          functions: "never",
        },
      ],
      "@stylistic/comma-spacing": "error",
      "@stylistic/comma-style": "error",
      "@stylistic/computed-property-spacing": "error",
      "@stylistic/curly-newline": ["error", "always"],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/function-call-spacing": "error",
      "@stylistic/function-paren-newline": ["error", "multiline"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/indent-binary-ops": ["error", 2],
      "@stylistic/semi-spacing": "error",
      "@stylistic/semi": "error",
      "@stylistic/rest-spread-spacing": "error",
      "@stylistic/quotes": "error",
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/operator-linebreak": ["error", "after"],
      "@stylistic/keyword-spacing": "error",
      "@stylistic/line-comment-position": "error",
      "@stylistic/max-len": [
        "error",
        {
          code: 120,
          comments: 120,
        },
      ],
      "@stylistic/multiline-comment-style": ["error", "starred-block"],
      "@stylistic/newline-per-chained-call": "error",
      "@stylistic/no-extra-semi": "error",
      "@stylistic/no-floating-decimal": "error",
      "@stylistic/no-mixed-spaces-and-tabs": "error",
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-multiple-empty-lines": "error",
      "@stylistic/no-tabs": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-whitespace-before-property": "error",
      "@stylistic/object-curly-newline": "error",


      "@stylistic/semi-style": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": ["error", "never"],
      "@stylistic/space-in-parens": "error",
      "@stylistic/space-infix-ops": "error",
      "@stylistic/switch-colon-spacing": "error",
      "@stylistic/template-curly-spacing": "error",
      "@stylistic/wrap-regex": "error",
    },
  },
];
