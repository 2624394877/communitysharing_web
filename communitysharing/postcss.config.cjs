const pxToViewport = require('postcss-px-to-viewport')

module.exports = {
  plugins: [
    pxToViewport({
      viewportWidth: 375,
      viewportUnit: 'vw',
      unitPrecision: 6,
      propList: ['*'],
      minPixelValue: 1,
      selectorBlackList: ['el-','web_','van-'],

      propList: [
        'width',
        'height',
        'margin',
        'margin-*',
        'padding',
        'padding-*',
        'top',
        'left',
        'right',
        'bottom'
      ],
      exclude: [/src\/model_web/]
    })
  ]
}