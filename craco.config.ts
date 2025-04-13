import path from "path"

module.exports = {
    webpack: {
        alias: {
            "@components": path.resolve(__dirname, "src/components"),
            "@features": path.resolve(__dirname, "src/features"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@store": path.resolve(__dirname, "src/store"),
            "@appTypes": path.resolve(__dirname, "src/appTypes")
        }
    }
}