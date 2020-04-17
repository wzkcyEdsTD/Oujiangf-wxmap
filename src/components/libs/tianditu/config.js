export var _WZKCY_SERVER=location.hostname;
export var _WZKCY_PORT=location.port;
export var _WZKCY_SITENAME=location.pathname.split('/')[1];
var version = '4.9';
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
if(isiOS){
  version = '4.9.1';
}
var search = location.search;
console.log(search)
if(search && /.*?version.*/.test(search)){
  version = '4.10';
  if(isiOS){
    version = '4.10.1';
  }
}

export var ESRI_URL=_WZKCY_SERVER+":"+_WZKCY_PORT+"/arcgis_js_api/library/"+version;
if(_WZKCY_PORT==""||_WZKCY_PORT==null){
  ESRI_URL=_WZKCY_SERVER+"/arcgis_js_api/library/"+version;
}
export var Pointx=120.70903;
export var Pointy=28.007526;

export var ARCGIS_SERVICE_HOST = "http://218.75.26.61:6081";

//djdm1
export var WZKCY_ServerConfig = new function()
{
  //this.WFServer=ARCGIS_SERVICE_HOST+"/arcgis/rest/services/WZ_WeiFang/t_WeiFang/MapServer";
  this.djdm=ARCGIS_SERVICE_HOST+"/arcgis/rest/services/dajdm/djdm/MapServer";
  this.huodxx=ARCGIS_SERVICE_HOST+"/arcgis/rest/services/dajdm/huodxx/MapServer";
  this.peitss=ARCGIS_SERVICE_HOST+"/arcgis/rest/services/dajdm/peitss/MapServer";
  this.zxm_d=ARCGIS_SERVICE_HOST+"/arcgis/rest/services/dajdm/zxm_d/MapServer";
  this.zxm_x=ARCGIS_SERVICE_HOST+"/arcgis/rest/services/dajdm/zxm_x/MapServer";
  this.quy_m=ARCGIS_SERVICE_HOST+"/arcgis/rest/services/dajdm/quy_m/MapServer";
}
//路径指向
export var selfUrl=_WZKCY_SERVER+":"+_WZKCY_PORT+"/";
if(_WZKCY_PORT==""||_WZKCY_PORT==null){
  selfUrl=_WZKCY_SERVER+"/";
}
export var dojoConfig = {
  async: true ,
  parseOnLoad: true,
  mblHideAddressBar: false/*,
  has: {
    "esri-featurelayer-webgl": 0
  }*/
};
