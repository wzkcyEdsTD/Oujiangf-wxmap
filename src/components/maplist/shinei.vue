<style lang="less">
  @import "../home/home.less";
</style>

<template>
  <div class="main" style="width:100%;height:100%;">
    <!-- 地图 -->
    <tianditu @mapload="mapload"
              @change2D3D="change2D3D"
              @searchInfoClick="searchInfoClick"
              @shineiLoad="shineiLoad"
              @shineiClick="shineiClick"
              @hideShinei="hideShinei"
              @quanjingClick="quanjingClick"
              :centerx="lng"
              :centery="lat"
              :zoom="zoom"
              :isshinei=true
              :loading=true
              layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
              ref="map" mapid="map"></tianditu>
    <!-- 固定顶部其他 -->
    <div class="tmap-fixed">
      <div class="mt10">
        <!-- 左侧工具 -->
        <div class="tmap-left-tools" v-if="!is3D">
          <!--<div class="tmap-tools tmap-box">
            <div @click="toolshow=!toolshow">
              <img src="@/images/l-1.png" alt="">
              <div>工具</div>
            </div>
            &lt;!&ndash; 工具展开 &ndash;&gt;
            <div class="tmap-tools-open" v-if="toolshow">
              <div class="tmap-tools_1 tmap-box" :class="cejuShow?'on':''" @click="ceju">
                <img v-if="cejuShow" src="@/images/t-5o.png" alt="">
                <img v-else src="@/images/t-5.png" alt="">
                <div>测量距离</div>
              </div>
              <div class="tmap-tools_2 tmap-box" :class="cemianShow?'on':''" @click="cemian">
                <img v-if="cemianShow" src="@/images/t-2o.png" alt="">
                <img v-else src="@/images/t-2.png" alt="">
                <div>测量面积</div>
              </div>
              <div class="tmap-tools_3 tmap-box" :class="juliShow?'on':''" @click="shishijuli">
                <img v-if="juliShow" src="@/images/t-4o.png" alt="">
                <img v-else src="@/images/t-4.png" alt="">
                <div>实时距离</div>
              </div>
              <div class="tmap-tools_4 tmap-box" @click="shiqu" :class="shiquShow?'on':''">
                <img v-if="shiquShow" src="@/images/t-1o.png" alt="">
                <img v-else src="@/images/t-1.png" alt="">
                <div>拾取坐标</div>
              </div>
              <div class="tmap-tools_5 tmap-box" @click="huixian" :class="huixianShow?'on':''">
                <img v-if="huixianShow" src="@/images/huixian1.png" alt="">
                <img v-else src="@/images/huixian.png" alt="">
                <div><span style="opacity: 0">线</span>绘线<span style="opacity: 0">线</span></div>
              </div>
              <div class="tmap-tools_6 tmap-box" @click="huimian" :class="huimianShow?'on':''">
                <img v-if="huimianShow" src="@/images/huimian1.png" alt="">
                <img v-else src="@/images/huimian.png" alt="">
                <div><span style="opacity: 0">线</span>绘面<span style="opacity: 0">线</span></div>
              </div>
              <div class="tmap-tools_7 tmap-box" @click="qingchu(true)">
                <img src="@/images/t-3.png" alt="">
                <div>图层清除</div>
              </div>
              <div class="tmap-tools_8 tmap-box" @click="fenxiangShow=true">
                <img src="@/images/fenxiang.png" alt="">
                <div><span style="opacity: 0">线</span>分享<span style="opacity: 0">线</span></div>
              </div>
            </div>
          </div>-->
          <!-- 室内楼层 -->
          <div class="tmap-zhoubian tmap-box mt10 louceng-list" v-if="shinei.show">
            <div v-for="(i,idx) in shinei.louceng"
                 :class="{'louceng':idx==shinei.idx}"
                 @click="loucengChange(i,idx)">{{i.name}}</div>
          </div>
        </div>
        <!-- 右侧周边 -->
        <div class="tmap-right-tools">
          <div class="tmap-zhoubian tmap-box mt10">
            <!--<div @click="shangbaoPop.show=true">
              <img src="@/images/r-2.png" alt="">
              <div>上报</div>
            </div>-->
          </div>
        </div>
        <!--  -->
      </div>
    </div>
    <!-- 固定尾部 -->
    <div class="tmap-fixed-bottom" v-if="shiquShow || juliShow">
      <div class="tool-info" v-if="shiquShow">
        <template v-if="shiquLocation">经度：{{shiquLocation.lng}}&nbsp;&nbsp;纬度：{{shiquLocation.lat}}</template>
        <template v-else>点击地图获取坐标</template>
      </div>
      <div class="tool-info" v-else-if="juliShow">
        <template v-if="juliInfo">{{juliInfo}}米</template>
        <template v-else>点击地图计算距离</template>
      </div>
    </div>
    <!-- 周边 -->
    <popup v-model="zhoubianPop.show" position="left" height="100%" width="100%" style="z-index:999;" :show-mask="false">
      <zhoubian v-if="zhoubianPop.load" @closePop="closePop"
                @zhoubianDetail="(ii,list)=>{zhoubianPop.show=false;searchpoi(true,ii.serviceurl,ii.tag?ii.tag:ii.name,list,false,true)}"></zhoubian>
    </popup>
    <!-- 上报 -->
    <popup v-model="shangbaoPop.show" height="100%" :show-mask="false" @on-first-show="firstShow" id="pop">
      <shangbao-form @closePop="closePop()" v-if="shangbaoPop.show"></shangbao-form>
    </popup>
    <!-- 搜索结果 -->
    <popup v-model="searchMap.page.show" height="80%" id="searchRes" :show-mask="false"
           style="height:calc(100% - 51px);padding: 0 10px;width: calc(100% - 40px);border-radius: 5px;left: 10px;">
      <!-- 顶部关闭 -->
      <div class="tmap-search-tool">
        <img src="@/images/down10.png" @click="searchMap.page.show=false" alt="">
        <img src="@/images/close.png" @click="searchMap.page.show=false;searchMap.page.data = [];zhuantiClear();" class="cls" alt="">
      </div>
      <!-- 同组按钮 -->
      <tab v-if="searchMap.page.show && searchMap.tongzuList && searchMap.tongzuList.length>0" >
        <tab-item v-for="i in searchMap.tongzuList" :selected="i.tag==searchMap.tag"
                  @click.native="searchpoi(true,i.serviceurl?i.serviceurl:searchMap.url,i.tag?i.tag:i.name,searchMap.tongzuList,i.iszhuanti,i.iszhoubian,i.pic || i.icon || '')"
                  style="flex: none;padding: 0 10px;width:auto;">
          {{i.name}}
        </tab-item>
      </tab>
      <!-- 筛选列表 -->
      <div class="shaixuan">
        <div :class="searchMap.shaixuan.on2?'':'on'" @click="julipaixu">
          <img src="@/img/ico_lm.png" v-if="searchMap.shaixuan.on2">
          <img src="@/img/ico_lm_ov.png" v-else alt="">热门
        </div>
        <div :class="searchMap.shaixuan.on2?'on':''" @click="julipaixu">
          <img src="@/img/ico_jl.png" v-if="!searchMap.shaixuan.on2">
          <img src="@/img/ico_jl_ov.png" v-else alt="">距离
        </div>
      </div>
      <!-- 搜索列表 -->
      <div class="tmap-search-result" style="height:calc(100% - 128px);overflow:auto;">
        <div class="s-result_item" v-for="(i,idx) in searchMap.page.data">
          <!-- 点击详情 -->
          <div class="s_result_item-info" @click="searchInfo(i)">
            <div>{{i.attributes.NAME}}</div>
            <div class="info" v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
            <div class="info" v-if="i.attributes.juli">距离：{{i.attributes.juli}}km</div>
            <!-- 标签 -->
            <!--<div v-if="i.attributes.TAG" class="item-tag-list">
              <span v-for="ii in (i.attributes.TAG).split(',')" class="item-tag">{{ii}}</span>
            </div>-->
          </div>
          <!-- 导航 -->
          <div class="s_result_item-icon">
            <img src="@/images/i-daohang.png" @click="openLocation(i.attributes.CENTERX,i.attributes.CENTERY,i.attributes.NAME,i.attributes.ADDRESS,'')" alt="">
          </div>
        </div>
        <!-- 更多 -->
        <div class="bottom-btn" style="text-align: center" v-if="searchMap.page.loadmore"
             @click="searchpoi(false,searchMap.url,searchMap.tag,searchMap.tongzuList)">更多</div>
        <div style="text-align: center;color:#666;margin-top:10px;" v-else>没有更多了</div>
      </div>
    </popup>

    <!-- 底部多少条 -->
    <div v-if="!searchMap.page.show && searchMap.page.data && searchMap.page.data.length && searchMap.count"
         @click.sync="searchMap.page.show=true"
         style="position:fixed;bottom:0;height:36px;line-height:36px;background:#fff;z-index:1;width:100%;text-align: center;">
      在<b class="on">{{searchMap.key || searchMap.tag}}</b>找到<b class="on">{{searchMap.count}}</b>条记录
    </div>
    <!-- 详细信息 -->
    <popup v-model="infoPop.show" :show-mask="false"
           style="max-height:calc(100% - 100px);padding: 0 10px;width:100%;box-sizing: border-box;z-index:400;">
      <div class="info-pop">
        <!-- 顶部关闭 -->
        <div class="info-pop-tool">
          <img v-show="!infoPop.iscollect && !searchMap.hideReturn" src="@/images/back.png" @click="infoPop.show=false;searchMap.page.show=true;" class="rtn" alt="">
          <!--  -->
          <img v-if="infoPop.simple" src="@/images/up10.png" @click="Xiangxi" alt="">
          <img v-else src="@/images/down10.png" @click="infoPop.simple = true" alt="">
          <!--  -->
          <img src="@/images/close.png" @click="infoPop.show=false" class="cls" alt="">
        </div>
        <!-- 详细 -->
        <div class="info-pop-con">
          <div style="overflow:hidden;position: relative">
            <div style="float:left;width:68%">
              <div class="info-pop_tit">{{infoPop.info.NAME || infoPop.info['名称']}}</div>
              <div class="info-pop_info">
                <div v-if="infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
                <div v-if="infoPop.info.ADDRESS">地址：{{infoPop.info.ADDRESS}}</div>
                <div v-if="infoPop.info.PHONE"><a class="on" style="text-decoration: underline;" :href="'tel:'+infoPop.info.PHONE">电话：{{infoPop.info.PHONE}}</a></div>
              </div>
            </div>
            <div class="bt_mp" style="bottom:13px;" v-if="infoPop.info.ADDRESS" @click="Xiangxi">展开详细</div>
          </div>
          <div class="map_btn" style="margin-top:15px;">
            <a class="on" @click="zhoubianPop.show=true;zhoubianPop.load=true;
            zhoubianPop.lng=infoPop.info.CENTERX;zhoubianPop.lat=infoPop.info.CENTERY">周边</a>
            <a @click="shoucang" :class="(infoPop.info.collect && infoPop.info.collect.id)?'on':''">
              {{(infoPop.info.collect && infoPop.info.collect.id)?'已收藏':'收藏'}}
            </a>
            <a class="on" @click="jiucuoPop.guid=infoPop.info.FEATUREGUID;
                          jiucuoPop.centerx=infoPop.info.CENTERX;
                          jiucuoPop.centery=infoPop.info.CENTERY;
                          jiucuoPop.name=infoPop.info.NAME;
                          jiucuoPop.zoom=$refs.map.$data.view.zoom;
                          jiucuoPop.show=true;">纠错</a>
            <a class="on" @click="openLocation(infoPop.info.CENTERX,infoPop.info.CENTERY,infoPop.info.NAME,infoPop.info.ADDRESS,'')">导航</a>
            <a :class="quanjingPop.url?'on':''" @click="findQuanjing">全景</a>
            <a class="on" @click="guidPop.show=true;guidPop.form.guid=infoPop.info.FEATUREGUID">传图</a>
          </div>
        </div>
      </div>
    </popup>
    <!-- 详细 -->
    <popup v-model="!infoPop.simple" height="100%" position="bottom" :show-mask="false">
      <t-content :conData="infoPop.info"
                 :view="$refs.map.$data.view"
                 :map="$refs.map.$data.map"
                 v-if="!infoPop.simple"
                 @closePop="infoPop.simple=true"
                 @zhoubian="zhoubianPop.show=true;zhoubianPop.load=true;
                      zhoubianPop.lng=infoPop.info.CENTERX;zhoubianPop.lat=infoPop.info.CENTERY"
                 @shoucang="shoucang"
                 @jiucuo="()=>{
                        jiucuoPop.guid=infoPop.info.FEATUREGUID;
                        jiucuoPop.centerx=infoPop.info.CENTERX;
                        jiucuoPop.centery=infoPop.info.CENTERY;
                        jiucuoPop.name=infoPop.info.NAME;
                        jiucuoPop.zoom=$refs.map.$data.view.zoom;
                        jiucuoPop.show=true;
                      }"
                 @guidUpload="()=>{guidPop.show=true;guidPop.form.guid=infoPop.info.FEATUREGUID}"
                 @findQuanjing="findQuanjing"></t-content>
    </popup>
    <!-- guid上传图片 -->
    <popup v-model="guidPop.show" style="z-index: 999;" position="bottom" width="100%" height="100%" :show-mask="false">
      <div class="y-input">
        <label >照片</label>
        <div>
          <uploader maxUpload="10" @uploadSuccess="uploadSuccess" ref="guidupload"></uploader>
        </div>
      </div>
      <div class="bottom-btn" @click="guidUpload">上传</div>
      <div class="bottom-btn mt10" @click="guidPop.show=false" style="background:#eee !important;color:#000;">关闭</div>
    </popup>
    <!-- 纠错 -->
    <popup v-model="jiucuoPop.show" style="z-index:999" height="100%" :show-mask="false">
      <jiucuo-form v-if="jiucuoPop.show"
                   :centerx="jiucuoPop.centerx" :centery="jiucuoPop.centery" :pname="jiucuoPop.name" :zoom="jiucuoPop.zoom"
                   :guid="jiucuoPop.guid"
                   @closePop="jiucuoPop.show=false;"></jiucuo-form>
    </popup>
    <!-- 全景pop -->
    <popup v-model="quanjingPop.show" position="right" width="100%" height="100%" :show-mask="false">
      <iframe v-if="quanjingPop.show" :src="quanjingPop.url" frameborder="0"
              style="width:100%;height:calc(100% - 45px);display:block;"></iframe>
      <div class="bottom-btn" @click="quanjingPop.show=false;">关闭</div>
    </popup>
    <!-- 分享Show -->
    <div style="background:rgba(0,0,0,0.6);position: fixed;left:0;top:0;height:100%;width:100%;z-index:9999;"
         v-if="fenxiangShow" @click="fenxiangShow=false">
      <img src="@/images/share.png" style="width:100%" alt="">
    </div>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import Tianditu from '@/components/libs/tianditu/main';
  import Uploader from '@/components/libs/Uploader/Uploader';
  import MapUtil from '@/components/libs/tianditu/util';
  import {Popup,Tab, TabItem} from 'vux';
  import PAddr from '@/components/personal/addr/form';
  import Zhoubian from '@/components/map/zhoubian';
  import ShangbaoForm from '@/components/personal/shangbao/form.vue';//上报
  import JiucuoForm from '@/components/personal/jiucuo/form.vue';//纠错
  import TContent from '@/components/home/listView';
  import SearchData from '@/datas/search.json';
  export default {
    components: {
      Tianditu,Popup,ShangbaoForm,JiucuoForm,Zhoubian,Uploader
      ,Tab,TabItem,PAddr,TContent
    },
    data () {
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
        shinei:{
          load:false,
          show:false,
          showEvent:null,
          clickEvent:null,
          imgurl:"https://portal.wzdmdz.com/原图/室内地图/",
          name:"",
          louceng:[],//楼层
          shangpu:{},//商铺信息
          shangpuShow:false,
          shangpuSimple:true,//简要显示
          idx:0
        },
        juliShow:false,
        juliClick:null,
        juliInfo:"",
        shiquShow:false,//拾取
        shiquClick:null,
        quanjingShow:false,
        shiquLocation:null,//拾取坐标
        draw:null,
        view:null,
        is3D:false,
        mapLocation:{},
        mapCenter:[],
        searchMap:{
          count:0,
          shaixuan:{
            on2:false
          },
          hideReturn:false,
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
          tongzuList:[]//同组
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
        toolshow:false
      }
    },
    computed:{
      wxuser(){
        return  this.$store.getters.wxuser;
      }
    },
    methods: {
      firstShow(){

      },
      focusout(){
        const self = this;
        setTimeout(function(){
          self.searchMap.show=false
        },100);
      },
      mapload(map,view){
        const self = this;
        self.maploading = true;
        console.log('mapload');
        //室内地图
        this.$refs.map.shinei(map,view);
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
        const map = this.$refs.map.$data.map;
        const view = this.$refs.map.$data.view;
        /*if(map.wxlocationLayer!=null){
         map.wxlocationLayer.removeAll();
         }*/
        if(map.locationLayers!=null){
          map.locationLayers.removeAll();
        }
        if(map.findLayerById('shiquLayer')!=null){
          map.remove(map.findLayerById('shiquLayer'));
        }
        if(map.findLayerById('zhuantilayer')!=null && state){
          map.remove(map.findLayerById('zhuantilayer'));
        }
        if(map.findLayerById('dingwei')!=null){
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
                  'esri/geometry/Point',
                  'esri/layers/GraphicsLayer',
                  'esri/Graphic'
                ]).then(([Point,GraphicsLayer,Graphic])=>{
                  var symbol = {
                    type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                    url: "images/location.png",
                    width: "50px",
                    height: "50px"
                  };
                  const map = self.$refs.map.$data.map;
                  var point = new Point({
                    "x" : lng,
                    "y" : lat,
                    "spatialReference" : map.spatialReference
                  });
                  var picGraphic = new Graphic(point, symbol);
                  if (map.findLayerById('dingwei')!=null) {
                    map.remove(map.findLayerById('dingwei'));
                  }
                  var locationLayer = new GraphicsLayer({
                    id:"dingwei"
                  });
                  locationLayer.add(picGraphic);
                  map.add(locationLayer);
                  self.$refs.map.$data.view.center = [lng,lat];
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
      //搜索
      searchpoi(flush,url,tag,list,iszhuanti,iszhoubian,pic){
        //console.log(tag);
        if(!this.searchMap.key && !tag && url!='https://services.wzmap.gov.cn/server/rest/services/TDT/JCQ/MapServer/0'){
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
        }else{
          this.searchMap.page.pageNum++;
          this.searchMap.page.start = this.searchMap.page.start+this.searchMap.page.pageSize;
        }
        this.infoPop.show=false;
        this.infoPop.simple=true;
        self.$vux.loading.show('搜索中');

        let querywhere = "";
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/geometry/Polyline",
          "esri/geometry/geometryEngine",
          'esri/geometry/Circle',
          'esri/geometry/Point'
        ]).then(([QueryTask,Query,Polyline,geometryEngine,Circle,Point]) => {
          var layerurl2 = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
          var layerurl ="https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/1";
          //var layerurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/QUANJING/MapServer/1";
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
          const view = self.$refs.map.$data.view;
          view.graphics.removeAll();
          const map = self.$refs.map.$data.map;
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.start = self.searchMap.page.start;//开始
          query.num = self.searchMap.page.pageSize;//多少
          //query.where = " ( NAME LIKE '%"+key+"%' OR ADDRESS LIKE '%"+key+"%' ) ";//AND FSCALE<="+view.zoom  // Return all cities with a population greater than 1 million
          query.where = " ( NAME LIKE '%"+key+"%' OR ADDRESS LIKE '%"+key+"%' ) ";//AND FSCALE<="+view.zoom  // Return all cities with a population greater than 1 million
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
          //周边2公里
          if(iszhoubian){
            var geo = new Circle(new Point({
              "x" : self.zhoubianPop.lng?self.zhoubianPop.lng:(self.mapLocation.lng?self.mapLocation.lng:view.center.x),
              "y" : self.zhoubianPop.lat?self.zhoubianPop.lat:(self.mapLocation.lat?self.mapLocation.lat:view.center.y),
              "spatialReference" : map.spatialReference
            }), { "radius": 2000 });
            query.geometry = geo;
            self.$set(self.searchMap,'iszhoubian',true);
          }else{
            self.$set(self.searchMap,'iszhoubian',false);
          }
          query.orderByFields = ["HOTSPOT DESC"];
          if(!url){
            query.orderByFields = ["FEATUREGUID DESC"];
          }
          if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
            query.orderByFields = ["tdt.DBO.教育.HOTSPOT DESC"];
          }
          if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/JCQ/MapServer/0'){
            query.orderByFields = [];
            query.where = '1=1';
            /*query.start = null;
             query.num = null;*/
          }
          // When resolved, returns features and graphics that satisfy the query.
          querywhere = query.where;
          //是否关键字搜索
          if(!url){
          }
          //else{
          queryTask.execute(query).then(function(results){
            //console.log(results.features);
            if(results.features && results.features.length==self.searchMap.page.pageSize){
              self.searchMap.page.loadmore = true;
            }else{
              self.searchMap.page.loadmore = false;
            }
            results.features.forEach(function (poi) {
              if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
                poi.attributes = JSON.parse(JSON.stringify(poi.attributes).replace(/tdt\.DBO\.教育\./gi,''));
              }
              if(poi.attributes.FNAME && !poi.attributes.NAME){
                poi.attributes.NAME = poi.attributes.FNAME;
              }
              if(poi.attributes.secondCheck==1){
                console.log(poi);
              }
              var arr;
              //距离
              try{
                if(poi.attributes.CENTERX){
                  arr = [poi.attributes.CENTERX,poi.attributes.CENTERY];
                }else if(poi.geometry && poi.geometry.x && poi.geometry.y){
                  poi.attributes.CENTERX = poi.geometry.x;
                  poi.attributes.CENTERY = poi.geometry.y;
                  arr = [poi.geometry.x,poi.geometry.y];
                }
                if(arr){
                  console.log(self.zhoubianPop.lng+"_"+self.zhoubianPop.lat);
                  var po = new Polyline({
                    paths: [[self.zhoubianPop.lng || self.mapLocation.lng || view.center.x,self.zhoubianPop.lat || self.mapLocation.lat || view.center.y],arr],
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
            //专题绘制
            if(map.findLayerById('zhuantilayer')){
              map.remove(map.findLayerById('zhuantilayer'));
            }
            if(iszhuanti){
              esriLoader.loadModules([
                "esri/layers/FeatureLayer"
              ]).then(([FeatureLayer]) => {
                console.log(pic);
                let renderer = {
                  type: "simple",  // autocasts as new SimpleRenderer()
                  symbol: {
                    type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                    url: /.*?(jpg|png)/.test(pic) ? pic : "/室内地图图标/default.png",
                    width: "20px",
                    height: "20px"
                  }
                };
                //线
                if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/11'){
                  renderer = {
                    type: "simple",
                    symbol:{
                      type: "simple-line", // autocasts as new SimpleLineSymbol()
                      color: "#009e60",
                      width: "3px",
                      style: "solid"
                    }
                  }
                }
                //面
                if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/JCQ/MapServer/0'){
                  renderer = {
                    type: "simple",
                    symbol:{
                      type: "simple-fill", // autocasts as SimpleFillSymbol
                      color: [0, 158, 96, 0.4],
                      style: "solid",
                      outline: { // autocasts as SimpleLineSymbol
                        color: [255, 255, 255],
                        width: 1
                      }
                    }
                  }
                }
                var featurelayer = new FeatureLayer(url,{
                  outFields: ["*"],
                  id:'zhuantilayer',
                  renderer:renderer,
                  definitionExpression:querywhere
                });
                map.add(featurelayer);
              });
            }
            /*self.searchMap.page.data.sort(function (a,b) {
             return a.attributes.juli-b.attributes.juli;//距离由近到远
             })*/
            self.searchMap.page.show = !iszhuanti;
            self.searchMap.show=false;
            self.infoPop.show=false;
            self.infoPop.iscollect=false;
            self.searchMap.shaixuan.on2 = false;//距离排序
            self.$vux.loading.hide();
          });
          //}

        });
      },
      searchShowInMap(obj){
        console.log(obj);
      },
      Xiangxi(){
        /*const imgList = this.infoPop.info.imgList;
         if(imgList && imgList.length && imgList.length>0){*/
        if(this.infoPop.info.ADDRESS){
          this.infoPop.simple = false;
        }else{
          this.$vux.toast.text('没有更多详细了');
        }
      },
      zhuantiClear(){
        const map = this.$refs.map.$data.map;
        if(map.findLayerById('zhuantilayer')){
          map.remove(map.findLayerById('zhuantilayer'));
        }
        console.log(this.$refs);
        this.$refs.zhuanti.clearZt();
      },
      //搜索详细
      async searchInfo(obj,hideReturn,showIcon){
        console.log(obj);
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
          var prefix = "";
          if(url=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
            prefix = 'tdt.DBO.教育.';
          }
          q.where = prefix+"FEATUREGUID='"+obj.attributes.FEATUREGUID+"'";
          const objResult = await t.execute(q);
          this.$vux.loading.hide();
          if(objResult.features[0]){
            obj = objResult.features[0];
          }
        }


        obj.attributes = JSON.parse(JSON.stringify(obj.attributes).replace(/tdt\.DBO\..*?\.|tdt.dbo.t_base_photo\./gi,''));
        const self = this;
        this.searchMap.hideReturn = hideReturn;
        this.searchMap.page.show = false;
        this.infoPop.show=true;
        self.$set(self.quanjingPop,'url','');
        const map = this.$refs.map.$data.map;
        const view = this.$refs.map.$data.view;
        if(view.popup){
          view.popup.close();
        }
        //console.log(JSON.stringify(obj.attributes));
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
        if(obj.attributes.CENTERX){
          view.center = [obj.attributes.CENTERX,obj.attributes.CENTERY];
        }
        if(obj.geometry && (obj.geometry.x || obj.geometry.y) && (!hideReturn || (hideReturn && showIcon))){
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
        if(obj.geometry && (obj.geometry.paths || obj.geometry.rings)){
          view.extent = obj.geometry.extent;
        }
        if(obj.geometry && obj.geometry.paths){
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
                color: '#00ffff',//009e60
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
            //view.center = obj.geometry.paths[0][0];
          });
        }
        //绘面
        if(obj.geometry && obj.geometry.rings){
          console.log('绘面');
          esriLoader.loadModules([
            "esri/Graphic",
            "esri/geometry/Polygon"
          ])
          .then(([Graphic, Polygon]) => {
            var lines = new Polygon({
              rings: obj.geometry.rings,
              spatialReference: view.spatialReference
            });
            var graphic = new Graphic({
              geometry: lines,
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol
                color: [76, 116, 255, 0.4],//0, 158, 96
                style: "solid",
                outline: { // autocasts as SimpleLineSymbol
                  color: [255, 255, 255],
                  width: 1
                }
              }
            });
            view.graphics.add(graphic);
            //view.center = obj.geometry.rings[0][0];
          });
        }
      },
      searchInfoClick(){
        if(!this.infoPop.show){
          this.infoPop.show=true;
        }
      },
      quanjingOpen(url){
        this.quanjingPop.show = true;
        this.quanjingPop.url = url;
      },
      quanjingClick(graphic){
        console.log(graphic);
        console.log('全景点击');
      },
      //全景
      quanjing(){
        const self = this;
        const map = this.$refs.map.$data.map;
        if(map.findLayerById('quanjing')!=null){
          self.quanjingShow = !self.quanjingShow;
          map.findLayerById('quanjing').visible = self.quanjingShow;
          //map.remove('quanjing');
          return;
        }
        self.quanjingShow=true;
        self.$vux.loading.show('全景加载中');
        var url = 'https://services.wzmap.gov.cn/server/rest/services/TDT/QUANJING/MapServer/0';
        var sqlwhere = " VR <> '' ";
        //FSCALE
        esriLoader.loadModules([
          'esri/tasks/support/Query',
          'esri/tasks/QueryTask',
          'esri/layers/FeatureLayer'
        ]).then(([Query,QueryTask,FeatureLayer])=>{
          var PopInit = async function(feature){
            var str = '';
            //data-layer-id="quanjing"
            if(feature.graphic.attributes.FEATUREGUID){
              self.$vux.loading.show();
              const response = await Util.ajax.post('/pubApi/wzmap/vrimg?guid='+feature.graphic.attributes.FEATUREGUID);
              self.$vux.loading.hide();
              if(response.data){
                str += "<a class='quanjingOpen' onclick='' data-url='"+response.data.link+"' style='display:block;text-align:center;' >" +
                  "<img src='"+response.data.spic+"'></a>";
                str += "<a class='quanjingOpen' onclick='' data-url='"+response.data.link+"' style='display:block;text-align:center;' >查看全景</a>";
              }else{
                str='暂无内容'
              }
            }
            return str;
          }
          var quanjingLayer = new FeatureLayer(url,{
            //mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            id:'quanjing',
            definitionExpression: sqlwhere,
            popupEnabled:true,
            popupTemplate: {
              //width:200,
              overwriteActions: true,
              title: "{NAME}",
              content: PopInit,
            }
          });
          quanjingLayer.renderer = {
            type: "simple",  // autocasts as new SimpleRenderer()
            symbol: {
              type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
              url: "/images/r-4.png",
              width: "15px",
              height: "18px"
            }
          };
          quanjingLayer.on('layerview-create',function () {
            self.$vux.loading.hide();
          });
          map.add(quanjingLayer);
        });
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
      //（显示在地图）
      collectDetail(collect){
        const self = this;
        self.personPop.show=false;
        self.collectPop.show=false;
        const map = this.$refs.map.$data.map;
        const view = this.$refs.map.$data.view;
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
              width: "20px",
              height: "20px"
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
      },
      findQuanjing(){
        const self = this;
        if(self.quanjingPop.url){
          self.quanjingPop.show = true;
        }else{
          self.$vux.toast.text('未找到全景');
        }
      },
      //
      change2D3D(is3D){
        this.is3D = is3D;
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
            scale: self.$refs.map.$data.view.zoom, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: url // 在查看位置界面底部显示的超链接,可点击跳转
          });
        });
      },
      //室内楼层加载
      shineiLoad(louceng,name){
        this.$set(this.shinei,'louceng',louceng);
        const self = this;
        louceng.forEach(function(l,idx){
          if(l.name=='L1'){
            self.shinei.idx = idx;
          }
        })
        this.shinei.name = name;
        console.log(name);
        this.shinei.show = true;
      },
      //楼层点击
      loucengChange(i,idx){
        this.shinei.idx = idx;
        this.$refs.map.louceng(i.url1,i.url2,i.name);
      },
      //商铺点击
      shineiClick(graphic){
        console.log(graphic);
        this.searchInfo(graphic,true,true);
      },
      //室内详细
      shangpuXiangxi(){
        //获取图片
        const self = this;
        if(!self.shinei.shangpu.load){
          self.$vux.loading.show();
          Util.ajax.post('/pubApi/wzmap/shineiimg?guid='+self.shinei.shangpu.FEATUREGUID).then(function (response) {
            self.$vux.loading.hide();
            if(response.data.code==100 && response.data.list && response.data.list.length>0){
              self.$set(self.shinei.shangpu,'imgList',response.data.list);
              self.shinei.shangpuSimple = false;
              self.$set(self.shinei.shangpu,'load',true);
            }else{
              self.$vux.toast.text('没有更多了');
            }
          });
        }else if(self.shinei.shangpu.imgList){
          self.shinei.shangpuSimple = false;
        }else{
          self.$vux.toast.text('没有更多了');
        }
      },
      //室内隐藏
      hideShinei(){
        this.shinei.show = false;
      },
      //专题
      zhuantiShow(){

      },
      //预览图片
      previewImage(url){
        this.$wechat.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url] // 需要预览的图片http链接列表
        })
      },
      closePop(){
        this.zhoubianPop.show=false;
        this.collectPop.show=false;
        this.addrPop.show=false;
        this.paddrPop.show=false;
        this.jiucuoPop.show=false;
        this.myshangbaoPop.show=false;
        this.shangbaoPop.show=false;
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
      }
    },
    async created(){
      const self = this;
      if(this.$route.query){
        //console.log(this.$route.query);
        if(this.$route.query.lng){
          this.lng = this.$route.query.lng;
        }
        if(this.$route.query.lat){
          this.lat = this.$route.query.lat;
        }
        if(this.$route.query.zoom){
          this.zoom = this.$route.query.zoom;
        }
      }
    }
  }
</script>
