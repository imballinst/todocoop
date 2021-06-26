module.exports = {
  env: {
    dev: {
      presets: [
        ['@babel/preset-env', { targets: { browser: 'last 2 versions' } }],
        '@babel/preset-typescript'
      ]
    },
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ]
    }
  }
};
