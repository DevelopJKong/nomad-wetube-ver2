const path = require("path");

module.exports = {
	entry: "./src/client/js/main.js",
	mode:"development",
	output: {
		filename:"main.js",
		path: path.resolve(__dirname,"assets","js"),
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader', //javascript 코드를 babel-loader라는 loader로 가공
					options: {
						presets: [["@babel/preset-env",{targets: "defaults"}]],
					}
				}
			}
		]
	}
};