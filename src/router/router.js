import Vue from 'vue';
import VueRouter from 'vue-router';
import {appRouter,needLoginRouter} from './index';
import Util from '@/libs/util';
import store from '@/store';

//需要登录的路由设置拦截
for(let i=0,len=needLoginRouter.length;i<len;i++){
  var item = needLoginRouter[i];
  item.beforeEnter=Util.needLogin;
  var child = item.children;
  if(child && child.length>0){
    for(let x=0,len2=child.length;x<len2;x++){
      child[x].beforeEnter=Util.needLogin;
    }
  }
}

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: [...appRouter,...needLoginRouter]
};

export const router = new VueRouter(RouterConfig);

//全局拦截
let firstLoad = false;
router.beforeEach((to, from, next) => {
  Vue.$vux.loading.show('加载中');
  //缓存处理全部放到这里
  if(from.name==null){
    //页面刷新过，或第一次进来
    firstLoad = true;
  }
  switch(to.name){
    case 'nlist':
      to.meta.needFlush = (from.name=='nongye' || from.name==null || firstLoad);
      if(firstLoad){
        firstLoad = false;
      }
      break;
    case 'jlist':
      to.meta.needFlush = (from.name=='jiaoyu' || from.name==null || firstLoad);
      if(firstLoad){
        firstLoad = false;
      }
      break;
  }

  //标题
  if(to.meta.title){
    Util.title(to.meta.title);
  }

  //next();
  //微信登录
  let search = location.search.replace("?","");
  //分享地址
  if(/from=.*?/.test(search) || to.query.rmsg){
    //location.search="";
    search = "";
  }
  if(search && !to.query.rmsg){
    let arr = search.split("&");
    let state2 = false;
    arr.forEach(function (item) {
      //console.log(item);
      let params = item.split("=");
      if(params[0]=='code'){
        state2 = true;
        let lcode = localStorage.getItem('lcode');
        console.log(lcode+":"+params[1])
        if(lcode==params[1]){
          Util.title(to.meta.title);
          next();
        }else{
          localStorage.setItem('lcode',params[1]);
          Util.ajax.post('/fapi/public/main/doLoginByWx?code='+params[1]).then(function (response) {
            //location.search="";
            if(response.data.wxuser){
              store.commit('saveWxuser',response.data.wxuser);
            }
            if(response.data.code==100){
              //登录成功
              store.commit('saveToken',response.data.wxscToken);
              next();
            }else{
              if(response.data.msg=="您的账号已被禁用"){
                alert("您的账号已被禁用");
                location.href='/';
              }else{
                Util.title(to.meta.title);
                next();
              }
            }
          });
        }
      }
    });
    if(!state2){
      Util.title(to.meta.title);
      next();
    }
  }else{
    Util.title(to.meta.title);
    store.commit('updateNowRoute',from);
    next();
  }
});


router.afterEach((to) => {
  Vue.$vux.loading.hide();
  //console.log(to.name);
  /*let str = '';
  if(to.query){
    str='?';
    for(let key in to.query){
      str+='&'+key+'='+to.query[key]
    }
    str = str.replace(/&/,'');
  }
  location.href = location.pathname+location.search+"#"+to.path+str*/
});
