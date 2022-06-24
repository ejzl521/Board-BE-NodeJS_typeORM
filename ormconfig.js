const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy

module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": 6296,
    "username": "duckgugong",
    "password": "12345678",
    "database": "duckDB",
    "extra": {
        "charset": "utf8mb4_unicode_ci"
    },
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/**/*.ts"
    ],
    "migrations": [
        "src/migration/**/*.ts"
    ],
    "subscribers": [
        "src/subscriber/**/*.ts"
    ],
    namingStrategy: new SnakeNamingStrategy()
}
