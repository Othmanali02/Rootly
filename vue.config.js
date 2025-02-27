module.exports = {
	transpileDependencies: true,
	devServer: {
		disableHostCheck: true,
		proxy: {
			"/api": {
				target: "http://backend:3000",
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					"^/api": "",
				},
			},
		},
	},
};
