const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry:{ 
   main: "./src/client/js/main.js",
   videoPlayer: "./src/client/js/videoPlayer.js" 
  },
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean:true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader", //javascript 코드를 babel-loader라는 loader로 가공
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // 역순으로 적어주는 이유는 webpack이 역순으로 실행하기 때문이다
      },
    ],
  },
};
