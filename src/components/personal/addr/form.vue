<style lang="less" scoped>
  .tmap-report{
    padding: 10px;height:100%;box-sizing: border-box;
  }
</style>

<template>
  <div class="tmap-report">
	  <view-box>
    <h3>
      地址设置<span style="font-size: 14px;color:red;">（请在地图上点击选取地点）</span>
      <img src="@/images/close.png" @click="closePop" style="float:right;width:20px;margin-top:3px;" alt="">
    </h3>
    <div style="height:300px;margin-top:10px;position: relative">
      <tianditu style="height:100%;" mapid="addrmap" ref="addrmap"
                layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
                @mapload="mapload"></tianditu>
      <div class="tmap-box" style="top: 5px;position: absolute;right: 5px;z-index:999;" @click="dingwei">
        <img src="@/images/r-3.png" style="width:22px;" alt="">
      </div>
    </div>
    <!-- height:calc(100% - 290px); -->
    <div style="overflow: auto;height:auto;">
      <div class="y-input required">
        <label for="">名称</label>
        <input v-model="form.title" type="text" placeholder="请输入地点名称">
      </div>
    </div>
	  <!--<group>
		  <x-input v-model="form.title" title="名称"></x-input>
	  </group>-->
    <div class="bottom-btn mt10" style="background:#009e60 !important;" @click="submit">提交</div>
    <!--<div class="bottom-btn mt10" @click="closePop" style="background:#eee !important;color:#000;">关闭</div>-->
	  </view-box>
  </div>
</template>

<script>
  import Tianditu from '@/components/libs/tianditu/main.vue';
  import esriLoader from 'esri-loader';
  import Util from '@/libs/util';
  import {ViewBox} from 'vux';
  export default {
    props:[],
    components:{
      Tianditu,ViewBox
    },
    data(){
      return {
        url:"/fapi/needlogin/addr/",
        chooseAddr:false,
        load:false,
        form:{}
      }
    },
    methods:{
      checkForm(){
        let state = false;
        if(!this.form.title){
          this.$vux.toast.text('请输入名称');
        }else if(!this.chooseAddr){
          this.$vux.toast.text('请点击选择地址');
        }else {
          state = true;
        }
        return state;
      },
      submit(){
        const self = this;
        if(!this.checkForm()){
          return;
        }
        if(this.load){
          self.$vux.alert.show('提交中请不要重复点击');
        }
        this.load = true;
        self.form.lng = self.$refs.addrmap.$data.view.center.x;
        self.form.lat = self.$refs.addrmap.$data.view.center.y;
        self.$vux.loading.show();
        Util.ajax.post(this.url+"add",this.form).then(function(res){
          self.$vux.loading.hide();
          if(res.data.code==100){
            self.$vux.toast.text('提交成功');
            self.$set(self.$data,'form',{});
            self.$emit('subSuccess');
            self.load=false;
            //self.$refs.guidupload.clearImgList();
          }else{
            self.$vux.alert.show(res.data.msg);
          }
        })
      },
      closePop(){
        this.$emit('closePop');
      },
      uploadSuccess(imgList){
        console.log(imgList);
        this.$set(this.form,'attachs',imgList);
      },
      mapload(map){
        const self = this;
        const view = self.$refs.addrmap.$data.view;
        this.addrmapClick = this.$refs.addrmap.$data.view.on('click',function (e) {
          esriLoader.loadModules([
            'esri/symbols/PictureMarkerSymbol',
            'esri/geometry/Point',
            'esri/layers/GraphicsLayer',
            'esri/Graphic'
          ]).then(([PictureMarkerSymbol,Point,GraphicsLayer,Graphic])=>{
            var symbol = {
              type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
              url: "images/l2.png",
              width: "20px",
              height: "20px"
            };

            var point = new Point({
              "x" : e.mapPoint.longitude,
              "y" : e.mapPoint.latitude,
              "spatialReference" : map.spatialReference
            });
            self.$set(self.form,'lng',e.mapPoint.longitude);
            self.$set(self.form,'lat',e.mapPoint.latitude);
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
            self.chooseAddr=true;
          });
          //
        });
      },
      dingwei(){
        const wx = this.$wechat;
        const self = this;
        const map = this.$refs.addrmap.$data.map;
        const view = this.$refs.addrmap.$data.view;
        wx.ready(function(){
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            /*complete:function (res) {
              alert(JSON.stringify(res));
            },*/
            success: function (res) {
              var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              self.mapLocation = {lng,lat};
              //定位到中心
              esriLoader.loadModules([
                'esri/symbols/PictureMarkerSymbol',
                'esri/geometry/Point',
                'esri/layers/GraphicsLayer',
                'esri/Graphic'
              ]).then(([PictureMarkerSymbol,Point,GraphicsLayer,Graphic])=>{
                var symbol = {
                  type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                  url: "images/l2.png",
                  width: "20px",
                  height: "20px"
                };
                var point = new Point({
                  "x" : lng,
                  "y" : lat,
                  "spatialReference" : map.spatialReference
                });
                var picGraphic = new Graphic(point, symbol);
                if (map.locationLayers == null) {
                  map.locationLayers = new GraphicsLayer({
                    graphics: [picGraphic]
                  });
                  map.add(map.locationLayers);
                } else {
                  map.locationLayers.visible = true;
                  map.locationLayers.removeAll();
                }
                map.locationLayers.add(picGraphic);
                view.center = [lng,lat];
                self.chooseAddr=true;
              });
            }
          });
        });
      }
    },
    mounted(){
      /*const self = this;
      Util.title('地址设置');
      var state = {
        title: "title",
        url: location.href
      };
      window.history.pushState(state, "title", location.href);
      window.addEventListener("popstate", function (e) {
        pushHistory();
      }, false);
      function pushHistory() {
        self.closePop();
      }*/
    }
  }
</script>
