module.exports = api => {
    api.cache(false);
  
    return {
      presets: ["@babel/preset-env",],
      plugins: [
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-class-properties", { loose: true }],
      ],
      env: {
        testing: {
          presets: [
            [ "@babel/preset-env", { targets: { node: "current" }}],
          ],
        },
      },
    };
  };