// 这是项目发布阶段用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')
}

module.exports = {
    "presets": [
        "@vue/cli-plugin-babel/preset"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        // 发布产品时的插件数组
        ...prodPlugins,
        // 声明懒加载插件
        "@babel/plugin-syntax-dynamic-import"
    ]
}