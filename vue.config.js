module.exports = {
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true,
        secure: false, 
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
