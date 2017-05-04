// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import MintUI from 'mint-ui'
import routerConfig from './router/index'
import axios from 'axios'   //axios的ajax请求，类似vue-resource
import util from './common/js/util.js'
import 'mint-ui/lib/style.css'

import App from './App.vue'
require('./common/js/reset.js') //	全局加载重置js
require('./common/css/reset.css')
import './static/less/common.less'

// 使用fastclick解决移动端点击事件300ms的延迟
document.addEventListener('DOMContentLoaded', function() {
    if (window.FastClick) window.FastClick.attach(document.body)
}, false)

Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(util)
//做一下代理
Vue.prototype.$http = axios
//全局ajax请求拦截器
axios.interceptors.request.use(
    config => {
        // localStorage.setItem('TOKEN', '123456');
        var token = localStorage.getItem('TOKEN');
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers['token'] = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
const router = new VueRouter({
    //	保存页面切换的位置滚动
    saveScrollPosition: true,
    routes: routerConfig
})
Vue.config.productionTip = false
    /* eslint-disable no-new */
const Menu = new Vue({
    router,
    render: h => h(App)
})
Menu.$mount('#app')
router.afterEach(function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0
})
window.router = router
