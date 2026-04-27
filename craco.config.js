const path = require('path');
const webpack = require('webpack');

module.exports = {
  jest: {
    configure: (jestConfig) => {
      // Map ESM-only packages to their manual mocks so Jest can import them in jsdom
      jestConfig.moduleNameMapper = {
        ...(jestConfig.moduleNameMapper || {}),
        '^@huggingface/transformers$': '<rootDir>/src/__mocks__/@huggingface/transformers.js',
        '^@vladmandic/face-api$': '<rootDir>/src/__mocks__/@vladmandic/face-api.js',
      };
      return jestConfig;
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      const isNetlify = process.env.NETLIFY === 'true';
      const nodeEnv = process.env.NODE_ENV;
      
      console.log('🔧 CRACO: Configuring webpack...');
      console.log(`📍 Environment: ${nodeEnv}`);
      console.log(`🌐 Netlify Build: ${isNetlify ? 'YES' : 'NO'}`);
      console.log(`📦 Node Version: ${process.version}`);
      
      // Fix for @tensorflow/tfjs (used by face-api): strip "node:" URI prefix so
      // existing fallbacks handle "fs", "os", "path", etc.
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        })
      );
      console.log('✅ CRACO: Added NormalModuleReplacementPlugin for node: URIs');

      // Fix for @huggingface/transformers and onnxruntime-web
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false,
        "fs/promises": false,
        "path": false,
        "path/posix": false,
        "path/win32": false,
        "crypto": false,
        "os": false,
        "worker_threads": false,
        "perf_hooks": false,
        "stream": false,
        "buffer": false,
        "util": false,
        "url": false,
        "http": false,
        "https": false,
        "zlib": false,
        "net": false,
        "tls": false,
        "child_process": false,
        "async_hooks": false,
        "readline": false,
        "module": false,
        "v8": false,
        "vm": false,
      };
      console.log('✅ CRACO: Added resolve fallbacks');

      // Ignore warnings from @huggingface/transformers and @tensorflow/tfjs (used by face-api)
      webpackConfig.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /Critical dependency: 'import.meta' cannot be used as a standalone expression/,
        /Module not found: Error: Can't resolve 'worker_threads'/,
        /Module not found: Error: Can't resolve 'perf_hooks'/,
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

      // Resolve onnxruntime-web to its browser bundle (supports package exports)
      let ortPath;
      const ortCandidates = [
        'onnxruntime-web/webgpu',   // ort 1.19+ package export
        'onnxruntime-web/wasm',
        'onnxruntime-web',
      ];
      for (const candidate of ortCandidates) {
        try {
          ortPath = require.resolve(candidate);
          console.log(`✅ CRACO: Resolved onnxruntime-web via "${candidate}": ${ortPath}`);
          break;
        } catch {
          // try next
        }
      }
      if (!ortPath) {
        console.error('❌ CRACO: Could not resolve onnxruntime-web — WebGPU inference may fail');
      }

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
