const path = require('path'); //подключение path
//добавление html плагина, что бы измененные названия файлов были в html
const HtmlWebpackPlugin = require('html-webpack-plugin')
//очистка от не актуальных файлов
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssPlugin = require('mini-css-extract-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const options = require('webpack-dev-server/bin/options');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
 const config = {
  splitChunks: {
   chunks: 'all'
  }
 }
 if(isProd) {
  config.minimizer = [
   new OptimizeCss(),
   new TerserWebpackPlugin()
  ]
 }
 return config
}

module.exports = {
 context: path.resolve(__dirname, 'src'),
 mode: 'development', //не минифицирован bundle.js
 entry: './app.js',
 // entry: {
 //  main: './app.js',
 //  pixi: './pixi.min.js'
 // },
 output: {
  filename: '[name].[contenthash].js', //очистка хеша
  path: path.resolve(__dirname, 'dist')//куда складывать
 },
 resolve: {
  extensions: ['.js', '.json'], //можно не указывать при экспорте разрешения, которые указаны тут
  alias: { //что бы не указывать относительный путь
   '@': path.resolve(__dirname, "src"),
  },
 },
 optimization: optimization(),
 devServer: {
  port: 8080
 },
 plugins: [
  //добавление плагина
  new HtmlWebpackPlugin({
   template: './index.html',
   minify: {
    collapseWhitespace: isProd
   }
  }),
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin({
   patterns: [
    { //копируем картинки в dist
     from: path.resolve(__dirname, 'src/img/'),
     to: path.resolve(__dirname, 'dist/img')
    }
   ],
  }),
  new MiniCssPlugin({
   filename: '[name].[contenthash].css'
  })
 ],
 module: {
  rules: [
   {
    test: /\.css$/,
    use: [{
     loader: MiniCssPlugin.loader,
    }, 'css-loader'
    ]
   },
   {
    test: /\.(ttf|woff)$/,
    use: ['file-loader']
   },
   {
    test: /\.(png|jpg)$/,
    use: ['file-loader']
   }
  ]
 }

}

////можно добавлять несколько файлов, если нужно
//  entry: {
//   main: './src/js/app.js',
//   analytics: './src/js/analytics.js'
//  },
//  output: {
//   filename: '[name].bundle.js',
//   path: path.resolve(__dirname, 'dist')
//  }

// добавдение одного файла
// const path = require('path'); //подключение path
// module.exports = {
//  mode: 'development', //не минифицирован bundle.js
//  entry: './src/js/app.js', //откуда начинать
//  output: { //складываем работу webpack
//   filename: 'bundle.js',
//   path: path.resolve(__dirname, 'dist') //куда складывать
//  }
// }