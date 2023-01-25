const { resolve } = require('path');
var path = require('path');
const { node } = require('webpack');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname),
    filename: '_bundle.js'
  },
  // },
  // resolve: {
  //   fallback: {
  //     fs: false
  //   }
  // }
};