// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import $ from 'jquery'
require('jquery.cookie')
import routes from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Router from 'vue-router'
import store from './vuex/store'
Vue.use(ElementUI);
Vue.use(Router);
Vue.config.productionTip = false;

$.ajaxSettings.crossDomain = true;

const router = new Router({
    routes
});

router.beforeEach((to,from,next) => {
   if(to.name !='ybdcLogin'&&!$.cookie('sessionId')){
        next({
          path: '/ybdcLogin'
        })
   }else{
       next()
   }
})



/* eslint-disable no-new */
export const thisVue = new Vue({
    router,
    store
}).$mount('#app');

