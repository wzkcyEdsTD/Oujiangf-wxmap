// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';//兼容
import Vue from 'vue'
//import FastClick from 'fastclick'
import App from './App.vue'
import store from './store';
import {router} from './router/router';
//import "@/iconfont/iconfont.css";
import 'url-search-params-polyfill';
//AJAX
import { AjaxPlugin } from 'vux';
Vue.use(AjaxPlugin);

//快速点击无延迟
//FastClick.attach(document.body);

//vux插件
import {ToastPlugin,LoadingPlugin,ConfirmPlugin,AlertPlugin} from 'vux';
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.use(ConfirmPlugin);
Vue.use(AlertPlugin);

//全局指令
import { TransferDom } from 'vux';
Vue.directive('transfer-dom', TransferDom);

//全局过滤
Vue.filter('dateFormat', function (value) {
  if(value){
    return new Date(value).Format("yyyy-MM-dd");
  }
  return "";
});
Vue.filter('dateTimeFormat', function (value) {
  if(value){
    return new Date(value).Format("MM-dd hh:mm");
  }
  return "";
});
Vue.filter('dateTimeFormat2', function (value) {
  if(value){
    return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
  }
  return "";
});

//微信
import { WechatPlugin } from 'vux';
Vue.use(WechatPlugin);


Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el:"#app-box",
  router,
  store,
  render: h => h(App)
});
