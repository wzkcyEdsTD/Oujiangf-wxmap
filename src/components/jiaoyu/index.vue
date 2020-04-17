<style scoped lang="less">
  @import "index.less";
  @import "../../images/swiper.min.less";
</style>

<template>
  <div id="jiaoyu">
    <!--头部开始-->
    <!--<div class="header2_right">
      <div class="header_search">
        <div class="man">
            <input type="text" v-model="key" class="text" @keyup.enter="searchkey" placeholder="请输入关键字">
            <input type="submit" class="btn" value="" @click="searchkey">
        </div>
      </div>
    </div>-->
    <div class="tmap-search2" >
      <div style="width:30px;">
        <img src="@/img/search_icon.png" style="display: block;margin-top: 6px;margin-left: 8px;" >
      </div>
      <div class="tmap-search-wrap" style="display: flex;flex:1;">
        <!-- 搜索 -->
        <div class="tmap-search-input">
          <!--  -->
          <input id="searchKey" type="text" ref="searchInput" placeholder="请输入关键字" v-model="key"
                 @keyup.enter="searchkey">
          <img src="@/images/clear.png" v-if="key.length" @click="()=>{
            key='';
            $refs.searchInput.focus();
          }" class="clearimg" style="" alt="">
        </div>
      </div>
      <!-- 搜索按钮 -->
      <div @click="searchkey" class="search-btn" >搜索</div>
    </div>

    <!--头部-->
    <!--banner-->
    <div class="top_map">

      <div class="swiper-container" id="swiper2">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="@/img/jy_top_map.jpg" class="ims" alt="" @click="$router.push({name:'xuequfanwei',query:{lid:0}})" style="display: block;"/>
          </div>
          <div class="swiper-slide">
            <img src="@/img/jy2.jpg" class="ims" alt="" @click="$router.push({name:'xuequfanwei',query:{lid:1}})" style="display: block;"/>
          </div>
        </div>
      </div>

    </div>
    <!--banner-->

    <div class="main" v-if="topList && topList.length>0">
      <div class="clear h20"></div>
      <ul class="hbtn">
        <li v-for="(i,idx) in topList" v-if="idx<4" @click="detail(i,topList)">
          <img :src="i.pic" class="pc" alt=""/>
          <div class="t">{{i.name}}</div>
        </li>
      </ul>
      <div class="clear"></div>
      <ul class="hbtn">
        <li v-for="(i,idx) in topList" v-if="idx>=4" @click="detail(i,topList)">
          <img :src="i.pic" class="pc" alt=""/>
          <div class="t">{{i.name}}</div>
        </li>
      </ul>
      <!--<div class="clear h20"></div>-->
    </div>
    <!--  -->
    <div class="ctbg2">
      <div class="map_tit">
        <img src="@/img/ico_map_tit.png" alt=""/>
		  您的位置：所在学区<!--{{lName}}-->
      </div>
    </div>
    <!--  -->
    <div class="main">
      <div class="list_map" style="margin-left:0;">
        <!--<div class="t" style="margin-bottom:0;">当前所在的学区</div>-->
        <div class="s-result_item" v-for="(i,idx) in lData">
          <!-- 点击详情 -->
          <div class="s_result_item-info">
            <div @click="ditu(i)">{{i.attributes.NAME}}</div>
            <div v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
            <div v-if="i.attributes.RANGE || i.attributes.SUMMARY">施教范围：{{i.attributes.RANGE || i.attributes.SUMMARY}}</div>
          </div>
          <!-- 导航 -->
          <div class="s_result_item-icon">
            <img src="@/images/icon-map.png" @click="ditu(i)" />
          </div>
        </div>
        <!--<ul>
          <li v-for="i in lData">
            <div class="info">
              <div class="mp"><img src="@/img/map_ico.png" alt=""/></div>
              <div class="t1"><span>小学：</span>{{i.attributes.NAME}}</div>
              <p>
                距您：1.5km<br/>
                地址：鹿城区百里东路154号<br />
                覆盖小区：{{HOUSE}}
              </p>
              <div class="mu">
                <a href="">市直属</a>
                <a href="">艺术教育</a>
                <a href="">百年名校</a>
                <a href="">外教资源</a>
              </div>
              <a class="more" href="">更多<strong>&gt;</strong></a>
              <div class="clear"></div>
            </div>
          </li>
        </ul>-->
      </div>
    </div>
    <div class="clear h60"></div>
  </div>
</template>

<script>
  import Swiper from 'swiper';
  import esriLoader from 'esri-loader';
  import {dojoConfig,ESRI_URL} from '@/components/libs/tianditu/config';
  import Util from  '@/libs/util';
  export default {
    data:function(){
      return {
      	key:"",
        lName:"",
        lData:[],
        topList:[]
      }
    },
    methods:{
      async init(){
        const self = this;
        self.$vux.loading.show('学区加载中');
        Util.ajax.post('/fapi/public/jiaoyu/option/fl').then(function (response){
        	if(response.data){
          	self.$set(self.$data,'topList',response.data);
          }
        });
        //当前学区
        try{
          await esriLoader.loadScript({ // 加载js
            url: "http://" + ESRI_URL + '/init.js',
            dojoConfig: dojoConfig
          });
        } catch (e){

        }
        const wx = self.$wechat;
        wx.ready(function(){
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            complete:function (res) {
              self.$vux.loading.hide();
              var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              if(lng && lat){
                esriLoader.loadModules([
                  'esri/tasks/support/Query',
                  'esri/tasks/QueryTask',
                  'esri/layers/FeatureLayer',
                  'esri/geometry/Circle',
                  'esri/geometry/Point'
                ]).then(([Query,QueryTask,FeatureLayer,Circle,Point]) => {
                  var queryTask = new QueryTask({
                    url: "https://services.wzmap.gov.cn/server/rest/services/JIAOYUZY/XUEQUFW/MapServer/0"
                  });
                  var query = new Query();
                  query.returnGeometry = true;
                  query.outFields = ["*"];
                  query.start = 0;//开始
                  //query.num = 1;//多少
                  query.geometry = new Circle(new Point({
                    "x" : lng,
                    "y" : lat,
                    "spatialReference" : {
                      wkid: 4326
                    }
                  }), { "radius": 0 });
                  queryTask.execute(query).then(function(results){
                    console.log(results.features);
                    if(results.features.length>0){
                      self.lName = results.features[0].attributes.NAME;
                      self.lData.push(results.features[0]);
                    }
					queryTask.url = "https://services.wzmap.gov.cn/server/rest/services/JIAOYUZY/XUEQUFW/MapServer/1";
					  queryTask.execute(query).then(function(results2){
						  if(results2.features.length>0){
							  self.lData.push(results2.features[0]);
						  }
					  });
				  });
                });
              }else{
              	alert('获取定位超时');
              }
            }
          });
        });
      },
      //顶部专题点击
      detail(i,list){
        this.$router.push({name:"jlist",query:{tab:JSON.stringify(i),list:JSON.stringify(list)}});
      },
      ditu(i){
      	const self = this;
        self.$vux.loading.show();
      	Util.ajax.post('/fapi/public/jiaoyu/option/xuequ2?guid='+i.attributes.FEATUREGUID).then(function (res) {
          self.$vux.loading.hide();
          localStorage.removeItem("infoItem");
          self.$router.push({name:"jmap",query:{guid:res.data.option.featureguid,loadmap:'true'}});//FEAGUID_POING
        });
      },
      searchkey(){
        this.$router.push({name:"jlist",query:{searchkey:this.key}});
      }
    },
    //加载完成
    async mounted(){
      //
      const self = this;
      const wx = this.$wechat;
      const response = await Util.checkLog();
      if(response.data.code!=100){
        Util.login();
      }
      if(!Util.isIOS()){
        Util.ajax.post("/pubApi/auth/jsapk?url=" + encodeURIComponent(location.href)).then(function (data) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: Util.wxconfig.appid, // 必填，公众号的唯一标识
            timestamp: data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
            signature: data.data.signature,// 必填，签名
            jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
          });
        });
      }

      var swiper = new Swiper('.swiper-container',{
        autoplay: 3000
      });

      this.init();
    }
  }
</script>
