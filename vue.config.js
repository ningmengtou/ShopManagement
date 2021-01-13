module.exports = {
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
                config.entry('app').clear().add('./src/main-prod.js')

                // 通过externals加载外部CDN资源
                config.set('externals', {
                    vue: 'Vue',
                    axios: 'axios',
                    'vue-router': 'VueRouter',
                    loadsh: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': 'VueQuillEditor'
                })

                // 为html增加自定义属性
                config.plugin('html').tap(args => {
                    args[0].isProd = true
                    return args
                })
            })
            // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}