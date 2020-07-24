/**
 * Created by Administrator on 2020/6/9.
 */
module.exports = {
    devServer: {
        // proxy代理
        proxy: {
            '/api': {
                // target: 'http://172.16.8.39:8080', // 设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://172.16.8.37:8080',
                target: 'http://139.224.110.93:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''// 这里理解成用‘/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替
                }
            }
        }
    }
}