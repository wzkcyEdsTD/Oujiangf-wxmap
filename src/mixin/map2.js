import Util from '@/libs/util';
import MapUtil from '@/components/libs/tianditu/util';
import esriLoader from 'esri-loader';
import SearchData from '@/datas/search.json';
export let mapmixin = {
    data(){
      return {
        lng:null,
        lat:null,
        zoom:null,
        maploading:false,
        drawloading:false,
        cejuShow:false,
        cemianShow:false,
        huixianShow:false,//绘线
        huimianShow:false,//绘面
        fenxiangShow:false,//分享
        juliShow:false,
        juliClick:null,
        juliInfo:"",
        shiquShow:false,//拾取
        shiquClick:null,
        quanjingShow:false,
        shiquLocation:null,//拾取坐标
        draw:null,
        view:null,
        mapLocation:{},
        mapCenter:[],
        searchMap:{
          hideReturn:false,
          count:0,
          key:"",
          tempKey:"",//上一次
          tag:"",
          url:"",
          page:{
            pageSize:20,
            pageNum:1,
            start:0,
            data:[],
            show:false,
            loadmore:true
          },
          show:false,//面板显示
          hisShow:true,//显示历史
          hisList:[],//历史记录
          itemList:[],//几大块
          tongzuList:[],//同组
          shaixuan:{
            on2:false
          }
        },
        personPop:{
          show:false,
          load:false
        },
        paddrPop:{show:false},
        addrPop:{
          show:false,
          load:false
        },
        zhoubianPop:{
          show:false,
          load:false,
          lng:null,
          lat:null
        },
        zhuantiPop:{
          show:false,
          load:false
        },
        myshangbaoPop:{
          show:false
        },
        dituPop:{
          show:false,
          load:false
        },
        shangbaoPop:{
          show:false
        },
        //纠错
        jiucuoPop:{
          show:false,
          guid:'',
          centerx:0,
          centery:0,
          name:'',
          zoom:12
        },
        infoPop:{
          show:false,
          iscollect:false,
          info:{},
          simple:true
        },
        quanjingPop:{
          show:false,
          url:""
        },
        //guid上传图片
        guidPop:{
          show:false,
          form:{}
        },
        collectPop:{
          show:false,
          load:false
        },
        toolshow:false,
        is3D:false
      }
    },
    computed:{
      wxuser(){
        return  this.$store.getters.wxuser;
      }
    },
    methods: {
		//清除详细点
		clearInfo(){
			const map = this.$refs.map.$data.map;
			if(map.findLayerById('searchInfo')!=null){
				map.remove(map.findLayerById('searchInfo'));
			}
		},
      clearKey(){
        this.searchMap.key = '';
        $("#searchKey").focus();
        //this.searchMap.show=true;
      },
      focusout(){
        const self = this;
        self.searchMap.show=false
        setTimeout(function(){

        },100);
      },
      huixian(){
        const self = this;
        if(this.huixianShow){
          this.qingchu();
        }else{
          if(this.cemianShow || this.juliShow || this.shiquShow || this.huimianShow || this.cejuShow){
            this.qingchu();
          }
          this.huixianShow=true;
          this.createDraw(function () {
            MapUtil.enableCreateLine(self.draw,self.view,true);
          });
        }
      },
      huimian(){
        const self =this;
        if(this.huimianShow){
          this.qingchu();
        }else {
          if (this.cemianShow || this.cejuShow || this.juliShow || this.shiquShow || this.huixianShow) {
            this.qingchu();
          }
          this.huimianShow = true;
          this.createDraw(function (){
            MapUtil.enableCreatePolygon(self.draw,self.view,true);
          });
        }
      },
      cemian(){
        const self =this;
        if(this.cemianShow){
          this.qingchu();
        }else {
          if (this.cejuShow || this.juliShow || this.shiquShow || this.huimianShow || this.huixianShow) {
            this.qingchu();
          }
          this.cemianShow = true;
          this.createDraw(function () {
            MapUtil.enableCreatePolygon(self.draw,self.view);
          });
        }
      },
      ceju(){
        const self = this;
        if(this.cejuShow){
          this.qingchu();
        }else{
          if(this.cemianShow || this.juliShow || this.shiquShow || this.huimianShow || this.huixianShow){
            this.qingchu();
          }
          this.cejuShow=true;
          this.createDraw(function () {
            MapUtil.enableCreateLine(self.draw,self.view);
          });
        }
      },
      shishijuli(){
        const self = this;
        if(!this.mapLocation){
          this.dingwei(false,function () {
            self.doshiqu();
          });
        }else{
          self.doshiqu();
        }
      },
      doshiqu(){
        if(this.juliShow){
          this.qingchu();
          return;
        }
        if(this.cemianShow || this.cejuShow || this.shiquShow || this.huimianShow || this.huixianShow){
          this.qingchu();
        }
        this.juliShow=true;
        const self = this;
        this.createDraw(function () {
          esriLoader.loadModules([
            "esri/Graphic",
            "esri/geometry/Polyline",
            "esri/geometry/geometryEngine"
          ]).then(([Graphic,Polyline,geometryEngine]) => {
            const view = self.view;
            self.$refs.map.ishitTest = false;
            //const map = this.$ref.smap.$data.map;
            self.juliClick = view.on('click',function (e) {
              view.graphics.removeAll();
              //console.log(vertices);
              if(!self.mapLocation.lng){
                self.dingwei(true,function () {
                  var lines = new Polyline({
                    paths: [[self.mapLocation.lng,self.mapLocation.lat],[e.mapPoint.longitude,e.mapPoint.latitude]],
                    spatialReference: view.spatialReference
                  });
                  var graphic = new Graphic({
                    geometry: lines,
                    symbol: {
                      type: "simple-line", // autocasts as new SimpleFillSymbol
                      color: [255, 0, 0],
                      width: 1,
                      style: "solid",
                      outline: { // autocasts as SimpleLineSymbol
                        color: [255, 255, 255],
                        width: 1
                      },
                      cap: "round",
                      join: "round"
                    }
                  });
                  view.graphics.add(graphic);
                  var lineLength = geometryEngine.geodesicLength(lines, "meters");
                  self.juliInfo = lineLength.toFixed(2);
                  var graphic2 = new Graphic({
                    geometry: lines.extent.center,
                    symbol: {
                      type: "text",
                      color: "#f00",
                      haloColor: "black",
                      haloSize: "1px",
                      text: lineLength.toFixed(2) + " 米",
                      xoffset: 3,
                      yoffset: 3,
                      font: { // autocast as Font
                        size: 12,
                        family: "Microsoft YaHei"
                      }
                    }
                  });
                  view.graphics.add(graphic2);
                });
              }else{
                var lines = new Polyline({
                  paths: [[self.mapLocation.lng,self.mapLocation.lat],[e.mapPoint.longitude,e.mapPoint.latitude]],
                  spatialReference: view.spatialReference
                });
                var graphic = new Graphic({
                  geometry: lines,
                  symbol: {
                    type: "simple-line", // autocasts as new SimpleFillSymbol
                    color: [255, 0, 0],
                    width: 1,
                    style: "solid",
                    outline: { // autocasts as SimpleLineSymbol
                      color: [255, 255, 255],
                      width: 1
                    },
                    cap: "round",
                    join: "round"
                  }
                });
                view.graphics.add(graphic);
                var lineLength = geometryEngine.geodesicLength(lines, "meters");
                self.juliInfo = lineLength.toFixed(2);
                var graphic2 = new Graphic({
                  geometry: lines.extent.center,
                  symbol: {
                    type: "text",
                    color: "#f00",
                    haloColor: "black",
                    haloSize: "1px",
                    text: lineLength.toFixed(2) + " 米",
                    xoffset: 3,
                    yoffset: 3,
                    font: { // autocast as Font
                      size: 12,
                      family: "Microsoft YaHei"
                    }
                  }
                });
                view.graphics.add(graphic2);
              }

            });
          });
        });
      },
      shiqu(){
        const self = this;
        if(this.shiquShow){
          this.qingchu();
          return;
        }
        if(this.cemianShow || this.juliShow || this.cejuShow || this.huimianShow || this.huixianShow){
          this.qingchu();
        }

        self.shiquShow=true;
        esriLoader.loadModules([
          'esri/symbols/PictureMarkerSymbol',
          'esri/geometry/Point',
          'esri/layers/GraphicsLayer',
          'esri/Graphic'
        ]).then(([PictureMarkerSymbol,Point,GraphicsLayer,Graphic])=>{
          var symbol = {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "images/s1.png",
            width: "30px",
            height: "30px"
          };
          const view = self.view;
          const map = self.map;
          self.$refs.map.ishitTest = false;
          self.shiquClick = view.on('click',function (e) {
            //console.log(2);
            if(!self.shiquShow){return;}
            var point = new Point({
              "x" : e.mapPoint.longitude,
              "y" : e.mapPoint.latitude,
              "spatialReference" : map.spatialReference
            });
            self.shiquLocation = {
              lng:(e.mapPoint.longitude).toFixed(4),
              lat:(e.mapPoint.latitude).toFixed(4)
            };
            var picGraphic = new Graphic(point, symbol);
            if (map.findLayerById('shiquLayer')!=null) {
              map.remove(map.findLayerById('shiquLayer'));
            }
            let shiquLayer = new GraphicsLayer({
              id:'shiquLayer',
            });
            shiquLayer.add(picGraphic);
            map.add(shiquLayer);
          })
        });
      },
      //清除
      qingchu(state){
        if(this.draw){
          this.draw.reset();
        }
        if(MapUtil.action1){
          MapUtil.action1.complete();
        }
        if(MapUtil.action2){
          MapUtil.action2.complete();
        }
        this.cejuShow=false;
        this.cemianShow=false;
        this.juliShow=false;
        if(this.juliClick){
          this.juliClick.remove();
        }
        this.shiquShow=false;
        if(this.shiquClick){
          this.shiquClick.remove();
        }
        this.huimianShow=false;
        this.huixianShow=false;
        const map = this.map;
        const view = this.view;
        if(map.wxlocationLayer!=null){
          map.wxlocationLayer.removeAll();
        }
        if(map.locationLayers!=null){
          map.locationLayers.removeAll();
        }
        if(map.findLayerById('shiquLayer')!=null){
          map.remove(map.findLayerById('shiquLayer'));
        }
        if(map.findLayerById('zhuantilayer') && state){
          map.remove(map.findLayerById('zhuantilayer'));
        }
        if(map.findLayerById('dingwei')){
          map.remove(map.findLayerById('dingwei'));
        }
        if(map.findLayerById('searchInfo') && state){
          map.remove(map.findLayerById('searchInfo'));
        }
        view.graphics.removeAll();
        this.$refs.map.ishitTest = true;
      },
      dingwei(iscenter,callback){
        const wx = this.$wechat;
        const self = this;
        wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          console.log(res);
        });
        wx.ready(function(){
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              self.mapLocation = {lng,lat};
              //定位到中心
              if(iscenter){
                esriLoader.loadModules([
                  'esri/symbols/PictureMarkerSymbol',
                  'esri/geometry/Point',
                  'esri/layers/GraphicsLayer',
                  'esri/Graphic'
                ]).then(([PictureMarkerSymbol,Point,GraphicsLayer,Graphic])=>{
                  var symbol = {
                    type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                    url: "images/location.png",
                    width: "50px",
                    height: "50px"
                  };
                  const map = self.map;
                  var point = new Point({
                    "x" : lng,
                    "y" : lat,
                    "spatialReference" : map.spatialReference
                  });
                  var picGraphic = new Graphic(point, symbol);
                  if (map.findLayerById('dingwei')!=null) {
                    map.remove(map.findLayerById('dingwei'));
                  }
                  map.wxlocationLayer = new GraphicsLayer({
                    id:"dingwei"
                    //graphics: [picGraphic]
                  });
                  map.add(map.wxlocationLayer);
                  map.wxlocationLayer.add(picGraphic);
                  self.view.center = [lng,lat];
                  if(callback){
                    callback();
                  }
                });
              }else{
                if(callback){
                  callback();
                }
              }
            }
          });
        });
      },
      createDraw(callback){
        if(this.draw==null){
          const self = this;
          if(self.drawloading){
            self.$vux.toast.text('加载中');
            return;
          }
          self.drawloading = true;
          esriLoader.loadModules([
            "esri/views/2d/draw/Draw"
          ])
          .then(([Draw]) => {
            let draw = new Draw({
              view:self.view
            });
            self.draw = draw;
            self.drawloading = false;
            callback(draw);
          });
        }else{
          console.log(312);
          callback();
        }
      },
      //详细
      Xiangxi(){
        /*const imgList = this.infoPop.info.imgList;
        if(imgList && imgList.length && imgList.length>0){*/
        if(this.infoPop.info.ADDRESS){
          this.infoPop.simple = false;
        }else{
          this.$vux.toast.text('没有更多详情了');
        }
      },
      //搜索详细
      async searchInfo(obj,hideReturn,hideLine){
        console.log(obj);
        const self = this;

        if(!obj.geometry){
          this.$vux.loading.show();
          const loadArr = await esriLoader.loadModules([
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query"
          ]);
          const Q1 = loadArr[1];
          const task = loadArr[0];
          let url = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
          SearchData.forEach(function (searchItem) {
            if(searchItem.name==obj.attributes.SORT){
              url = searchItem.url
            }
          });
          var t = new task({
            url:url
          });
          var q = new Q1();
          q.returnGeometry = true;
          q.outFields = ["*"];
          q.where = " FEATUREGUID='"+obj.attributes.FEATUREGUID+"'";
          const objResult = await t.execute(q);
          this.$vux.loading.hide();
          if(objResult.features[0]){
            obj = objResult.features[0];
          }
        }

        this.searchMap.hideReturn = hideReturn;
        this.searchMap.page.show = false;
        this.infoPop.show=true;
        self.$set(self.quanjingPop,'url','');
        const map = this.map;
        const view = this.view;
        console.log(JSON.stringify(obj.attributes));
        if(obj.geometry && obj.geometry.x){
          this.$set(obj.attributes,'CENTERX',obj.geometry.x);
          this.$set(obj.attributes,'CENTERY',obj.geometry.y);
        }
        if(obj.geometry && obj.geometry.paths){
          this.$set(obj.attributes,'CENTERX',obj.geometry.paths[0][0][0]);
          this.$set(obj.attributes,'CENTERY',obj.geometry.paths[0][0][1]);
        }
        if(obj.geometry && obj.geometry.rings){
          this.$set(obj.attributes,'CENTERX',obj.geometry.rings[0][0][0]);
          this.$set(obj.attributes,'CENTERY',obj.geometry.rings[0][0][1]);
        }
        this.$set(this.infoPop,'info',obj.attributes);
        //后台获取图片 /fapi/needlogin/uploadimg/guid/
        Util.ajax.post('/pubApi/wzmap/poiimg?guid='+obj.attributes.FEATUREGUID).then(function (res) {
          if(res.data && res.data.length){
            self.$set(self.infoPop.info,'imgList',res.data);
          }
        });
        //是否收藏
        Util.ajax.post('/fapi/needlogin/collect/guid?guid='+obj.attributes.FEATUREGUID).then(function (res) {
          if(res.data.collect){
            self.$set(self.infoPop.info,'collect',res.data.collect);
          }
        });
        //全景
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query"
        ]).then(([QueryTask,Query]) => {
          var queryTask = new QueryTask({
            url: "https://services.wzmap.gov.cn/server/rest/services/TDT/QUANJING/MapServer/0"
          });
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.start = 0;//开始
          query.num = 1;//多少
          query.where = " FEATUREGUID='"+obj.attributes.FEATUREGUID+"' ";
          queryTask.execute(query).then(function(results){
            if(results.features.length>0 && results.features[0].attributes.VR){
              self.$set(self.quanjingPop,'url',results.features[0].attributes.VR);
            }else{
              self.$set(self.quanjingPop,'url','');
            }
          });
        });
        //分类代码
        Util.ajax.post('/fapi/public/option/fcode?fcode='+obj.attributes.FCODE).then(function (res) {
          if(res.data.fcode){
            res.data.fcode.zhoubian = res.data.fcode.zhoubian.replace(/，/gi,',');
            self.$set(self.infoPop.info,'option',res.data.fcode);
          }
        });
        if(obj.attributes.CENTERX || obj.attributes.CENTERY || obj.geometry.x || obj.geometry.y){
          view.center = [obj.attributes.CENTERX || obj.geometry.x,obj.attributes.CENTERY || obj.geometry.y];
        }
        if((obj.attributes.CENTERX || obj.attributes.CENTERY || obj.geometry.x || obj.geometry.y) && !hideReturn){
          esriLoader.loadModules([
            'esri/symbols/PictureMarkerSymbol',
            'esri/geometry/Point',
            'esri/layers/GraphicsLayer',
            'esri/Graphic'
          ]).then(([PictureMarkerSymbol,Point,GraphicsLayer,Graphic])=>{
            var symbol = {
              type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
              url: "images/l2.png",
              width: "26px",
              height: "26px",
              yoffset:"13px"
            };
            var point = new Point({
              "x" : obj.attributes.CENTERX || obj.geometry.x,
              "y" : obj.attributes.CENTERY || obj.geometry.y,
              "spatialReference" : map.spatialReference
            });
            var picGraphic = new Graphic(point, symbol);
            if(map.findLayerById('searchInfo')!=null){
              map.remove(map.findLayerById('searchInfo'));
            }
            var graphicLayer = new GraphicsLayer({
              graphics: [picGraphic],
              id:'searchInfo'
            });
            map.add(graphicLayer);
          });
        }
        //绘线
        view.graphics.removeAll();
        if(obj.geometry && obj.geometry.paths && !hideLine){
          esriLoader.loadModules([
            "esri/Graphic",
            "esri/geometry/Polyline"
          ])
          .then(([Graphic, Polyline]) => {
            var lines = new Polyline({
              paths: obj.geometry.paths,
              spatialReference: view.spatialReference
            });
            var graphic = new Graphic({
              geometry: lines,
              symbol: {
                type: "simple-line", // autocasts as new SimpleFillSymbol
                color: '#009e60',
                width: 3,
                style: "solid",
                outline: { // autocasts as SimpleLineSymbol
                  color: [255, 255, 255],
                  width: 1
                },
                cap: "round",
                join: "round"
              }
            });
            view.graphics.add(graphic);
            view.center = obj.geometry.paths[0][0];
          });
        }
      },
      //搜索历史
      searchHis(){
        //加载历史
        const self = this;
        Util.ajax.post('/fapi/needlogin/searchhis/list').then(function (response) {
          if(response.data && response.data.length>0){
            self.$set(self.searchMap,'hisList',response.data);
          }
        });
        //显示
        this.searchMap.show=true;
      },
      clearSearchHis(){
        const self = this;
        Util.ajax.post('/fapi/needlogin/searchhis/clear').then(function (response) {
          if(response.data.code==100){
            self.$set(self.searchMap,'hisList',[]);
          }else{
            self.$vux.alert.show(response.data.msg);
          }
        })
      },
      //图片上传
      uploadSuccess(imglist){
        this.$set(this.guidPop.form,'attachs',imglist);
      },
      guidUpload(){
        const self = this;
        if(!this.guidPop.form.attachs){
          this.$vux.toast.text('请选择图片');
          return;
        }
        self.$vux.loading.show('上传中');
        Util.ajax.post('/fapi/needlogin/uploadimg/add',this.guidPop.form).then(function (response) {
          self.$vux.loading.hide();
          if(response.data.code==100){
            self.$vux.alert.show('上传成功，等待管理员审核');
            self.$set(self.guidPop,'form',{});
            self.$refs.guidupload.clearImgList();
            self.guidPop.show=false;
          }else{
            self.$vux.alert.show(response.data.msg);
          }
        });
      },
      //收藏
      shoucang(){
        const self = this;
        let info = this.infoPop.info;
        self.$vux.loading.show('');
        if(info.collect && info.collect.id){
          Util.ajax.post("/fapi/needlogin/collect/del?ids="+info.collect.id).then(function (response) {
            self.$vux.loading.hide();
            if(response.data.code==100){
              self.$set(self.infoPop.info,'collect',{});
              self.$vux.toast.text("取消收藏成功");
            }else{
              self.$vux.toast.text(response.data.msg);
            }
          });
        }else{
          self.$set(info,'collect',{
            guid:info.FEATUREGUID,
            lng:info.CENTERX,
            lat:info.CENTERY,
            title:info.NAME,
            addr:info.ADDRESS
          });
          Util.ajax.post("/fapi/needlogin/collect/add",info.collect).then(function (response) {
            self.$vux.loading.hide();
            if(response.data.code==100){
              self.$set(info.collect,'id',response.data.id);
              self.$set(self.infoPop,'info',info);
              self.$vux.toast.text("收藏成功");
            }else{
              self.$vux.toast.text(response.data.msg);
            }
          });
        }
      },
      //全景查找
      findQuanjing(){
        const self = this;
        if(self.quanjingPop.url){
          self.quanjingPop.show = true;
        }else{
          self.$vux.toast.text('未找到全景');
        }
      },
      //导航
      openLocation(lng,lat,name,address,url){
        if(!lng || !lat){
          this.$vux.toast.text('未找到对应的地址');
          return;
        }
        let gcj = Util.togcj02(lng,lat);
        const wx = this.$wechat;
        const self = this;
        wx.ready(function(){
          wx.openLocation({
            latitude: gcj[1], // 纬度，浮点数，范围为90 ~ -90
            longitude: gcj[0], // 经度，浮点数，范围为180 ~ -180。
            name: name, // 位置名
            address: address, // 地址详情说明
            scale: self.view.zoom, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: url // 在查看位置界面底部显示的超链接,可点击跳转
          });
        })
      },
      //预览图片
      previewImage(url){
        this.$wechat.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url] // 需要预览的图片http链接列表
        })
      },
      closePop(){
        if(this.zhoubianPop)
          this.zhoubianPop.show=false;
        if(this.collectPop)
          this.collectPop.show=false;
        if(this.addrPop)
          this.addrPop.show=false;
        if(this.paddrPop)
          this.paddrPop.show=false;
        if(this.jiucuoPop)
          this.jiucuoPop.show=false;
        if(this.myshangbaoPop)
          this.myshangbaoPop.show=false;
        if(this.shangbaoPop)
          this.shangbaoPop.show=false;
        if(this.zhuantiPop)
          this.zhuantiPop.show=false;
        console.log(this.$route.meta.title);
        Util.title(this.$route.meta.title);
      },
      //距离排序
      julipaixu(){
        if(this.searchMap.shaixuan.on2){
          this.searchMap.shaixuan.on2 = false;
          this.$set(this.searchMap.page,'data',this.searchMap.tempData);
        }else{
          this.searchMap.shaixuan.on2 = true;
          this.$set(this.searchMap,'tempData',JSON.parse(JSON.stringify(this.searchMap.page.data)));
          this.searchMap.page.data.sort(function (a,b) {
            return a.attributes.juli-b.attributes.juli;//距离由近到远
          })
        }
      },
      searchpoi(flush,url,tag,list,iszhuanti,iszhoubian){
        console.log(tag);
        if(!this.searchMap.key && !tag){
          this.$vux.toast.text('请输入关键词');
          return;
        }
        const self = this;
        let key = this.searchMap.key;
        this.$set(this.searchMap,'tempKey',key);
        if(key){
          Util.ajax.post('/fapi/needlogin/searchhis/add',{searchkey:key}).then(function (response) {
            self.searchMap.hisList.push(key);
          });
        }
        if(flush){
          this.searchMap.page.start = 0;
          this.searchMap.page.pageNum = 1;
          this.searchMap.page.data = [];
          this.searchMap.shaixuan.on2 = false;
        }else{
          this.searchMap.page.pageNum++;
          this.searchMap.page.start = this.searchMap.page.start+this.searchMap.page.pageSize;
        }
        this.infoPop.show=false;
        this.infoPop.simple=true;
        self.$vux.loading.show('搜索中');
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/geometry/Polyline",
          "esri/geometry/geometryEngine",
          'esri/geometry/Circle',
          'esri/geometry/Point'
        ]).then(([QueryTask,Query,Polyline,geometryEngine,Circle,Point]) => {
          var layerurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
          if(url){
            layerurl = url;
            self.searchMap.url = url;
          }else{
            self.searchMap.url = '';
          }
          // Represents the REST endpoint for a layer of cities.
          var queryTask = new QueryTask({
            url: layerurl
          });
          const view = self.view;
          const map = self.map;
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.start = self.searchMap.page.start;//开始
          query.num = self.searchMap.page.pageSize;//多少
          query.where = " ( NAME LIKE '"+key+"%' OR ADDRESS LIKE '"+key+"%' ) ";//AND FSCALE<="+view.zoom  // Return all cities with a population greater than 1 million
          //标签
          if(tag){
            //标签
            query.where = "TAG LIKE '%"+tag+"%' AND NAME is not null";
            if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
              query.where = "tdt.DBO.教育.TAG LIKE '%"+tag+"%' "//AND tdt.dbo.t_base_photo.Sort=1
              query.groupByFieldsForStatistics = [ "tdt.DBO.教育.NAME" ];
            }
            self.searchMap.tag = tag;
          }else{
            self.searchMap.tag = '';
          }
          //同组
          if(list && list.length){
            self.$set(self.searchMap,'tongzuList',list)
          }else{
            if(tag){
              Util.ajax.post('/fapi/public/option/zttongzu?name='+tag).then(function (response) {
                if(response.data && response.data.length){
                  if(iszhuanti){
                    response.data.forEach(function (data) {
                      data.iszhuanti = true;
                    });
                  }
                  self.$set(self.searchMap,'tongzuList',response.data)
                }
              });
            }else {
              self.$set(self.searchMap,'tongzuList',[]);
            }
          }
          //2公里
          if(iszhoubian){
            var geo = new Circle(new Point({
              "x" : self.zhoubianPop.lng?self.zhoubianPop.lng:(self.mapLocation.lng?self.mapLocation.lng:view.center.x),
              "y" : self.zhoubianPop.lat?self.zhoubianPop.lat:(self.mapLocation.lat?self.mapLocation.lat:view.center.y),
              "spatialReference" : map.spatialReference
            }), { "radius": 2000 });
            query.geometry = geo;
          }

          query.orderByFields = ["HOTSPOT DESC"];
          if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
            query.orderByFields = ["tdt.DBO.教育.HOTSPOT DESC"];
          }
          if(!url){
            query.orderByFields = ["FEATUREGUID DESC"];
          }
          if(!url){
            Util.ajax.post('/sousuo/_search',{
              "query": {
                "multi_match": {
                  "query" : key,
                  "type": "best_fields",
                  "fields" : ["name", "address"],
                  "tie_breaker": 0.3
                }
              },
              "size":self.searchMap.page.pageSize,
              "from": self.searchMap.page.start
            }).then(function (response) {
              let seachArr = response.data.hits.hits;
              let total = response.data.hits.total;
              if(seachArr && seachArr.length==self.searchMap.page.pageSize){
                self.searchMap.page.loadmore = true;
              }else{
                self.searchMap.page.loadmore = false;
              }
              self.$set(self.searchMap,'count',total);
              seachArr.forEach(function (poi) {
                self.$set(poi,'attributes',{
                  NAME:poi._source.name,
                  ADDRESS:poi._source.address,
                  CENTERX:poi._source.centerx,
                  CENTERY:poi._source.centery,
                  SORT:poi._source.sort,
                  FEATUREGUID:poi._source.featureguid
                });
                if(poi._source.centerx && poi._source.centerx!='NULL'){
                  var po = new Polyline({
                    paths: [[self.zhoubianPop.lng || self.mapLocation.lng || view.center.x,self.zhoubianPop.lng || self.mapLocation.lat || view.center.y],[poi._source.centerx,poi._source.centery]],
                    spatialReference: view.spatialReference
                  });
                  self.$set(poi.attributes,'juli',(geometryEngine.geodesicLength(po, "meters")/1000).toFixed(2));
                }
                self.searchMap.page.data.push(poi);
              });
              self.searchMap.page.show = true;
              self.searchMap.show=false;
              self.infoPop.show=false;
              self.infoPop.iscollect=false;
              self.searchMap.shaixuan.on2 = false;//距离排序
              self.$vux.loading.hide();
            });
          }else{
            // When resolved, returns features and graphics that satisfy the query.
            queryTask.execute(query).then(function(results){
              //console.log(results.features);
              if(results.features && results.features.length==self.searchMap.page.pageSize){
                self.searchMap.page.loadmore = true;
              }else{
                self.searchMap.page.loadmore = false;
              }
              results.features.forEach(function (poi) {
                if(poi.attributes.secondCheck==1){
                  console.log(poi);
                }
                if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
                  poi.attributes = JSON.parse(JSON.stringify(poi.attributes).replace(/tdt\.DBO\.教育\./gi,''));
                }
                var arr;
                //距离
                try{
                  if(poi.attributes.CENTERX){
                    arr = [poi.attributes.CENTERX,poi.attributes.CENTERY];
                  }else if(poi.geometry && poi.geometry.x && poi.geometry.y){
                    poi.attributes.CENTERX = poi.geometry.x;
                    poi.attributes.CENTERY = poi.geometry.y;
                    arr = [poi.geometry.x,poi.geometry.y]
                  }
                  if(arr){
                    var po = new Polyline({
                      paths: [[self.mapLocation.lng || view.center.x,self.mapLocation.lat || view.center.y],arr],
                      spatialReference: view.spatialReference
                    });
                    self.$set(poi.attributes,'juli',(geometryEngine.geodesicLength(po, "meters")/1000).toFixed(2));
                  }
                }catch(e){

                }
                self.searchMap.page.data.push(poi);
              });
              //显示多少条记录
              if(flush){
                query.start = null;
                query.num = null;
                queryTask.executeForCount(query).then(function(results){
                  console.log(results);
                  self.$set(self.searchMap,'count',results);
                });
              }
              self.searchMap.page.show = true;
              self.searchMap.show=false;
              self.infoPop.show=false;
              self.infoPop.iscollect=false;
              //如果是周边要按距离排
              if(iszhoubian){
                console.log('周边按距离排序');
                self.julipaixu();
              }
              self.$vux.loading.hide();
            });
          }

        });
      },
      //（显示在地图）
      collectDetail(collect){
        const self = this;
        self.personPop.show=false;
        self.collectPop.show=false;
        const map = this.map;
        const view = this.view;
        esriLoader.loadModules([
          'esri/geometry/Point'
        ]).then(([Point]) => {

          esriLoader.loadModules([
            'esri/symbols/PictureMarkerSymbol',
            'esri/geometry/Point',
            'esri/layers/GraphicsLayer',
            'esri/Graphic'
          ]).then(([PictureMarkerSymbol,Point,GraphicsLayer,Graphic])=>{
            var symbol = {
              type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
              url: "images/l2.png",
              width: "26px",
              height: "26px",
              yoffset:"13px"
            };
            var point = new Point({
              "x" : collect.lng,
              "y" : collect.lat,
              "spatialReference" : map.spatialReference
            });
            var picGraphic = new Graphic(point, symbol);
            if (map.locationLayers == null) {
              map.locationLayers = new GraphicsLayer({
                graphics: [picGraphic]
              });
              map.add(map.locationLayers);
            } else {
              map.locationLayers.removeAll();
            }
            map.locationLayers.add(picGraphic);
            view.center = [collect.lng,collect.lat];
          });
        });
      }
      //
    }
  };
