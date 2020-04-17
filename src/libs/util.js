//import axios from 'axios';
import { AjaxPlugin } from 'vux';
import store from '../store';
import Vue from 'vue';

let util = {
};

let isdev = true;

util.wxconfig = {
  domain:"",
  host:"",
  uri:"",
  appid:"wx5dfc3a24edf2843d"//wx3b021b463ffa0a79
};

util.title = function (title) {
    title = title || '';
    window.document.title = title;
};

util.isIOS = function () {
  let isIphone = navigator.userAgent.includes('iPhone')
  let isIpad = navigator.userAgent.includes('iPad')
  return isIphone || isIpad
};

/*const ajaxUrl = env === 'development'
    ? 'http://127.0.0.1:8020'
    : env === 'production'
    ? 'https://www.url.com'
    : 'https://debug.url.com';*/
const ajaxUrl = 'http://tdt.wzmap.gov.cn';

//全局默认
//axios.defaults.headers.common['token'] = store.state.user.token;
//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
util.ajax = AjaxPlugin.$http.create({
    baseURL: ajaxUrl,
    timeout: 30000//,
    //withCredentials:true//跨域
});

//请求拦截器
util.ajax.interceptors.request.use(
    config => {
        //console.log(config);
        if(util.isIOS()){
          config.headers.iosdate = new Date().getTime();
        }
        if (store.getters.wxscToken) {  // 判断是否存在token，如果存在的话加上
            config.headers.wxscToken = store.state.user.wxscToken;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

//检查是否登录
util.checkLog = function () {
   return util.ajax.post("/fapi/public/main/isLogin");
};

//登录
util.login = async function () {
  if(isdev){
    return;
  }
  let openid = JSON.parse(localStorage.getItem('wxuser') || '{}').openid;
  //有openid根据openid登录
  if(openid){
    Vue.$vux.loading.show();
    const response = await this.ajax.post('/fapi/public/main/loginByOpenid?openid='+openid);
    Vue.$vux.loading.hide();
    if(response.data.code==100){
      //登录成功
      store.commit('saveToken',response.data.wxscToken);
      //更新用户信息
      this.ajax.post('/fapi/public/main/updateUserInfo?openid='+openid).then(function (result) {
        if(result.data.code==100 && result.data.wxuser){
          store.commit('saveWxuser',result.data.wxuser);
        }
      });
    }else if(response.data.msg=="您的账号已被禁用"){
      alert("您的账号已被禁用");
    }else{
      	Vue.$vux.toast.text('登录失败');
		localStorage.removeItem('wxuser');
		location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ util.wxconfig.appid+
				"&redirect_uri="+encodeURIComponent(location.href.replace(location.search,''))+
				"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    }
  }
  //没有重定向到微信登录
  else{
    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ util.wxconfig.appid+
      "&redirect_uri="+encodeURIComponent(location.href.replace(location.search,''))+
      "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
  }
};

//添加响应拦截器
util.ajax.interceptors.response.use(function (response) {
    if(response.data.code==-1){
        //未登录
         util.login();
    }else{
        return response;
    }
}, function (error) {
    if((error+'')=='Error: timeout of 30000ms exceeded'){
      Vue.$vux.toast.text('连接超时,请检查您的网络');
      Vue.$vux.loading.hide();
    }
    return Promise.reject(error);
});

//日期格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


util.needLogin = function (to,from,next) {
  //需要登录的页面
  next();
};

/**
 * 目录树查询
 * @param items 目录树，JSON对象
 * @param nameField 代表名称字段的字段名称
 * @param childField 代表子类数组的字段名称
 * @param key 查询关键字
 * @returns {*} 返回查询后的结果树，把原来的树替换掉就可以
 */
util.searchTree = function(items,nameField,childField,key) {
  //相当于克隆了一个对象
  const resultTemp = JSON.parse(JSON.stringify(items));
  const reg = RegExp(".*?"+key,"gi");
  util.forEachChild({
    'name':'',
    'list':resultTemp
  },reg,nameField,childField);
  return resultTemp;
}
/**
 * 递归目录树子类查询
 * @param items JSON对象
 * @param reg   正则对象
 * @param nameField 代表名称字段的字段名称
 * @param childField 代表子类数组的字段名称
 * @returns {boolean}   true就是找到了
 */
util.forEachChild = function(items,reg,nameField,childField) {
  var subsTem = [],childItems;
  items[childField].forEach(function (child) {
    childItems = child[childField];
    //设置从开头匹配
    reg.lastIndex = 0;
    if((name[nameField] && reg.test(child[nameField])) || (child.attributes && reg.test(child.attributes.NAME))){
      //还是要递归一下它的子类
      if(childItems!=undefined && childItems.length>0){
        util.forEachChild(child,reg,nameField,childField);
      }
      subsTem.push(child);
    }else if(childItems!=undefined && childItems.length>0 && util.forEachChild(child,reg,nameField,childField).length>0){
      //当前不匹配，但是子类匹配到了，也保留
      subsTem.push(child);
    }
  });
  items[childField] = subsTem;
  return subsTem;
}
/**
 * json转成Iview Tree
 * @param json
 * @param selectId 选中的Id
 */
util.jsonToTree = function(json){
  var treeData = [];
  json.forEach(function (item) {
    if(item.parentId==0){
      treeData.push({
        name:item.name,
        serviceurl:item.serviceurl,
        icon:item.pic,
        detail:item.detail,
        field:item.field,
        layerid:item.layerid,
        state:item.state,
        id:item.id,
        tag:item.tag,
        parentId:0
      })
    }
  });
  setTreeChild(treeData,json);
  return treeData;
}
/**
 * 递归json转成Tree
 * @param treeChild
 * @param datas
 * @param selectId 要被选中的ID
 */
function setTreeChild(treeChild,datas) {
  treeChild.forEach(function (item) {
    datas.forEach(function (data) {
      if(data.parentId==item.id){
        if(item.children==undefined){
          item.children=[];
        }
        item.children.push({
          name:data.name,
          serviceurl:data.serviceurl,
          icon:data.pic,
          detail:data.detail,
          layerid:data.layerid,
          state:data.state,
          field:data.field,
          id:data.id,
          tag:data.tag,
          parentId:data.parentId
        });
      }
    });
    if(item.children!=undefined && item.children.length>0){
      setTreeChild(item.children,datas);
    }
  });
}


util.dic = function (dicCode) {
  return util.ajax.post('/pubApi/dic/dicItemList?dicCode='+dicCode);
};

/**
 * 坐标转换
 * @type {{x_PI: number, PIs: number, a: number, ee: number}}
 */
var piObj = {
  x_PI : 3.14159265358979324 * 3000.0 / 180.0,
  PIs : 3.1415926535897932384626,
  a : 6378245.0,
  ee : 0.00669342162296594323
}
util.togcj02 = function (lng, lat) {
  var dlat = transformlat(lng - 105.0, lat - 35.0);
  var dlng = transformlng(lng - 105.0, lat - 35.0);
  var radlat = lat / 180.0 * piObj.PIs;
  var magic = Math.sin(radlat);
  magic = 1 - piObj.ee * magic * magic;
  var sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((piObj.a * (1 - piObj.ee)) / (magic * sqrtmagic) * piObj.PIs);
  dlng = (dlng * 180.0) / (piObj.a / sqrtmagic * Math.cos(radlat) * piObj.PIs);
  var mglat = lat + dlat;
  var mglng = lng + dlng;
  return [mglng, mglat];
}

function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * piObj.PIs) + 20.0 * Math.sin(2.0 * lng * piObj.PIs)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * piObj.PIs) + 40.0 * Math.sin(lat / 3.0 * piObj.PIs)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * piObj.PIs) + 320 * Math.sin(lat * piObj.PIs / 30.0)) * 2.0 / 3.0;
  return ret
}

function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * piObj.PIs) + 20.0 * Math.sin(2.0 * lng * piObj.PIs)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * piObj.PIs) + 40.0 * Math.sin(lng / 3.0 * piObj.PIs)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * piObj.PIs) + 300.0 * Math.sin(lng / 30.0 * piObj.PIs)) * 2.0 / 3.0;
  return ret
}


util.isdev = true;



export default util;
