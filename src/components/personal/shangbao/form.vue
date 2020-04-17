<style lang="less">
  .tmap-report{
    padding: 10px;height:100%;box-sizing: border-box;
    .vux-selector{
      font-size: 14px;
    .weui-label{
      text-align: justify !important;
      text-align-last: justify !important;
      width: 80px !important;
      position: relative !important;
        &:after {
          content: '*';
          color: red;
          font-size: 12px;
          position: absolute;
          top: -2px;
          right: -8px;
        }
    }
    .weui-select{
      margin-left:15px !important;
    }
    &.weui-cell_select-after{
       padding-left:0;
     }
    }
  }
</style>

<template>
  <div class="tmap-report">
    <h3>
      地点上报<span style="font-size: 14px;color:red;">（请在地图上点击选取上报点）</span>
      <img src="@/images/close.png" @click="closePop" style="float:right;width:20px;margin-top:3px;" alt="">
    </h3>
    <div style="height:300px;position: relative;margin:10px 0;overflow: hidden;">
      <tianditu style="height:300px;" mapid="reportmap" ref="reportmap"
                layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
                @mapload="mapload"></tianditu>
      <!-- 定位 -->
      <div class="tmap-box" style="top: 5px;position: absolute;right: 5px;" @click="dingwei">
        <img src="@/images/r-3.png" style="width:22px;" alt="">
      </div>
      <!-- 影像和矢量切换 -->
      <div style="position:absolute;left:10px;top:240px;">
        <img v-if="isYingxiang" src="@/images/qiehuan0.png" @click="qiehuan" alt="" width="50">
        <img v-else src="@/images/qiehuan1.png" @click="qiehuan" width="50">
      </div>
    </div>
    <div style=""><!-- height:calc(100% - 290px);overflow: auto; -->
      <group>
        <selector title="类别" v-model="form.type" placeholder="请选择类别"
                  :options="types" :value-map="['code','name']" ></selector>
      </group>
      <!--<div class="y-input required">
        <label for="">类别</label>
        <select v-model="form.type" style="flex:1;margin-left: 16px;border:1px solid #ddd;" placeholder="请选择类别">
          <option value="">请选择类别</option>
          <option :value="i.code" v-for="i in types">{{i.name}}</option>
        </select>
      </div>-->
      <div class="y-input required">
        <label for="">名称</label>
        <input v-model="form.title" type="text" placeholder="请输入地点名称">
      </div>
      <div class="y-input required">
        <label for="">地址</label>
        <input v-model="form.addr" type="text" placeholder="请输入地址">
      </div>
      <div class="y-input">
        <label for="">电话</label>
        <input v-model="form.phone" type="text" placeholder="请输入电话">
      </div>
      <div class="y-input">
        <label for="">照片</label>
        <div>
          <uploader maxUpload="4" @uploadSuccess="uploadSuccess" ref="guidupload"></uploader>
        </div>
      </div>
      <!--<div class="y-input required">
        <label for="">印象标签</label>
        <textarea v-model="form.yinxiang" type="text" placeholder="请输入印象标签"></textarea>
      </div>-->
      <div class="y-input">
        <label for="">详细描述</label>
        <input v-model="form.info" type="text" placeholder="请输入详细描述">
        <!--<textarea v-model="form.info" type="text" placeholder="请输入详细描述"></textarea>-->
      </div>
      <div class="y-input">
        <label for="">上报人电话</label>
        <input type="text" placeholder="请输入您的电话" v-model="form.sphone">
      </div>
    </div>
    <div class="bottom-btn mt10" style="background:#009e60 !important;" @click="submit">提交</div>
    <!--<div class="bottom-btn mt10" @click="closePop" style="background:#eee !important;color:#000;">关闭</div>-->
  </div>
</template>

<script>
  import Tianditu from '@/components/libs/tianditu/main.vue';
  import esriLoader from 'esri-loader';
  import Uploader from '@/components/libs/Uploader/Uploader.vue';
  import Util from '@/libs/util';
  import {Group,Selector} from 'vux';
  export default {
  	props:[],
    components:{
      Tianditu,Uploader,Group,Selector
    },
    beforeDestroy(){
  		this.$refs.reportmap.map.removeAll();
    },
    data(){
  		return {
        url:"/fapi/needlogin/report/",
        chooseAddr:false,
        isYingxiang:false,
        load:false,
        types:[],//类型选择
  			form:{}
      }
    },
    methods:{
    	qiehuan(){
    		if(this.isYingxiang){
          this.$refs.reportmap.zhuantiMap('简约版');
        }else{
          this.$refs.reportmap.yingxiangMap();
        }
        this.isYingxiang = !this.isYingxiang;
      },
    	checkForm(){
        let state = false;
        if(!this.form.title){
          this.$vux.toast.text('请输入名称');
        }else if(!this.form.addr){
          this.$vux.toast.text('请输入地址');
        }else if(!this.form.type){
          this.$vux.toast.text('请选择类型');
        }/*else if(!this.form.yinxiang){
          this.$vux.toast.text('请填写印象标签');
        }*/else if(this.form.phone && !/\d+/.test(this.form.phone)){
          this.$vux.toast.text('电话号码格式不正确');
        }else if(!this.chooseAddr){
          this.$vux.toast.text('请在地图上点击选择地址');
        }else if(this.form.sphone && !/\d+/.test(this.form.sphone)){
          this.$vux.toast.text('上报人电话号码格式不正确');
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
          self.form.lng = self.$refs.reportmap.$data.view.center.x;
          self.form.lat = self.$refs.reportmap.$data.view.center.y;
          self.$vux.loading.show();
          Util.ajax.post(this.url+"add",this.form).then(function(res){
            self.$vux.loading.hide();
          	if(res.data.code==100){
          		//self.$vux.alert.show('感谢您的上报');
				self.$vux.toast.text('感谢您的上报');
              self.$set(self.$data,'form',{});
              self.$refs.guidupload.clearImgList();
              self.load=false;
              self.closePop();
            }else{
          		self.$vux.alert.show(res.data.msg);
            }
          })
      },
      closePop(){
        /*this.$refs.reportmap.$data.view = null;
        this.$refs.reportmap.$data.map.removeAll();*/
        this.$emit('closePop');
      },
      uploadSuccess(imgList){
        console.log(imgList);
        this.$set(this.form,'attachs',imgList);
      },
      mapload(map){
        const self = this;
        const view = self.$refs.reportmap.$data.view;
        this.reportmapClick = this.$refs.reportmap.$data.view.on('click',function (e) {
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
              map.locationLayers.add(picGraphic);
            }
            self.chooseAddr=true;
          });
          //
        });
      },
      dingwei(){
        const wx = this.$wechat;
        const self = this;
        const map = this.$refs.reportmap.$data.map;
        const view = this.$refs.reportmap.$data.view;
        wx.ready(function(){
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
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
                  map.locationLayers.add(picGraphic);
                }
                view.center = [lng,lat];
                self.chooseAddr=true;
              });
            }
          });
        });
      }
    },
    mounted(){
      const self = this;
      Util.dic("SHANGBAO").then(function (response) {
        console.log(response.data.list);
        let arr = [];
        self.$set(self.$data,'types',response.data.list);
      });

      $(".y-input").click(function () {
        console.log('input点击');
        $(this).find('input[type="text"]').focus();
      });
      /*Util.title('上报');
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
