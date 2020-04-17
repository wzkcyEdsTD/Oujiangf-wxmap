<style scoped lang="less">
  @import "index.less";
  @import "../../images/swiper.min.less";
</style>

<template>
  <div id="nongye">
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
    <div class="ly_top_map">
      <img src="@/img/ly_top_map.jpg" @click="$router.push({name:'daolan-yj'})" class="ims" alt=""/>
    </div>
    <!--banner-->
    <div class="main">
      <div class="clear h20"></div>
      <ul class="hbtn">
        <template v-for="(i,idx) in itemList">
          <li v-if="idx<4" @click="detail(i,itemList)">
            <img :src="i.pic" class="pc" alt=""/>
            <div class="t">{{i.name}}</div>
          </li>
        </template>
      </ul>
      <div class="clear"></div>
      <ul class="hbtn">
        <template v-for="(i,idx) in itemList">
          <li v-if="idx>=4" @click="detail(i,itemList)">
            <img :src="i.pic" class="pc" alt=""/>
            <div class="t">{{i.name}}</div>
          </li>
        </template>
      </ul>
      <div class="clear h20"></div>
      <div class="ly_ctit">
        <img src="@/img/ly_xctt_tit.jpg" alt=""/>
      </div>
      <div class="clear"></div>
      <div class="list_xc">
        <ul>
          <li v-for="(i,idx) in redianList" v-if="idx<2" @click="newsDetail(i)">
            <div class="info">
              <a>{{i.title}}</a><br/>
              <div>{{i.summary}}</div>
              <span>{{i.showtime|dateFormat}}    <span style="color: #fa9b13;">【NEW】</span></span>
            </div>
            <div class="pc"><img :src="i.pic" class="ims" alt=""/></div>
          </li>
        </ul>
      </div>
      <div class="mhms_more"><a @click="$router.push({name:'nongyeList'})">更多乡村头条></a> </div>
      <div class="clear h20"></div>

      <div class="ly_ctit">
        <img src="@/img/ly_xczty_tit.jpg" alt=""/>
      </div>

    </div>
    <!-- ly_banner2 -->
    <div class="xczt_banner">
      <div class="swiper-container" id="swiper2">
        <div class="swiper-wrapper">
          <div class="swiper-slide" style="box-sizing: border-box;padding:0 10px;"
               @click="$router.push({name:'nongyeMap',query:{'guid':'32a13250c3464277aaed9784acdb9742'}})">
            <img src="@/img/s1.jpg" class="ims">
          </div>
          <div class="swiper-slide" style="box-sizing: border-box;padding:0 10px;"
               @click="$router.push({name:'nongyeMap',query:{'guid':'73cf9ad447194df5908289e72de649bd'}})">
            <img src="@/img/s2.jpg" class="ims">
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <!--  -->
      <div class="shiling">
        <img @click="detail(shilingList[0],shilingList)" src="@/images/ni-1.jpg" alt="">
        <img @click="detail(shilingList[1],shilingList)" src="@/images/ni-2.jpg" alt="">
        <img @click="detail(shilingList[2],shilingList)" src="@/images/ni-3.jpg" alt="">
        <img @click="detail(shilingList[3],shilingList)" src="@/images/ni-4.jpg" alt="">
        <img @click="detail(shilingList[4],shilingList)" src="@/images/ni-5.jpg" alt="">
        <img @click="detail(shilingList[5],shilingList)" src="@/images/ni-6.jpg" alt="">
        <img @click="detail(shilingList[6],shilingList)" src="@/images/ni-7.jpg" alt="">
        <img @click="detail(shilingList[7],shilingList)" src="@/images/ni-8.jpg" alt="">
      </div>
    </div>
    <div class="main">
      <div class="clear h20"></div>
      <!-- 舌尖上的乡村 -->
      <div class="ly_ctit">
        <img src="@/img/ly_sjsdxc_tit.jpg" alt=""/>
      </div>
      <div class="xczt_bt">
        <ul>
          <li @click="detail(tuijianList[0],tuijianList)"><img src="@/img/ly_sjsdxc_pic01.jpg" class="ims" alt="" /></li>
          <li @click="detail(tuijianList[1],tuijianList)"><img src="@/img/ly_sjsdxc_pic02.jpg" class="ims" alt="" /></li>
          <li @click="detail(tuijianList[2],tuijianList)"><img src="@/img/ly_sjsdxc_pic03.jpg" class="ims" alt="" /></li>
        </ul>
        <div class="clear" style="height: 8px;"></div>
        <ul>
          <li style="width: 100%;"
              @click="detail(tuijianList[3],tuijianList)"><img src="@/img/ly_sjsdxc_pic04.jpg" class="ims" alt="" /></li>
        </ul>
      </div>
      <div class="clear h20"></div>
      <!-- 乡村民宿 -->
      <div class="ly_ctit">
        <img src="@/img/ly_xzmhms_tit.jpg" alt=""/>
      </div>
      <div class="clear"></div>
      <div class="mhms_bt">
        <ul>
          <li @click="detail(minsuList[1],minsuList)"><img src="@/img/ly_xzmhms_pic01.jpg" class="ims" alt="" /></li>
          <li @click="detail(minsuList[2],minsuList)"><img src="@/img/ly_xzmhms_pic02.jpg" class="ims" alt="" /></li>
          <li @click="detail(minsuList[3],minsuList)"><img src="@/img/ly_xzmhms_pic03.jpg" class="ims" alt="" /></li>
        </ul>
      </div>
      <div class="clear h20"></div>
      <div class="mhms_more"><a @click="detail(minsuList[0],minsuList)">更多乡村民宿></a> </div>
      <div class="clear h35"></div>

    </div>


    <div class="clearfloat"></div>

  </div>
</template>

<script>
  import Swiper from 'swiper';
  import Util from '@/libs/util';
  export default {
    data:function(){
      return {
      	key:"",//搜索关键词
        itemList:[],
        redianList:[],
        minsuList:[{
          serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/3",
          tag:"",
          name:"全部"
        },{
      		serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/3",
          tag:"山居",
          name:"山居"
        },{
          serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/3",
          tag:"临水",
          name:"临水"
        },{
          serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/3",
          tag:"别致",
          name:"田园"
        }/*,{
          serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/3",
          tag:"文艺",
          name:"文艺"
        },{
          serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/3",
          tag:"古风",
          name:"古风"
        }*/],
        tuijianList:[
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/1",
            tag:"老字号",
            name:"老字号"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/1",
            tag:"传统美食",
            name:"传统美食"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/2",
            tag:"伴手礼",
            name:"伴手礼"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"采摘",
            name:"采摘"
          }
        ],
        //时令、网红、猎奇、寻古、康养、亲水、慢生活.亲子
        shilingList:[
          {
          	serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"时令",
            name:"时令"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"网红",
            name:"网红"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"亲子",
            name:"亲子"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"猎奇",
            name:"猎奇"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"寻古",
            name:"寻古"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"康养",
            name:"康养"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"慢生活",
            name:"慢生活"
          },
          {
            serviceurl:"https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/0",
            tag:"亲水",
            name:"亲水"
          }
        ]
      }
    },
    methods:{
      init:function(){
        const self = this;
      	//Util.ajax.post('').then()
      },
      //顶部专题点击
      detail(i,list){
      	console.log(i);
      	//this.$router.push({name:"nongyeMap",query:{tab:JSON.stringify(i),list:JSON.stringify(list)}});
      	this.$router.push({name:"nlist",query:{tab:JSON.stringify(i),list:JSON.stringify(list)}});
      },
      searchkey(){
      	this.$router.push({name:"nlist",query:{searchkey:this.key}});
      },
      newsDetail(i){
        if(i.link){
          location.href = i.link;
        }else{
          this.$router.push({name:'nongyeCon',query:{id:i.id}})
        }
      }
    },
    //加载完成
    mounted:function(){
      Util.checkLog().then(function (response) {
        if(response.data.code!=100){
          Util.login();
        }
      });
    	//中间
      var swiper = new Swiper('.swiper-container', {
        autoplay: 3000
      });
      //搜索几块
      const self = this;
      self.$vux.loading.show();
      Util.ajax.post('/fapi/public/nongye/option/fl').then(function (response) {
        self.$vux.loading.hide();
        if(response.data && response.data.length>0){
          self.$set(self.$data,'itemList',response.data);
        }
      });
      //乡村热点
      Util.ajax.post('/fapi/public/news/nongye').then(function (response) {
        if(response.data && response.data.length>0){
          self.$set(self.$data,'redianList',response.data);
        }
      });
    }
  }
</script>
