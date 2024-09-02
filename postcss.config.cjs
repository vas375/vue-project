module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16, // 1rem = 16px，可以根据设计稿调整
      propList: ['*'], // 需要转换的属性
      selectorBlackList: ['.no-rem'], // 不进行转换的选择器
      minPixelValue: 2 // 设置要替换的最小像素值
    }
  }
}
