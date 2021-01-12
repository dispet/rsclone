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
        "no-nested-ternary": "off"
    },
    settings: {
        "import/resolver": {
            webpack: { config: "webpack.config.js" }
        }
    }
};
