module.exports = {
	transpileDependencies: true,
	devServer: {
		allowedHosts: "all",
		proxy: {
			"/api": {
				target: process.env.VUE_APP_API_PROXY,
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					"^/api": "",
				},
			},
		},
	},
};
