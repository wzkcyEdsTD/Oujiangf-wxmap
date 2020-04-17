<style lang="less">
  /*.esri-popup__feature-buttons{
    display: none !important;
  }
  .esri-ui-top-left.esri-ui-corner{
    display: none !important;
  }
  .esri-ui-manual-container > .esri-component {
    display: none;
  }*/
  .esri-zoom{
    display: none !important;
  }
  .esri-ui-corner{
    bottom:30% !important;
  }
  #map .esri-zoom{
    display: block !important;
    margin-right:-3px;
    margin-bottom: 0px;
    border-radius:5px;
    >div:nth-child(1){
      border-radius: 5px 5px 0 0;
    }
    >div:nth-child(2){
       border-radius: 0 0 5px 5px;
    }
  }
  .esri-widget--button{
    width:34px !important;
    height:34px !important;
  }
  .esri-popup__button.esri-popup__button--dock,.esri-ui .esri-attribution{
    display: none!important;
  }
  .esri-ui .esri-popup{
    z-index:500 !important;
  }
  /*.esri-navigation-toggle.esri-widget{
    margin-top:43px;
  }*/
</style>
<!--
 触发事件：
  mapload地图加载完毕
-->
<template>
  <div class="map" :id="mapid" >
    <div v-show="false" :style="{'display':hidetext?'none':'block'}" style="position:absolute;bottom:10px;right:10px;font-size:12px;color:#666;">
      <img src="@/images/logo.png" width="26" style="margin-right:3px;vertical-align:text-bottom;" >信用地图
    </div>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import {Pointx, Pointy, dojoConfig, ESRI_URL, ARCGIS_SERVICE_HOST, WZKCY_ServerConfig} from './config';
  import shineiData from '@/datas/shinei.json';
  import shineiSymbols from '@/datas/symbols.json';
  var louceng;
  export default {
    name: 'tianditu',
    props: ['centerx','centery','zoom','layerurl','mapid','loading','searchurl','isshinei','hidetext'],
    data(){
      return {
        tdtconfig:{},
        map: null,
        map2:null,//3D
        view: null,
        draw: null,
        //yingxiangLoad:false,//影像加载中
        appConfig:{
          mapView: null,
          sceneView: null,
          activeView: null
        },
        ishitTest:true,
        searchLayer:null,
        is3D:false,
        loucengLayer:null,
        loucengStyle:{},
        shineiData:{
          show:false,
          shangpuShow:false,//商铺显示
          name:'',
          loucengName:'',
          guid:'',
          url1:'',
          url2:'',
          louceng:[],
          zoom:0
        },
        tileInfo:{
        dpi: 96,
          rows: 256,
          cols: 256,
          compressionQuality: 0,
          origin: {
          x: -180,
            y: 90
        },
        spatialReference: {
          wkid: 4326
        },
        lods: [
          {"level" : 0, "resolution" :1.4062500262315807, "scale" : 5.90995197141669E8},
          {"level" : 1, "resolution" :0.703125013115789, "scale" : 2.95497598570834E8},
          {"level" : 2, "resolution" :0.3515625065578945, "scale" : 1.47748799285417E8},
          {"level" : 3, "resolution" :0.1757812532789475, "scale" : 7.38743996427086E7},
          {"level" : 4, "resolution" :0.08789062663947375, "scale" : 3.69371998213543E7},
          {"level" : 5, "resolution" :0.043945313319736994, "scale" : 1.84685999106772E7},
          {"level" : 6, "resolution" :0.021972656659868424, "scale" :9234299.95533857},
          {"level" : 7, "resolution" :0.010986328329934226, "scale" : 4617149.97766929},
          {"level" : 8, "resolution" :0.005493164164967101, "scale" : 2308574.98883464},
          {"level" : 9, "resolution" :0.0027465820824835504, "scale" : 1154287.49441732},
          {"level" : 10, "resolution" : 0.0013732910412417776, "scale" : 577143.747208661},
          {"level" : 11, "resolution" :6.866455206208876E-4, "scale" : 288571.87360433},
          {"level" : 12, "resolution" : 3.433227603104438E-4, "scale" :144285.936802165},
          {"level" : 13, "resolution" :1.7166138015522214E-4, "scale" : 72142.9684010826},
          {"level" : 14, "resolution" :8.583069007761107E-5, "scale" :36071.4842005413},
          {"level" : 15, "resolution" :4.291534503880566E-5, "scale" :18035.7421002707},
          {"level" : 16, "resolution" :2.145767251940278E-5, "scale" :9017.87105013533},
          {"level" : 17, "resolution" :1.0728836259701377E-5, "scale" :4508.93552506766},
          {"level" : 18, "resolution" :5.364418129850689E-6, "scale" :2254.46776253383},
          {"level" : 19, "resolution" :2.682209064925356E-6, "scale" :1127.23388126692},
          {"level" : 20, "resolution" :1.3411045324626732E-6, "scale" :563.616940633458}
        ]
      }
      }
    },
    watch: {
      is3D(val,oldVal){
        this.$emit('change2D3D',val);
      }
    },
    methods: {
      loadArcgis() { // 该方法用于加载 arcgis 依赖的js,css 等
        // 加载css
        esriLoader.loadCss("http://" + ESRI_URL + '/esri/css/main.css');
        //console.log(new Date().getTime());
        return esriLoader.loadScript({ // 加载js
          url: "http://" + ESRI_URL + '/init.js',
          dojoConfig: dojoConfig
        }).then(//dojo加载完成之后，载入tdt类
          () => this.initMap()
        ).catch(
          (err) => {
          	//console.log(err);
          	err=='Error: The ArcGIS API for JavaScript is already loaded.'?this.initMap():console.log(err)
          }
        );
      },
      //初始化
      initMap(){
        const self = this;
        //console.log(new Date().getTime());
        if(this.loading){
          this.$vux.loading.show('加载中');
        }
        esriLoader.loadModules([
          'esri/Map',
          'esri/views/MapView',
          /*'esri/layers/WebTileLayer',
           'esri/layers/support/TileInfo',*/
          "esri/config",
          "esri/layers/VectorTileLayer",
          "esri/layers/TileLayer",
          "esri/layers/FeatureLayer",
          'dojo/domReady!'
        ])
        .then(([Map, MapView,esriConfig,VectorTileLayer,TileLayer,FeatureLayer]) => {//, WebTileLayer, TileInfo
          //代理
          esriConfig.request.proxyUrl = "/proxy/proxy.ashx";
          //esriConfig.request.proxyUrl = "/proxy.jsp";

          // 创建地图，不设置底图，如果设置底图会造成坐标系无法被转换成 ESPG:4326 (WGS1984)
          var map = new Map({
            spatialReference: {
              wkid: 4326
            }
          });

          // 创建MapView
          var center = [120.681, 28.008];
          if(this.centerx && this.centerx!=NaN && this.centery && this.centery!=NaN){
          	center = [this.centerx,this.centery];
          }
          var zoom = 12;
          if(this.zoom){
          	zoom = this.zoom;
          }
          var view = new MapView({
            container: ""+self.mapid,
            spatialReference: {
              wkid: 4326
            },
            map: map,
            center: center,
            zoom: zoom,
            rotation:0
          });
          view.constraints = {
            minZoom: 7,
            maxZoom: 20,
            lods: [
              {"level" : 0, "resolution" :1.4062500262315807, "scale" : 5.90995197141669E8},
              {"level" : 1, "resolution" :0.703125013115789, "scale" : 2.95497598570834E8},
              {"level" : 2, "resolution" :0.3515625065578945, "scale" : 1.47748799285417E8},
              {"level" : 3, "resolution" :0.1757812532789475, "scale" : 7.38743996427086E7},
              {"level" : 4, "resolution" :0.08789062663947375, "scale" : 3.69371998213543E7},
              {"level" : 5, "resolution" :0.043945313319736994, "scale" : 1.84685999106772E7},
              {"level" : 6, "resolution" :0.021972656659868424, "scale" :9234299.95533857},
              {"level" : 7, "resolution" :0.010986328329934226, "scale" : 4617149.97766929},
              {"level" : 8, "resolution" :0.005493164164967101, "scale" : 2308574.98883464},
              {"level" : 9, "resolution" :0.0027465820824835504, "scale" : 1154287.49441732},
              {"level" : 10, "resolution" : 0.0013732910412417776, "scale" : 577143.747208661},
              {"level" : 11, "resolution" :6.866455206208876E-4, "scale" : 288571.87360433},
              {"level" : 12, "resolution" : 3.433227603104438E-4, "scale" :144285.936802165},
              {"level" : 13, "resolution" :1.7166138015522214E-4, "scale" : 72142.9684010826},
              {"level" : 14, "resolution" :8.583069007761107E-5, "scale" :36071.4842005413},
              {"level" : 15, "resolution" :4.291534503880566E-5, "scale" :18035.7421002707},
              {"level" : 16, "resolution" :2.145767251940278E-5, "scale" :9017.87105013533},
              {"level" : 17, "resolution" :1.0728836259701377E-5, "scale" :4508.93552506766},
              {"level" : 18, "resolution" :5.364418129850689E-6, "scale" :2254.46776253383},
              {"level" : 19, "resolution" :2.682209064925356E-6, "scale" :1127.23388126692},
              {"level" : 20, "resolution" :1.3411045324626732E-6, "scale" :563.616940633458}
            ],
            rotationEnabled: false//禁止旋转
          };

          view.ui.move(["zoom"], "bottom-right");

          self.$set(self.$data,'map',map);
          self.$set(self.$data,'view',view);

          //console.log(new Date().getTime());
          if(this.loading){
            this.$vux.loading.hide();
          }

          //点击图层
          if(this.searchurl){
            var searchLayer = new FeatureLayer({
              url: this.searchurl,
              objectIdField: "OBJECTID",
              outFields: ["*"],
              mode: FeatureLayer.MODE_SNAPSHOT
            });
            this.searchLayer = searchLayer;
          }

        //点击
          var highlight;
          view.on("click",function(event){
            //console.log(event);
            if(!self.ishitTest){
            	return;
            }
            view.highlightOptions.color = '#00ff0ff';
            view.highlightOptions.fillOpacity = 0.25;
            view.highlightOptions.haloOpacity = 1;
            view.hitTest(event).then(function(response){
              if(response.results[0]){
                var graphic = response.results[0].graphic;
                var gid = graphic.layer.id;
                if(/meizhouyitu.*/.test(gid)){
            	    gid = "meizhouyitu"
                }
                switch(gid){
                  case 'searchInfo'://POI
                    self.$emit('searchInfoClick');
                  	break;
                  case 'zhuantilayer'://专题
                    if(graphic.attributes.FEATUREGUID || graphic.attributes.iszhuanti){
                  	  console.log('zhuantiClick');
                      self.$emit('shineiClick',graphic);
                    }
                    if(graphic.geometry.rings || graphic.geometry.paths){
                      view.whenLayerView(graphic.layer).then(function(lyrView){
                        if(lyrView.layer.url=='https://services.wzmap.gov.cn/server/rest/services/TDT/JCQ/MapServer'){
                          view.highlightOptions.color = "#4D74FF";
                        }
                        if(highlight){
                          highlight.remove();
                        }
                        highlight = lyrView.highlight(graphic);//高亮
                      });
                    }
                    break;
                  case 'cehui'://测绘
                  	self.$emit('cehuiClick',graphic);
                    view.whenLayerView(graphic.layer).then(function(lyrView){
                      if(highlight){
                        highlight.remove();
                      }
                      highlight = lyrView.highlight(graphic);//高亮
                    });
                  	break;
                  case 'shangpu'://室内地图
                    self.$emit('shineiClick',graphic);
                    break;
                  case 'louceng':
                  	console.log('louceng点击');
                    if(self.searchLayer){
                      var queryParams = self.searchLayer.createQuery();
                      var zoom=view.zoom;
                      const x = event.mapPoint.x;
                      const y = event.mapPoint.y;
                      queryParams.geometry = view.toMap(event);
                      queryParams.spatialRelationship = "intersects";
                      //AND FLOOR='' AND FSCALE <= +(zoom)
                      queryParams.where = " NAME IS NOT NULL AND FLOOR='"+(self.shineiData.loucengName || 'L1')+"'";
                      function czoom(val) {
                        let res = 1;
                        for(let i=1;i<val;i++){
                          res = res*2;
                        }
                        return res;
                      }
                      queryParams.distance=czoom(20-zoom)*5;
                      self.searchLayer.queryFeatures(queryParams).then(function(results){
                        if(results.features.length){
                          results.features.sort(function (a,b) {
                            return (a.geometry.x-x)*(a.geometry.x-x)+(a.geometry.y-y)*(a.geometry.y-y) -
                              (b.geometry.x-x)*(b.geometry.x-x)-(b.geometry.y-y)*(b.geometry.y-y)
                          });
                          self.$emit('shineiClick2',results.features[0]);
                        }
                      });
                    }
                    break;
                  case 'quanjing'://全景
                    self.$emit('quanjingClick',graphic);
                    break;
                  case 'nongyeLayer'://农业
                    console.log('农业');
                  	self.$emit('nongyeClick',graphic);
                    break;
                  case 'ptss'://配套设施
                    self.$emit('ptssClick',graphic);
                    break;
                  case 'meizhouyitu'://每周
                    self.$emit('meizhouClick',graphic);
                    break;
                  case 'xuequ1'://
                    view.whenLayerView(graphic.layer).then(function(lyrView){
                      /*view.highlightOptions.color = '#ff0000';
                       view.highlightOptions.fillOpacity = 0;
                       view.highlightOptions.haloOpacity = 1;
                      if(highlight){
                        highlight.remove();
                      }
                      highlight = lyrView.highlight(graphic);*///高亮
                    });
                    self.$emit('xuequ2Click',graphic);
                    break;
                  case 'shiyutielu'://市域铁路
                    self.$emit('shiyutieluClick',graphic);
                    /*view.whenLayerView(graphic.layer).then(function(lyrView){
                      if(highlight){
                        highlight.remove();
                      }
                      highlight = lyrView.highlight(graphic);//高亮
                    });*/
                    break;
                  case 'shiliang':
                    if(self.searchLayer){
                      var queryParams = self.searchLayer.createQuery();
                      var zoom=view.zoom;
                      const x = event.mapPoint.x;
                      const y = event.mapPoint.y;
                      queryParams.geometry = view.toMap(event);
                      queryParams.spatialRelationship = "intersects";
                      let prefix = '';
                      if(self.searchurl=='https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6'){
                      	prefix = 'tdt.DBO.农业旅游.';
					  }
                      queryParams.where = prefix+"NAME IS NOT NULL AND FSCALE <= "+(zoom);
                      function czoom(val) {
                        let res = 1;
                        for(let i=1;i<val;i++){
                        	res = res*2;
                        }
                        return res;
                      }
                      queryParams.distance=czoom(20-zoom)*5;
                      self.searchLayer.queryFeatures(queryParams).then(function(results){
                        if(results.features.length){
                          results.features.sort(function (a,b) {
                            return (a.geometry.x-x)*(a.geometry.x-x)+(a.geometry.y-y)*(a.geometry.y-y) -
                              (b.geometry.x-x)*(b.geometry.x-x)-(b.geometry.y-y)*(b.geometry.y-y)
                          });
							results.features[0].attributes = JSON.parse(JSON.stringify(results.features[0].attributes)
							.replace(/tdt\.DBO\.农业旅游\./gi,''));
                        	self.$emit('shineiClick',results.features[0]);
                        }
                      });
                    }
                  	break;
                }
              }
            })
          });

          view.on('double-click',function(e){
            e.stopPropagation();
          });

          /*view.watch('extent',function (e) {
            console.log(e);
          });*/

          if(self.isshinei){
          	//
            view.constraints.minZoom=17;
            self.$emit("mapload",map,view);
          	return;
          }

        var url = "https://services.wzmap.gov.cn/server/rest/services/Hosted/JCB/VectorTileServer";
        if(this.layerurl){
          url = this.layerurl;
          var layer = new VectorTileLayer({
            url: url,
            id:"shiliang"
          });
          //加载完
          layer.on('layerview-create',function (e) {
            console.log(e);
            self.$emit("mapload",map,e.view);
          });
          map.add(layer);
        }else{
          var layer_sl = new VectorTileLayer({
            url: self.tdtconfig.biaozhu,//"http://services.wzmap.gov.cn/server/rest/services/Hosted/0111_test/VectorTileServer",
            //url:"http://services.wzmap.gov.cn/server/rest/services/Hosted/JCB_PL/VectorTileServer",
            id:"shiliang",
          });
          var layer_s2 = new TileLayer({
            url: self.tdtconfig.ditu,//"https://services.wzmap.gov.cn/server/rest/services/TDT/JCB_PYL/MapServer",
            //url:"https://services.wzmap.gov.cn/server/rest/services/TDT/JCB_PY/MapServer",
            id:"shiliang2",
          });
          //加载完
          layer_s2.on('layerview-create',function (e) {
            self.$emit("mapload",map,e.view);
          });
          map.add(layer_s2);
          map.add(layer_sl);
        }

        });
      },
      //
      resetMap(callback){
        const self = this;
        if(self.is3D){
          this.change2D();
        }
        esriLoader.loadModules([
          "esri/layers/VectorTileLayer",
          "esri/layers/TileLayer"
        ])
        .then(([VectorTileLayer,TileLayer]) => {
          // var layer = VectorTileLayer({
          //   url: 'http://services.wzmap.gov.cn/server/rest/services/Hosted/JCB/VectorTileServer',
          //   id:'shiliang'
          // });
          // var layer_sl = new VectorTileLayer({
          //   url: self.tdtconfig.biaozhu,//"http://services.wzmap.gov.cn/server/rest/services/Hosted/JCB_PL/VectorTileServer",
          //   id:"shiliang",
          // });

          // resetMap重置为简约风 服务地址
          var layer_jy = VectorTileLayer({
            url: 'http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer',
            id:'shiliang'
          });
          var layer_s2 = new TileLayer({
            url: self.tdtconfig.ditu,//"https://services.wzmap.gov.cn/server/rest/services/TDT/JCB_PY/MapServer",
            id:"shiliang2",
          });
          if(self.view.zoom<7){
            self.view.zoom = 7;
          }
          self.view.constraints.minZoom = 7;
          self.view.constraints.maxZoom = 20;
          self.removeAll();
          self.map.add(layer_s2,0);
          // self.map.add(layer_sl,1);
          // self.map.add(layer);
          self.map.add(layer_jy,1);
          if(callback){
          	callback();
          }
        });
      },
      //3D
      threeDMap(){
        const self = this;
        esriLoader.loadModules([
          "esri/layers/SceneLayer",
          'esri/Map',
          'esri/layers/VectorTileLayer',
          "esri/views/SceneView",
          "esri/views/MapView"
        ])
        .then(([SceneLayer,Map,VectorTileLayer,SceneView,MapView]) => {

          let appConfig = self.appConfig;

          var dsjLayer = new VectorTileLayer({
            url: self.tdtconfig['3dditu']//"http://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ_1/VectorTileServer"
          });

          var initialViewParams = {
            zoom: self.view.zoom,
            center: self.view.center,
            container: appConfig.container,
            camera: {
              position: [self.view.center.x, self.view.center.y, 900],
              tilt: 60,
              heading: 0
            }
          };


          var map2 = new Map({
            layers:[dsjLayer]
            // basemap: "streets"
          });

          var sceneLayer = new SceneLayer({
            url:self.tdtconfig['3d'],//"http://services.wzmap.gov.cn/server/rest/services/Hosted/RES_PY_200/SceneServer",
            //url:"http://services.wzmap.gov.cn/server/rest/services/Hosted/lu_100_1_wgs84_2/SceneServer",
            visible:self.view.zoom>=15?true:false
          });
          map2.add(sceneLayer);

          var symbol = {
            type: "mesh-3d", // autocasts as new MeshSymbol3D()
            symbolLayers: [{
              type: "fill", // autocasts as new FillSymbol3DLayer()
              // If the value of material is not assigned, the default color will be grey
              material: {
                color: [225,225, 223,0.82]
              }
            }]
          };
          // Add the renderer to sceneLayer
          sceneLayer.renderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: symbol
          };

          // create 2D view and and set active
          appConfig.mapView = self.view;
          appConfig.mapView.map = self.map;
          //console.log(self.view);
          //console.log(self.map);
          appConfig.activeView = appConfig.mapView;

          // create 3D view, won't initialize until container is set
          initialViewParams.container = null;
          initialViewParams.map = map2;
          appConfig.sceneView = new SceneView(initialViewParams);
          appConfig.sceneView.watch("zoom", function(event){
          	if(appConfig.sceneView.zoom>=15 && !sceneLayer.visible){
              sceneLayer.visible = true;
            }else if(appConfig.sceneView.zoom<15 && sceneLayer.visible){
              sceneLayer.visible = false;
            }
          });
          self.$set(self.$data,'map2',map2);
          appConfig.activeView.container = null;
          if(self.is3D){
            //console.log(appConfig.activeView.viewpoint);
            //appConfig.mapView.viewpoint = appConfig.activeView.viewpoint.clone();
            appConfig.mapView.container = appConfig.container;
            appConfig.activeView = appConfig.mapView;
            self.is3D = false;
          }else{
            //console.log(appConfig.activeView);
            //appConfig.sceneView.viewpoint = appConfig.activeView.viewpoint.clone();
            appConfig.sceneView.container = appConfig.container;
            appConfig.activeView = appConfig.sceneView;
            self.is3D = true;
          }
        });
      },
      //3D改为2D
      change2D(){
        this.threeDMap();
        /*let appConfig = this.appConfig;
         console.log(JSON.stringify(appConfig));
         /!*appConfig.mapView = this.view;
         appConfig.mapView.map = this.map;
         appConfig.activeView = appConfig.mapView;
         appConfig.activeView = this.view;*!/
         appConfig.activeView.container = null;
         appConfig.mapView.container = appConfig.container;
         appConfig.activeView = appConfig.mapView;
         this.is3D = false;*/
      },
      removeAll(){
      	const map = this.map;
      	if(map.findLayerById('shiliang')!=null){
      		map.remove(map.findLayerById('shiliang'));
        }
        if(map.findLayerById('shiliang2')!=null){
          map.remove(map.findLayerById('shiliang2'));
        }
        if(map.findLayerById('yingxiang1')!=null){
          map.remove(map.findLayerById('yingxiang1'));
        }
        if(map.findLayerById('yingxiang2')!=null){
          map.remove(map.findLayerById('yingxiang2'));
        }
        if(map.findLayerById('fangzhen')!=null){
          map.remove(map.findLayerById('fangzhen'));
        }
        if(map.findLayerById('history')!=null){
          map.remove(map.findLayerById('history'));
        }

      },
      //专题地图
      zhuantiMap(name,notwait){
        const self = this;
        /*if(self.view.updating && !notwait){
        	self.$vux.toast.text('请等待上一个底图加载完毕再切换');
        	return;
        }*/
        if(self.is3D){
          this.change2D();
        }
        self.removeAll();
        self.view.constraints.minZoom = 0;
        self.view.constraints.maxZoom = 20;
        esriLoader.loadModules([
          "esri/layers/VectorTileLayer"
        ])
        .then(([VectorTileLayer]) => {
          let url = '';
          if(name=='行政区划'){
            url = self.tdtconfig.xzqh;//'http://services.wzmap.gov.cn/server/rest/services/Hosted/XZQH/VectorTileServer';
          }else if(name=='大数据'){
            url = self.tdtconfig.dsj;//'http://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer';
          }else if(name=='园林绿化'){
            url = self.tdtconfig.yl;//'http://services.wzmap.gov.cn/server/rest/services/Hosted/YL/VectorTileServer';
          }else if(name=='农业旅游'){
            url = self.tdtconfig.ny;//'http://services.wzmap.gov.cn/server/rest/services/Hosted/NYLY/VectorTileServer';
          }else if(name=='简约版'){
          	url = self.tdtconfig.jyb;//'http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer';
          }else if(name=='建成区'){
			  url = 'https://services.wzmap.gov.cn/server/rest/services/Hosted/JCQ/VectorTileServer';
		  }
          var layer = VectorTileLayer({
            url: url,
            id:'shiliang'
          });
          self.map.add(layer,0);
        });
      },
      //影像地图
      yingxiangMap(notwait,hideBiaozhu){
        const self = this;
        /*if(self.view.updating && !notwait){
          self.$vux.toast.text('请等待上一个底图加载完毕再切换');
          return;
        }*/
        if(self.is3D){
          this.change2D();
        }
        //self.$vux.loading.show('影像加载中');
        //alert('123123');
        //self.yingxiangLoad = true;
        let load1 = false;
        let load2 = false;
        if(self.view.zoom<7){
          self.view.zoom = 7;
        }
        self.view.constraints.minZoom = 7;
        self.view.constraints.maxZoom = 20;
        esriLoader.loadModules([
          'esri/layers/TileLayer',
          'esri/layers/VectorTileLayer',
          'esri/layers/WebTileLayer',
          'esri/layers/support/TileInfo'
        ])
        .then(([TileLayer,VectorTileLayer,WebTileLayer,TileInfo]) => {

          var ditu = new TileLayer({
            url: "https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2018/MapServer",//"https://services.wzmap.gov.cn/server/rest/services/TDT/YX2017/MapServer",//https://portal.wzdmdz.com/server/rest/services/tdt_test/yx0920/MapServer
            id:'yingxiang1'
          });
          if(!hideBiaozhu){
			  var biaozhu  = new VectorTileLayer({
				  url:self.tdtconfig.yingxiangbiaozhu,//"http://services.wzmap.gov.cn/server/rest/services/Hosted/YXZJ/VectorTileServer",
				  id:'yingxiang2'
			  });
		  }
          //https://portal.wzdmdz.com/server/rest/services/tdt_test/yxbz0920/MapServer
          self.removeAll();
          /*ditu.on('layerview-create',function (e) {
            load1 = true;
            if(load1 && load2){
            	setTimeout(function () {
                self.$vux.loading.hide();
              },5000);
            }
          });
          biaozhu.on('layerview-create',function (e) {
            load2 = true;
            if(load1 && load2){
              setTimeout(function () {
                self.$vux.loading.hide();
              },5000);
            }
          });*/
          self.map.add(ditu,0);
          if(!hideBiaozhu){
			  self.map.add(biaozhu,1);
		  }
        });
      },
      //仿真图
      fangzhenMap(){
        const self = this;
        /*if(self.view.updating){
          self.$vux.toast.text('请等待上一个底图加载完毕再切换');
          return;
        }*/
        if(self.is3D){
          this.change2D();
        }
        if(self.view.zoom<7){
          self.view.zoom = 7;
        }
        self.view.constraints.minZoom = 7;
        self.view.constraints.maxZoom = 20;
        esriLoader.loadModules([
          'esri/layers/WebTileLayer',
          'esri/layers/support/TileInfo',
        ])
        .then(([WebTileLayer,TileInfo]) => {


          var tileInfo = new TileInfo({
            dpi: 96,
            rows: 256,
            cols: 256,
            compressionQuality: 0,
            origin: {
              x: -180,
              y: 90
            },
            spatialReference: {
              wkid: 4326
            },
            lods: [
              {"level": 0, "resolution": 1.406249999978297, "scale": 591658710.90},
              {"level": 1, "resolution": 0.7031249999891486, "scale": 295829355.45},
              {"level": 2, "resolution": 0.3515624999945743, "scale": 147914677.73},
              {"level": 3, "resolution": 0.1757812499972872, "scale": 73957338.86},
              {"level": 4, "resolution": 0.0878906249986436, "scale": 36978669.43},
              {"level": 5, "resolution": 0.0439453124993218, "scale": 18489334.72},
              {"level": 6, "resolution": 0.0219726562496609, "scale": 9244667.36},
              {"level": 7, "resolution": 0.0109863281248304, "scale": 4622333.68},
              {"level": 8, "resolution": 0.0054931640624152, "scale": 2311166.84},
              {"level": 9, "resolution": 0.0027465820312076, "scale": 1155583.42},
              {"level": 10, "resolution": 0.0013732910156038, "scale": 577791.71},
              {"level": 11, "resolution": 0.0006866455078019029, "scale": 288895.85},
              {"level": 12, "resolution": 0.0003433227539009515, "scale": 144447.93},
              {"level": 13, "resolution": 0.0001716613769504757, "scale": 72223.96},
              {"level": 14, "resolution": 8.583068847523787e-005, "scale": 36111.98},
              {"level": 15, "resolution": 4.291534423761893e-005, "scale": 18055.99},
              {"level": 16, "resolution": 2.145767211880947e-005, "scale": 9028.00},
              {"level": 17, "resolution": 1.072883605940473e-005, "scale": 4514.00},
              {"level": 18, "resolution": 5.3644180297860626e-006, "scale": 2254.4677204803465},
              {"level": 19, "resolution": 2.6822090148930313e-006, "scale": 1127.2338602401733},
              {"level": 20, "resolution": 1.3411045074465156e-006, "scale": 563.61693012008664}
            ]
          })
          var ditu = new WebTileLayer(
            self.tdtconfig.fangzhen//"http://www.go577.com/iserver/services/3dmap/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=3dmap&STYLE=default&TILEMATRIXSET=custom_3dmap&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image%2Fpng"
            ,{
              tileInfo: tileInfo,
              id:'fangzhen'
            });

          self.removeAll();
          self.map.add(ditu,0);
        });
      },
      //历史影像
      historyMap(year){
        const self = this;
        /*if(self.view.updating){
          self.$vux.toast.text('请等待上一个底图加载完毕再切换');
          return;
        }*/
        if(self.is3D){
          this.change2D();
        }
        if(self.view.zoom>18){
          self.view.zoom = 18;
        }
        if(self.view.zoom<10){
        	self.view.zoom = 10;
        }
        self.view.constraints.minZoom = 10;
        self.view.constraints.maxZoom = 18;
        esriLoader.loadModules([
          'esri/layers/WebTileLayer',
          'esri/layers/TileLayer',
          'esri/layers/support/TileInfo',
          "esri/config",
        ])
        .then(([WebTileLayer,TileLayer, TileInfo,esriConfig]) => {

          //esriConfig.request.proxyUrl = "http://tdt.wzmap.gov.cn/proxy/proxy.ashx";

          var tileInfo = new TileInfo({
            dpi: 96,
            rows: 256,
            cols: 256,
            compressionQuality: 0,
            origin: {
              x: -180,
              y: 90
            },
            spatialReference: {
              wkid: 4326
            },
            lods: [
				{"level": 0, "resolution": 1.406249999978297, "scale": 591658710.90},
				{"level": 1, "resolution": 0.7031249999891486, "scale": 295829355.45},
				{"level": 2, "resolution": 0.3515624999945743, "scale": 147914677.73},
				{"level": 3, "resolution": 0.1757812499972872, "scale": 73957338.86},
				{"level": 4, "resolution": 0.0878906249986436, "scale": 36978669.43},
				{"level": 5, "resolution": 0.0439453124993218, "scale": 18489334.72},
				{"level": 6, "resolution": 0.0219726562496609, "scale": 9244667.36},
				{"level": 7, "resolution": 0.0109863281248304, "scale": 4622333.68},
				{"level": 8, "resolution": 0.0054931640624152, "scale": 2311166.84},
				{"level": 9, "resolution": 0.0027465820312076, "scale": 1155583.42},
				{"level": 10, "resolution": 0.0013732910156038, "scale": 577791.71},
				{"level": 11, "resolution": 0.0006866455078019029, "scale": 288895.85},
				{"level": 12, "resolution": 0.0003433227539009515, "scale": 144447.93},
				{"level": 13, "resolution": 0.0001716613769504757, "scale": 72223.96},
				{"level": 14, "resolution": 8.583068847523787e-005, "scale": 36111.98},
				{"level": 15, "resolution": 4.291534423761893e-005, "scale": 18055.99},
				{"level": 16, "resolution": 2.145767211880947e-005, "scale": 9028.00},
				{"level": 17, "resolution": 1.072883605940473e-005, "scale": 4514.00},
				{"level": 18, "resolution": 5.3644180297860626e-006, "scale": 2254.4677204803465},
				{"level": 19, "resolution": 2.682209064925356E-6, "scale": 1127.23388126692},
				{"level": 20, "resolution": 1.3411045324626732E-6, "scale": 563.616940633458}
            ]
          })
          //年代
          if (year == 60) {
            if(self.view.zoom>16){
              self.view.zoom = 16;
            }
            self.view.constraints.maxZoom = 16;
            var layer = WebTileLayer(
              self.tdtconfig.his60//'https://ditu.zj.cn/services/wmts/imgmap_60s?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=imgmap_60s&STYLE=default&TILEMATRIXSET=esritilematirx&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image/jpgpng'
              , {
              tileInfo: tileInfo,
              id:'history'
            });
            self.removeAll();
            self.map.add(layer,0);
          } else if (year == 70) {
            if(self.view.zoom>16){
              self.view.zoom = 16;
            }
            self.view.constraints.maxZoom = 16;
            var layer = WebTileLayer(
              self.tdtconfig.his70//'https://ditu.zj.cn/services/wmts/imgmap_70s?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=imgmap_70s&STYLE=default&TILEMATRIXSET=esritilematirx&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image/jpgpng'
              , {
              tileInfo: tileInfo,
              id:'history'
            });
            self.removeAll();
            self.map.add(layer,0);
          } else if (year == 2000) {
            if(self.view.zoom>16){
              self.view.zoom = 16;
            }
            self.view.constraints.maxZoom = 16;
            var layer = WebTileLayer(
              self.tdtconfig.his2000//'https://ditu.zj.cn/services/wmts/imgmap_ls1998-2003?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=imgmap_ls1998-2003&STYLE=default&TILEMATRIXSET=esritilematirx&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image/jpgpng'
              , {
              tileInfo: tileInfo,
              id:'history'
            });
            self.removeAll();
            self.map.add(layer,0);
          } else if (year == 2005) {
            var layer2005 = WebTileLayer(
              self.tdtconfig.his2005//	'http://218.75.26.62/iserver/services/wzimg2005/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=wzimg2005&STYLE=default&TILEMATRIXSET=Custom_wzimg2005&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image%2Fpng'
              , {
              tileInfo: tileInfo,
              id:'history'
            });
            self.removeAll();
            self.map.add(layer2005,0);
          } else if (year == 2012) {
            var layer2012 = WebTileLayer(
              self.tdtconfig.his2012//'http://218.75.26.62/iserver/services/wzimg2012/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=wzimg2012&STYLE=default&TILEMATRIXSET=Custom_wzimg2012&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image%2Fpng'
              , {
              tileInfo: tileInfo,
              id:'history'
            });
            self.removeAll();
            self.map.add(layer2012,0);
          } else if (year == 2017){
			  var ditu = new TileLayer({
				  url: "https://services.wzmap.gov.cn/server/rest/services/TDT/YX2017/MapServer",
				  id:'history'
			  });
			  self.removeAll();
			  self.map.add(ditu,0);
		  }else if(year == 2018){
			  var ditu = new TileLayer({
				  url: "https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2018/MapServer",
				  id:'history'
			  });
			  self.removeAll();
			  self.map.add(ditu,0);
		  } else if(year==2014) {
            var layer2014 = WebTileLayer(
              self.tdtconfig.his2014//'http://61.175.211.102/arcgis/rest/services/cgcs2000tmbxh/wzimg20142015/MapServer/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cgcs2000tmbxh_wzimg20142015&STYLE=default&TILEMATRIXSET=default028mm&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image%2Fjpgpng'
              ,{
              tileInfo: tileInfo,
              id:'history'
            });
            self.removeAll();
            self.map.add(layer2014,0);
          }
        });
      },
		yingxiang2018(){
			let url = 'https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2018/MapServer';
			const self = this;
			if(self.is3D){
				this.change2D();
			}
			self.view.constraints.minZoom = 7;
			self.view.constraints.maxZoom = 20;
			esriLoader.loadModules([
				'esri/layers/TileLayer',
				'esri/layers/VectorTileLayer',
				"esri/layers/WebTileLayer",
				'esri/layers/support/TileInfo',
				'dojo/domReady!'
			])
			.then(([TileLayer,VectorTileLayer,WebTileLayer,TileInfo]) => {
				var ditu = new TileLayer({
					url: url,
					id:'history'
				});
				self.removeAll();
				self.map.add(ditu,0);
			});
		},
      shangpu(name,zoom){
      	const self = this;
      	const map = self.map;
        esriLoader.loadModules([
          'esri/layers/FeatureLayer'
        ])
        .then(([FeatureLayer]) => {
        	//
          //console.log(shineiSymbols);
          var shangpuRenderer = {
            type: "unique-value",  // autocasts as new UniqueValueRenderer()
            field: "TYPE",
            valueExpression: "IIF($feature.SHOWICON == 1, $feature.TYPE, 'none')",
            defaultSymbol: {
              type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
              url: "/室内地图图标/default.png",
              width: "20px",
              height: "20px"
            },
            //defaultSymbol: { type: "picture-marker" },  // autocasts as new SimpleFillSymbol()
            uniqueValueInfos: shineiSymbols
          };
          //
          const labelClass = { // autocasts as new LabelClass()
            symbol: {
              type: "text", // autocasts as new TextSymbol()
              color: "green",
              haloColor: "black",
              font: { // autocast as new Font()
                //family: "微软雅黑",
                size: 8,
                weight: "bold"
              }
            },
            //labelPlacement: "above-center",
            labelExpressionInfo: {
              expression: "IIF($feature.SHOWTEXT == 1, $feature.NAME,'')"
            }
          };
          //商铺
          if(map.findLayerById('shangpu')!=null){
            map.remove(map.findLayerById('shangpu'));
          }//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/SNDT_POI/MapServer/0"
          var shangpuLayer = new FeatureLayer(self.tdtconfig.shinei,{
            outFields: ["*"],
            id:'shangpu',
            renderer:shangpuRenderer,
            labelingInfo: [labelClass],
            definitionExpression:"GUID='"+self.shineiData.guid+"' AND FLOOR='"+name+"' " //AND FSCALE<="+zoom
          });
          map.add(shangpuLayer);
          self.shineiData.zoom = zoom;
        });
      },
      //楼层切换
      louceng(url1,url2,name){
        const self = this;
        self.$vux.loading.show();
        let map = this.map;
        var url = self.tdtconfig.louceng//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX/MapServer/";
        esriLoader.loadModules([
          'esri/layers/FeatureLayer'
        ])
        .then(([FeatureLayer]) => {//FeatureLayer
          //楼层范围
          if(map.findLayerById('loucengfanwei')!=null){
            map.remove(map.findLayerById('loucengfanwei'));
          }
          var loucengfanweiLayer = new FeatureLayer(url+url2,{
              outFields: ["*"],
              id:'loucengfanwei',
            });/*new MapImageLayer({
           url:url+url2,
           id:'loucengfanwei',
           });*/
          map.add(loucengfanweiLayer);
          //楼层
          if(map.findLayerById('louceng')!=null){
            map.remove(map.findLayerById('louceng'));
          }
          let loucengLayer = new FeatureLayer(url+url1,{
            outFields: ["*"],
            id:'louceng',
          });
          /*
           new MapImageLayer({
            url:url+url1,
            id:'louceng',
          });
           */
          map.add(loucengLayer);
          //商铺
          self.shineiData.loucengName = name;
          self.shangpu(name,self.view.zoom);
          /**/
          self.$vux.loading.hide();
        });
      },
      louceng2(url1,url2,name){
      	//loucengLayer loucengStyle
      	console.log(name);
      	var layerlist = new Array();
      	var oldStyle = JSON.parse(this.loucengStyle);
        var layercount = oldStyle.layers.length;
        var reg = new RegExp('^(范围面/0|FWM|'+name+'/).*');//范围面正则
        for (var i = 0; i <layercount; i++) {
        	reg.lastIndex = -1;
          if(reg.test(oldStyle.layers[i].id)){
            //layerlist.push(i);
            layerlist.push(oldStyle.layers[i]);
          }
        }
        /*
        function sortNumber(a,b){
          return a - b
        }
        console.log(layerlist);
        layerlist.sort(sortNumber);
        console.log(layerlist);
        */
        /*for (var a = 0 ; a < layerlist.length; a++ ) {
          var id = layerlist[a] - a;
          oldStyle.layers.splice(id, 1);
        }*/
        //console.log(oldStyle.layers.length);
        oldStyle.layers = layerlist;
        louceng.loadStyle(oldStyle);
        this.shineiData.loucengName = name;
      },
      shinei2(map,view){
        const self = this;
        esriLoader.loadModules([
          'esri/layers/FeatureLayer',
          'esri/tasks/support/Query',
          "esri/tasks/QueryTask",
          "esri/layers/MapImageLayer",
          "esri/layers/VectorTileLayer"
        ])
        .then(([FeatureLayer,Query,QueryTask,MapImageLayer,VectorTileLayer]) => {
          var url = "https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX_FWM/MapServer/0";//范围面
          //加载时
          setTimeout(function () {
            self.shineiLoad2(Query,QueryTask,FeatureLayer,url,MapImageLayer,VectorTileLayer);
          },100);
          //商铺
        });
      },
      shineiLoad2(Query,QueryTask,FeatureLayer,url,MapImageLayer,VectorTileLayer){
        const self = this;
        url = self.tdtconfig.shinei//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/SNDT_POI/MapServer/0";
        var url2 = self.tdtconfig.louceng//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX/MapServer/";//楼层
        var url2a = '';
        var url4 = self.tdtconfig.louceng//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX/MapServer/";//楼层
        var url4a = '';
        var loucengLayer = null;
        var loucengfanweiLayer = null;
        var loucengfanweiLayer2 = null;
        var shangpuLayer = null;
        const view = self.view;
        const map = self.map;
        if(view.zoom>15){
          //查询
          var queryTask = new QueryTask({
            url: url
          });
          var q = new Query();
          q.geometry = view.extent;
          q.start = 0;
          q.outFields = ["*"];
          q.num = 1;
          q.where = " GUID IS NOT NULL ";
          console.log('extent');
          console.log(view.extent);
          queryTask.execute(q).then(function(results){
          	if(results.features.length==0){
              results.features = [{attributes:''}];
            }
            if(results.features.length>0){
              //当前所在变
              if(self.shineiData.guid!=results.features[0].attributes.GUID || !results.features[0].attributes.GUID){
                shineiData.forEach(function (item) {
                	console.log(results.features[0]);
                	console.log(item);
                  if(item.guid==results.features[0].attributes.GUID || (!results.features[0].attributes.GUID && item.name=='市民中心')){
                  	console.log('title'+item.name);
                    Util.title(item.name);
                    item.louceng.forEach(function(lc){
                      if(lc.name=='L1'){
                        url2a = lc.url1;
                        url4a = lc.url2;
                        self.shineiData.loucengName = lc.name;
                        //楼层
                        if(map.findLayerById('louceng')!=null){
                          map.remove(map.findLayerById('louceng'));
                        }
                        louceng = new VectorTileLayer({
                        	id:"louceng",
                          url:item.url+"/resources/styles/root.json"
                        });
                        map.add(louceng);
                        var style, styleJSON;
                        louceng.when(function () {
                          console.log('style');
                          style = louceng.currentStyleInfo.style;
                          style.glyphs = item.url+"/resources/fonts/{fontstack}/{range}.pbf";
                          style.sprite = item.url+"/resources/sprites/sprite";
                          style.sources.esri.url=item.url;
                          self.$set(self.$data,'loucengStyle',JSON.stringify(style));
                          console.log(style);
                          self.louceng2('','','L1');
                        });
                        self.shineiData.name = item.name;
                        self.shineiData.guid = item.guid;
                        self.shineiData.show = true;
                        self.$set(self.shineiData,'louceng',item.louceng);
                        self.$emit('shineiLoad',item.louceng,item.name);
                      }
                    });
                  }
                });
              }
              //缩放切换商铺
              self.shineiData.zoom = view.zoom;
            }
          });
        }else{
          if(self.shineiData.show){
            //shineiLayer.visible = false; loucengfanwei
            if(map.findLayerById('loucengfanwei')!=null){
              map.remove(map.findLayerById('loucengfanwei'));
            }
            if(map.findLayerById('loucengfanwei2')!=null){
              map.remove(map.findLayerById('loucengfanwei2'));
            }
            if(map.findLayerById('louceng')!=null){
              map.remove(map.findLayerById('louceng'));
            }
            if(map.findLayerById('shangpu')!=null){
              map.remove(map.findLayerById('shangpu'));
            }
            self.shineiData.show=false;
            self.shineiData.guid="";
            self.$emit('hideShinei');
          }
        }
      },
      //室内加载
      shinei(map,view){
        const self = this;
        esriLoader.loadModules([
          'esri/layers/FeatureLayer',
          'esri/tasks/support/Query',
          "esri/tasks/QueryTask",
          "esri/layers/MapImageLayer"
        ])
          .then(([FeatureLayer,Query,QueryTask,MapImageLayer]) => {
            var url = "https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX_FWM/MapServer/0";//范围面
            var shineiLayer = null;
            //范围面显示
            if(shineiLayer){
              shineiLayer.visible = true;
            }else{
              /*shineiLayer = new FeatureLayer(url,{
                outFields: ["*"],
                id:'shinei',
                opacity:0.2
              });*/
              /*shineiLayer = new MapImageLayer({
                url: "https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX/MapServer",
                sublayers: [
                  {
                    id: 0,
                    visible: true
                  }, {
                    id: 21,
                    visible: true
                  }, {
                    id: 62,
                    visible: true
                  }
                ]
              });
              map.add(shineiLayer);*/
            }
            //手指松开
            view.on('pointer-up',function(e){
              self.shineiLoad(Query,QueryTask,FeatureLayer,url,MapImageLayer);
            });
            //加载时
            setTimeout(function () {
              self.shineiLoad(Query,QueryTask,FeatureLayer,url,MapImageLayer);
            },100);
          });
      },
      shineiLoad(Query,QueryTask,FeatureLayer,url,MapImageLayer){
      	const self = this;
      	url = self.tdtconfig.shinei//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/SNDT_POI/MapServer/0";
        var url2 = self.tdtconfig.louceng//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX/MapServer/";//楼层
        var url2a = '';
        var url4 = self.tdtconfig.louceng//"https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX/MapServer/";//楼层
        var url4a = '';
        var loucengLayer = null;
        var loucengfanweiLayer = null;
        var loucengfanweiLayer2 = null;
        var shangpuLayer = null;
        const view = self.view;
        const map = self.map;
        //&& map.findLayerById('shiliang')!=null
        if(view.zoom>15 ){
          //查询
          var queryTask = new QueryTask({
            url: url
          });
          var q = new Query();
          q.geometry = view.extent;
          q.start = 0;
          q.outFields = ["*"];
          q.num = 1;
          console.log(view.extent);
          queryTask.execute(q).then(function(results){
          	console.log('result');
          	console.log(results);
            //console.log(444);
            //console.log(results.features);
            if(results.features.length>0){
              //当前所在的室内变
              if(self.shineiData.guid!=results.features[0].attributes.GUID){
                shineiData.forEach(function (item) {
                  if(item.guid==results.features[0].attributes.GUID){
                  	console.log('titlename');
                    Util.title(item.name);
                  	item.louceng.forEach(function(lc){
                  		if(lc.name=='L1'){
                        url2a = lc.url1;
                        url4a = lc.url2;
                        self.shineiData.loucengName = lc.name;//
                        //console.log(item);
                        //楼层范围
                        /*if(map.findLayerById('loucengfanwei')!=null){
                          map.remove(map.findLayerById('loucengfanwei'));
                        }
                        loucengfanweiLayer = new MapImageLayer({
                        	url:url4+url4a,
                          id:'loucengfanwei',
                        });*/
                        /*loucengfanweiLayer = new FeatureLayer(url4+url4a,{
                          outFields: ["*"],
                          id:'loucengfanwei',
                        });*/
                        //map.add(loucengfanweiLayer);
                        /*if(map.findLayerById('loucengfanwei2')!=null){
                          map.remove(map.findLayerById('loucengfanwei'));
                        }
                        loucengfanweiLayer = new MapImageLayer({
                          url:url4+lc.url3,
                          id:'loucengfanwei2',
                        });*/
                        /*loucengfanweiLayer2 = new FeatureLayer(url4+lc.url3,{
                          outFields: ["*"],
                          id:'loucengfanwei2',
                        });*/
                       // map.add(loucengfanweiLayer2);
                        //楼层
                        if(map.findLayerById('louceng')!=null){
                          map.remove(map.findLayerById('louceng'));
                        }
                        /*loucengLayer = new FeatureLayer(url2+url2a,{
                          outFields: ["*"],
                          id:'louceng',
                        });*/
                        /*loucengLayer = new MapImageLayer({
                        	url:url2+url2a,
                          id:'louceng',
                        });*/
                        //map.add(loucengLayer);
                        var imglayer = new MapImageLayer({
                          url: (url2+'//').replace('///',''),
                          id:'louceng',
                          sublayers: [
                            {
                              id: parseInt(lc.url0),
                              visible: true
                            }/*, {
                              id: parseInt(lc.url3),
                              visible: true
                            }, {
                              id: parseInt(lc.url2),
                              visible: true
                            }*/
                          ]
                        });
                        map.add(imglayer);

                        self.shineiData.name = item.name;
                        self.shineiData.guid = item.guid;
                        self.shineiData.show = true;
                        self.$set(self.shineiData,'louceng',item.louceng);
                        self.$emit('shineiLoad',item.louceng,item.name);
                      }
                    });

                  }
                });
                //商铺
                self.shangpu("L1",view.zoom);//self.shineiData.loucengName
              }
              //缩放切换商铺
              self.shineiData.zoom = view.zoom;
              /*if(self.shineiData.zoom!=view.zoom && map.findLayerById('shangpu')!=null){
                map.findLayerById('shangpu').definitionExpression
                  = "guid='"+self.shineiData.guid+"' AND floor='"+self.shineiData.loucengName+"' AND fscale<="+view.zoom;
                self.shineiData.zoom = view.zoom;
              }*/
            }
          });
        }else{
          if(self.shineiData.show){
            //shineiLayer.visible = false; loucengfanwei
            if(map.findLayerById('loucengfanwei')!=null){
              map.remove(map.findLayerById('loucengfanwei'));
            }
            if(map.findLayerById('loucengfanwei2')!=null){
              map.remove(map.findLayerById('loucengfanwei2'));
            }
            if(map.findLayerById('louceng')!=null){
              map.remove(map.findLayerById('louceng'));
            }
            if(map.findLayerById('shangpu')!=null){
              map.remove(map.findLayerById('shangpu'));
            }
            self.shineiData.show=false;
            self.shineiData.guid="";
            self.$emit('hideShinei');
          }
        }
      }
    },
    destroyed(){
    	//console.log(3321);
    },
    created(){
      const self = this;
      var config={
        "sousuo":"https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0",
        "biaozhu":"http://services.wzmap.gov.cn/server/rest/services/Hosted/JCB_PL/VectorTileServer",
        "ditu":"https://services.wzmap.gov.cn/server/rest/services/TDT/JCB_PY/MapServer",
        "3dditu":"http://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ_1/VectorTileServer",
        "3d":"http://services.wzmap.gov.cn/server/rest/services/Hosted/RES_PY_200/SceneServer",
        "xzqh":"http://services.wzmap.gov.cn/server/rest/services/Hosted/XZQH/VectorTileServer",
        "dsj":"http://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer",
        "yl":"http://services.wzmap.gov.cn/server/rest/services/Hosted/YL/VectorTileServer",
        "ny":"http://services.wzmap.gov.cn/server/rest/services/Hosted/NYLY/VectorTileServer",
        "yingxiangbiaozhu":"http://services.wzmap.gov.cn/server/rest/services/Hosted/YXZJ/VectorTileServer",
        "yingxiangditu":"https://services.wzmap.gov.cn/server/rest/services/TDT/YX2017/MapServer",
        "fangzhen":"http://183.245.65.187/iserver/services/3dmap/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=3dmap&STYLE=default&TILEMATRIXSET=custom_3dmap&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=image%2Fpng",
        "quanjing":"https://services.wzmap.gov.cn/server/rest/services/TDT/QUANJING/MapServer/0",
        "shinei":"https://services.wzmap.gov.cn/server/rest/services/TESEDT/SNDT_POI/MapServer/0",
        "louceng":"https://services.wzmap.gov.cn/server/rest/services/TESEDT/FYY_WXC_SMZX/MapServer/"
      }
      self.$set(self.$data,'tdtconfig',config);
      return
      Util.ajax.get('/datas/tdtconfig.json').then(function (response) {
        var config = JSON.parse(response.data.replace(/\/\/\/.*/gi,''));
        self.$set(self.$data,'tdtconfig',config);
      });
    },
    mounted: function () {
    	/*Util.ajax.get('/config.json').then(function (response) {
        console.log(JSON.parse(response.data.replace(/\/\/\/.*!/gi,'')));
      });*/
      this.appConfig.container = this.mapid || 'map'+Math.random();  // use same container for views;
      this.loadArcgis();
      //console.log(this.$options.methods);
      /*const self = this;
      for(let key in this.$options.methods){
        if(key!='loadArcgis' && key!='initMap' && key!='threeDMap'){
          this.$options.methods[key].before = function () {
            console.log(111);
          }
        }
      }*/
    }
  }
</script>
