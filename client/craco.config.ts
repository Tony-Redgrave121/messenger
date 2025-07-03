import * as path from 'path'

module.exports = {
    webpack: {
        alias: {
            "@app": path.resolve(__dirname, "src/app"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@widgets": path.resolve(__dirname, "src/widgets"),
            "@features": path.resolve(__dirname, "src/features"),
            "@entities": path.resolve(__dirname, "src/entities"),
            "@shared": path.resolve(__dirname, "src/shared"),
            "@appTypes": path.resolve(__dirname, "src/appTypes"),
            "@services": path.resolve(__dirname, "src/services"),
        }
    }
}