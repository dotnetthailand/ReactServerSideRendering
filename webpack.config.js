const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const outputFileName = 'react-ssr';
const libraryName = 'ReactSsr';

module.exports = {
  entry: {
    // Output to the main project for ReactJS.NET
    [`wwwroot/scripts/${outputFileName}`]: './src/index',
    [`wwwroot/styles/${outputFileName}`]: './src/scss/style',
  },
  mode: 'development',
  output: {
    path: __dirname, // Output dir must be absolute path
    filename: '[name].js',
    // https://stackoverflow.com/a/64639975/1872200
    // https://webpack.js.org/configuration/output/#outputglobalobject
    // https://webpack.js.org/configuration/output/#outputlibrarytype
    // https://webpack.js.org/configuration/output/#type-amd
    library: {
      name: libraryName,
      type: 'var',
      export: 'default',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          // Extract to CSS file
          MiniCssExtractPlugin.loader,
          // Translates CSS to CommonJS and ignore solving URL of images
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          // Extract to CSS file
          MiniCssExtractPlugin.loader,
          // Translates CSS to CommonJS and ignore solving URL of images
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ]
      },
    ]// End rules
  },
  plugins: [
    new RemoveEmptyScriptsPlugin({ verbose: true }),
    new MiniCssExtractPlugin({
      // Configure the output of CSS.
      // It is relative to output dir, only relative path work, absolute path does not work.
      filename: "[name].css",
    }),
  ],
  externals: [{ react: 'React' }],
  // https://webpack.js.org/configuration/devtool/
  devtool: 'inline-source-map',
};
