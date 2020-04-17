<style lang="less" scoped>
  .tmap-jiucuo{
    padding: 10px;
  }
</style>

<template>
  <div class="tmap-jiucuo">
    <h3>
      纠 错<span style="font-size: 14px;color:red;">（在地图上点击更改标注位置）</span>
      <img src="@/images/close.png" @click="closePop" style="float:right;width:20px;margin-top:3px;" alt="">
    </h3>
    <div style="position: relative;height:300px;margin-top:10px;">
      <tianditu style="height:300px;" mapid="jiucuomap" ref="jiucuo"
                hidetext="true"
                layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
                :centerx="centerx" :centery="centery" :zoom="zoom" @mapload="mapload"></tianditu>
      <!-- 影像和矢量切换 -->
      <div style="position:absolute;left:10px;top:240px;">
        <img v-if="isYingxiang" src="@/images/qiehuan0.png" @click="qiehuan" alt="" width="50">
        <img v-else src="@/images/qiehuan1.png" @click="qiehuan" width="50">
      </div>
    </div>

    <div>
      <div class="y-input">
        <label for="">名称</label>
        <input type="text" placeholder="请输入" v-model="form.name">
      </div>
      <div class="y-input">
        <label for="">纠错人电话</label>
        <input type="text" placeholder="请输入电话" v-model="form.phone">
      </div>
      <div class="y-input">
        <label for="">照片</label>
        <div>
          <uploader maxUpload="10" @uploadSuccess="uploadSuccess" ref="guidupload"></uploader>
        </div>
      </div>
      <div class="y-input required">
        <label for="">详细描述</label>
        <!--<input type="text" placeholder="请输入详细描述" v-model="form.info">-->
        <textarea type="text" placeholder="请输入详细描述" v-model="form.info"></textarea>
      </div>
    </div>
    <div class="bottom-btn mt10" style="background:#009e60 !important;" @click="submit">提交</div>
    <div class="bottom-btn mt10" @click="closePop" style="background:#eee !important;color:#000;">关闭</div>
  </div>
</template>

<script>
  import Tianditu from '@/components/libs/tianditu/main.vue';
  import esriLoader from 'esri-loader';
  import Uploader from '@/components/libs/Uploader/Uploader.vue';
  import Util from '@/libs/util';
  export default {
    props:['centerx','centery','pname','zoom','guid'],
    components:{
      Tianditu,Uploader
    },
    data(){
      return {
        form:{},
        isYingxiang:false,
        load:false
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
      mapload(map){
        const self = this;
        const view = this.$refs.jiucuo.$data.view;
        if(self.centerx && self.centery){
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
              "x" : self.centerx,
              "y" : self.centery,
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
            view.center = [self.centerx,self.centery];
          });
        }

        //点击
        this.jiucuomapClick = this.$refs.jiucuo.$data.view.on('click',function (e) {
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
      checkForm(){
        let state = false;
        if(!this.form.info){
          this.$vux.toast.text('请填写详细描述');
        }else if(!this.guid){
          this.$vux.toast.text('未找到guid');
        }else if(this.form.phone && !/\d+/.test(this.form.phone)){
          this.$vux.toast.text('电话号码格式不正确');
        }else{
        	state = true;
        }
        return state;
      },
      submit(){
      	if(!this.checkForm()){
      		return;
        }
        this.form.guid = this.guid;
      	const self = this;
        if(this.load){
          self.$vux.alert.show('提交中请不要重复点击');
        }
        this.load = true;
        self.$vux.loading.show();
        Util.ajax.post('/fapi/needlogin/jiucuo/add',this.form).then(function (res) {
          self.$vux.loading.hide();
          if(res.data.code==100){
            //self.$vux.alert.show('感谢您的纠错');
			  self.$vux.toast.text('感谢您的纠错');
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
        this.$refs.jiucuo.$data.view = null;
        this.$refs.jiucuo.$data.map.removeAll();
        this.$emit('closePop');
      },
      uploadSuccess(imgList){
        console.log(imgList);
        this.$set(this.form,'attachs',imgList);
      }
    },
    mounted(){
    	if(this.guid){
    		this.form.guid = this.guid;
      }
      //console.log(this.pname);
      if(this.pname){
      	this.$set(this.form,'name',this.pname);
      }
    }
  }
</script>
