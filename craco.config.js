module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for @huggingface/transformers and onnxruntime-web
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

      // Fix for onnxruntime-web - exclude from parsing
      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });

      // Add externals for onnxruntime-web problematic modules
      webpackConfig.externals = {
        ...webpackConfig.externals,
        'onnxruntime-node': 'onnxruntime-node',
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
