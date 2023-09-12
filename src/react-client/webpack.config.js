// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// module.exports = {
//     entry: "./src/index.jsx",
//     output: {
//         path: path.resolve(__dirname, "dist",),
//         filename: "[name].[chunkhash].js",
//         publicPath: "/",
//     },
//     resolve: {
//         extensions: [".js", ".jsx"],
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 use: "ts-loader",
//                 exclude: /node_modules/
//             },
//             {
//                 test: /\.css$/,
//                 use: [MiniCssExtractPlugin.loader, "css-loader"],
//             },
//         ],
//     },
//     plugins: [
//         new CleanWebpackPlugin(),
//         new HtmlWebpackPlugin({
//             template: "./src/index.html",
//         }),
//         new MiniCssExtractPlugin({
//             filename: "css/[name].[chunkhash].css",
//         }),
//         new CleanWebpackPlugin()
//     ],
// };
