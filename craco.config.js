const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const isNetlify = process.env.NETLIFY === 'true';
      const nodeEnv = process.env.NODE_ENV;
      
      console.log('🔧 CRACO: Configuring webpack...');
      console.log(`📍 Environment: ${nodeEnv}`);
      console.log(`🌐 Netlify Build: ${isNetlify ? 'YES' : 'NO'}`);
      console.log(`📦 Node Version: ${process.version}`);
      
      // Fix for @huggingface/transformers and onnxruntime-web
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false,
        "path": false,
        "crypto": false,
      };
      console.log('✅ CRACO: Added resolve fallbacks');

      // Ignore warnings from @huggingface/transformers
      webpackConfig.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /Critical dependency: 'import.meta' cannot be used as a standalone expression/,
      ];
      console.log('✅ CRACO: Configured ignore warnings');

      // Fix for onnxruntime-web - exclude from parsing
      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });
      console.log('✅ CRACO: Added WASM rule (asset/resource)');

      // Add externals for onnxruntime-web problematic modules
      webpackConfig.externals = {
        ...webpackConfig.externals,
        'onnxruntime-node': 'onnxruntime-node',
      };
      console.log('✅ CRACO: Added externals for onnxruntime-node');

      // Try to resolve onnxruntime-web path
      let ortPath;
      try {
        ortPath = require.resolve('onnxruntime-web/dist/ort.webgpu.min.js');
        console.log(`✅ CRACO: Found onnxruntime-web at: ${ortPath}`);
      } catch (error) {
        console.error(`❌ CRACO: Failed to resolve onnxruntime-web: ${error.message}`);
        // Fallback to package root
        try {
          ortPath = require.resolve('onnxruntime-web');
          console.log(`⚠️  CRACO: Using fallback path: ${ortPath}`);
        } catch (fallbackError) {
          console.error(`❌ CRACO: Fallback also failed: ${fallbackError.message}`);
        }
      }

      // Add alias to help resolve onnxruntime-web correctly
      if (ortPath) {
        webpackConfig.resolve.alias = {
          ...webpackConfig.resolve.alias,
          'onnxruntime-web': ortPath,
        };
        console.log('✅ CRACO: Added alias for onnxruntime-web');
      }

      // Log module rules count
      console.log(`📋 Total webpack rules: ${webpackConfig.module.rules.length}`);
      
      // Log resolve extensions
      console.log(`🔍 Resolve extensions: ${webpackConfig.resolve.extensions.join(', ')}`);

      console.log('🎉 CRACO: Webpack configuration complete');
      
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
