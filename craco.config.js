module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for @huggingface/transformers
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false,
        "path": false,
        "crypto": false,
      };

      // Ignore warnings from @huggingface/transformers
      webpackConfig.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /Critical dependency: 'import.meta' cannot be used as a standalone expression/,
      ];

      // Add rule for handling .wasm files
      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: 'webassembly/async',
      });

      // Enable WebAssembly experiments
      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        asyncWebAssembly: true,
      };

      return webpackConfig;
    },
  },
  devServer: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
};
