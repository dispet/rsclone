module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parser: "babel-eslint",
    extends: ["eslint-config-airbnb-base", "eslint-config-prettier"],
    rules: {
        "import/prefer-default-export": "off",
        "class-methods-use-this": "off",
        "no-unused-expressions": "off",
        "consistent-return": "off",
        "no-unused-vars": "off",
        "import/no-cycle": "off",
        "prefer-destructuring": "off",
        "import/no-unresolved": "off",
        "no-bitwise": "off",
        "no-undef": "off",
        "no-nested-ternary": "off",
        "no-plusplus": "off",
        "import/no-mutable-exports": "off",
        "no-param-reassign": "off",
        "no-restricted-globals": "off",
        "no-useless-constructor": "off",
        "no-empty-function": "off",
        "no-use-before-define": "off",
        "no-useless-catch": "off",
        "import/order": "off",
        "no-sequences": "off",
        "no-await-in-loop": "off",
        "import/no-extraneous-dependencies": "off",
        "no-shadow": "off",
        "no-restricted-syntax": "off",
    },
    settings: {
        "import/resolver": {
            webpack: { config: "webpack.config.js" }
        }
    }
};
