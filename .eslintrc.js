module.exports =  {
    env: {node: true, es2017: true},
    parserOptions:  {
        ecmaVersion:  2017,  // Allows for the parsing of modern ECMAScript features
        sourceType:  "script",  // Allows for the use of imports
    },
    plugins: ["import"],
    extends:  [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    rules: {
        "array-bracket-spacing": ["error", "never"],
        "arrow-parens": ["error", "as-needed"],
        "brace-style": ["error", "stroustrup"],
        "comma-dangle": ["error", "always-multiline"],
        "eol-last": "error",
        "eqeqeq": "error",
        "indent": ["error", 4],
        "import/default": "off",
        "import/order": ["error", {"newlines-between": "always"}],
        "max-len": ["error", {code: 120, tabWidth: 4}],
        "no-array-constructor": "error",
        "no-caller": "error",
        "no-duplicate-imports": "error",
        "no-eval": "error",
        "no-labels": "error",
        "no-new": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-restricted-imports": ["error", "semver"],
        "no-shadow": "error",
        "no-tabs": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "object-curly-spacing": ["error", "never"],
        "object-shorthand": "error",
        "prefer-const": "error",
        "prefer-template": "error",
        "quotes": ["error", "single"],
        "semi": "error",
    },
    overrides: [
        {
            files: ["**/*.ts"],
            env: {node: true, es2017: true},
            parser: "@typescript-eslint/parser",
            extends:  [
                "plugin:import/typescript",
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking"
            ],
            parserOptions:  {
                ecmaVersion:  2017,  // Allows for the parsing of modern ECMAScript features
                sourceType:  "module",  // Allows for the use of imports
                project: "./tsconfig-eslint.json"
            },
            rules: {

            },
        },{
            files: ["**/*.json"],
            env: {node: true, es2017: true},
            extends:  [
                "plugin:json/recommended",
            ],
            rules: {
                "indent": ["error", 2],
            }
        }
    ]

};
