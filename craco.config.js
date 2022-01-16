const CracoLessPlugin = require('craco-less')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#722ED1',
              '@layout-header-background': '#fff',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}
