module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  root: true,
  env: {
    // "browser": true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    "ecmaFeatures": {
      "jsx": true
    },
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  ignorePatterns: ["dist"],
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    "no-console": "off",
    "no-alert": "off",
    "import/prefer-default-export": "off",
    "no-else-return": "off",
    "no-lonely-if": "off",
    "max-classes-per-file": "off",
    "no-restricted-syntax": [
      "error",
      // {
      //   selector: 'ForInStatement',
      //   message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      // },
      // {
      //   selector: 'ForOfStatement',
      //   message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      // },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-floating-promises": [
      "error",
      {
        "ignoreIIFE": true,
      }
    ],
    // FIXME next導入したら以下でるようになったが、eslintがimportした型を判別できないためにでてるので無視
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    // FIXME react上でvoidに対してPromise<void>をassignして怒られるが直すのが面倒
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksConditionals": false,
        "checksVoidReturn": false,
      }
    ],
  },
};
