const isProduction = process.env.NODE_ENV === 'production';
const TITLE = process.env.TITLE;

module.exports = {
  publicPath: isProduction ? '/' : './',
  productionSourceMap: false,
  // filenameHashing: false, // 去掉hash
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "~@/styles/variable.scss";`
      }
    }
  },
  chainWebpack: (config) => {
    /**
     * 设置页面title
     */
    config.plugin('html').tap((args) => {
      args[0].title = TITLE;
      return args;
    });

    /**
     * 移除prefetch
     */
    config.plugins.delete('prefetch');
  },
  configureWebpack: (config) => {
    // FIX: https://github.com/vuejs/vue-cli/issues/6594
    const SafariNomoduleFixPlugin = config.plugins.find(
      (plugin) => plugin?.constructor?.name === 'SafariNomoduleFixPlugin'
    );
    if (SafariNomoduleFixPlugin) {
      SafariNomoduleFixPlugin.unsafeInline = true;
    }
  }
};
