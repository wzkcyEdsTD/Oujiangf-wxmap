<template>
  <div style="height:100%">
    <map-div ref="mapdiv">
      <tianditu slot="tianditu" @mapload="mapload"
                @shiyutieluClick="shiyutieluClick"
                :loading=true
                layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
                ref="map" mapid="jiaotongmap" style="height:100%;"></tianditu>
    </map-div>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import Tianditu from '@/components/libs/tianditu/main';
  import MapDiv from '@/components/libs/tianditu/mapdiv'
  import esriLoader from 'esri-loader';
  import {mapmixin} from '@/mixin/map.js';
  export default {
  	components:{
  		Tianditu,MapDiv
    },
    //mixins:[mapmixin],
    methods:{
  	  mapload(map,view){
  	  	this.$refs.mapdiv.$data.map = map;
  	  	this.$refs.mapdiv.$data.view = view;
        //;
        const self = this;
        esriLoader.loadModules([
          'esri/layers/MapImageLayer',
          'esri/layers/FeatureLayer'
        ]).then(([MapImageLayer,FeatureLayer]) => {
          var PopInit = function(feature){
            console.log(feature);
            let fields = feature.graphic.sourceLayer.fields;
            let str = '';
            str+="<div style='margin-bottom:5px;border-bottom:1px solid #ddd;padding:5px 0'><b>名称：</b>:"+feature.graphic.attributes.name+"</div>";
            /*for(let key in feature.graphic.attributes){
              let fd = '';
              fields.forEach(function (f) {
                if(f.name==key){
                  fd = f.alias;
                }
              });
              str+="<div style='margin-bottom:5px;border-bottom:1px solid #ddd;padding:5px 0'><b>"+fd+"</b>:"+feature.graphic.attributes[key]+"</div>";
            }*/
            return str;
          }
          const query = this.$route.query;
          let sql1 = '1=1';
          let sql2 = '1=1';
          if(query && query.line){
          	sql1="RefName='"+query.line+"'";
          	sql2="roadline='"+query.line+"' OR roadline='S1/S2' ";
            if(query.line=='S2'){
            	view.center = [120.85264098177831,27.966624717480034];
            }
          }
          var layer_sl = new MapImageLayer({
            url: "https://services.wzmap.gov.cn/server/rest/services/JIOATONG/SHIYUTL/MapServer",
            sublayers: [
              {
                id: 1,
                visible: true,
                definitionExpression: sql1
              }, {
                id: 0,
                visible: true,
                definitionExpression: sql2
              }
            ]
          });
          map.add(layer_sl);
          //
          var l1 = new FeatureLayer("https://services.wzmap.gov.cn/server/rest/services/JIOATONG/SHIYUTL/MapServer/0",{
            outFields: ["*"],
            id:'shiyutielu',
            /*popupEnabled:true,
            popupTemplate: {
              overwriteActions: true,
              title: "{NAME}",
              content: PopInit,
            },*/renderer:{
              type: "simple",
              symbol:{
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                color: [255,255,255,0.01],
                size: "20px",
                outline:{
                  width:0
                }
              }
            }
          });
         /* var l2 = new FeatureLayer("https://services.wzmap.gov.cn/server/rest/services/JIOATONG/SHIYUTL/MapServer/1",{
            outFields: ["*"],
            id:'shiyutielu',
            popupEnabled:true,
            popupTemplate: {
              overwriteActions: true,
              title: "{NAME}",
              content: PopInit,
            },renderer:{
              type: "simple",
              symbol:{
                type: "simple-line", // autocasts as new SimpleLineSymbol()
                color: [255,255,255,0.01],
                width: "3px",
                style: "solid"
              }
            }
          });
          map.add(l2);*/
          map.add(l1);
        });
      },
      shiyutieluClick(graphic){
        this.$refs.mapdiv.searchInfo(graphic,false);
      }
    },
    mounted(){
      /*const wx = this.$wechat;
      Util.checkLog().then(function (response) {
        if(response.data.code==100){
          Util.ajax.post("/pubApi/auth/jsapk?url=" + encodeURIComponent(location.href)).then(function (data) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: Util.wxconfig.appid, // 必填，公众号的唯一标识
              timestamp: data.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
              signature: data.data.signature,// 必填，签名
              jsApiList: ['getLocation','openLocation','previewImage'] // 必填，需要使用的JS接口列表
            });
          });
        }else{
          Util.login();
        }
      });*/
    }
  }
</script>
