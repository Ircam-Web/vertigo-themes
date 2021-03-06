// This webpack config is used to :
//      - Compile src into `static/components`
//      - Apply babel on `<scripts>` / js files in Vue
//      - Apply PostCSS on `<style>` / css files in Vue
//

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const fs = require('fs')
const path = require('path')

const appPath = path.join('src', 'apps')

const entries = fs.readdirSync(appPath)
  // .filter((file) => file.match(/.*\.js$/))
  .reduce((obj, dirName) => {
    // const entryKey = fileName.split('.').slice(0, -1).join('.')
    obj[dirName] = path.join('apps', dirName, 'index.js')
    return obj
  }, {})

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
console.info(`Building for ${env} environment`)

module.exports = {
  mode: env,
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'static', 'components')
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.js', '.json', '.vue', '.css'],
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/static/components'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new StylelintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}']
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](vue|vuex)[\\/]/,
          chunks: 'all',
          name: 'vendors',
          enforce: true
        }
      }
    }
  }
}
