module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2,
            {
                "ArrayExpression":     "first",
                "ObjectExpression":    "first",
                "VariableDeclarator":  { "var": 2, "let": 2, "const": 3 },
                "FunctionDeclaration": {"parameters": "first"},
                "FunctionExpression":  {"parameters": "first"},
                "CallExpression":      {"arguments":  "first"},
                "ImportDeclaration":   "first"
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
            { "avoidEscape": true }
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};