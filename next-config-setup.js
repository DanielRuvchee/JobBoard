// This script enables the use of next.config.ts by requiring ts-node to register TypeScript handling
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

// Export the TypeScript config
module.exports = require('./next.config.ts'); 