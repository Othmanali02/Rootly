module.exports = {
	transpileDependencies: true,
	devServer: {
		allowedHosts: "all",
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					"^/api": "",
				},
			},
		},
	},
};
 