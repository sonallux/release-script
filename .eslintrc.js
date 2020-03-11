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
        "max-len": ["error", {code: 120, tabWidth: 4}],
        "indent": ["error", 4],
        "no-tabs": "error",
        "quotes": ["error", "single"],
        "no-duplicate-imports": "error",
        "array-bracket-spacing": ["error", "never"],
        "object-curly-spacing": ["error", "never"],
        "no-var": "error",
        "import/order": ["error", {"newlines-between": "always"}],
        "arrow-parens": ["error", "as-needed"],
        "comma-dangle": ["error", "always-multiline"],
        "brace-style": ["error", "stroustrup"],
        "no-labels": "error",
        "no-caller": "error",
        "no-new-wrappers": "error",
        "no-array-constructor": "error",
        "no-new-object": "error",
        "no-new": "error",
        "no-eval": "error",
        "no-shadow": "error",
        "eqeqeq": "error",
        "prefer-const": "error",
        "object-shorthand": "error",
        "no-useless-rename": "error",
        "prefer-template": "error",
        "semi": "error",
    },
    overrides: [
        {
            files: ["**/*.ts"],
            env: {node: true, es2017: true},
            parser: "@typescript-eslint/parser",
            extends:  [
                "plugin:import/typescript",
                "plugin:@typescript-eslint/eslint-recommended",
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
            files: ["**/*.js"],
            env: {node: true, es2017: true},
            extends:  [
                "plugin:node/recommended",
            ],
            parserOptions:  {
                ecmaVersion:  2017,  // Allows for the parsing of modern ECMAScript features
                sourceType:  "script",  // Allows for the use of imports
            },
            rules: {

            },
        },
        {
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
