<style lang="less">
  @import "../../home/home.less";
  @import "index.less";
</style>

<template>
  <view-box body-padding-top="0px" body-padding-bottom="0px" class="mzmap">
    <tianditu @mapload="mapload"
              @meizhouClick="meizhouClick"
              :lng="lng"
              :lat="lat"
              :zoom="zoom"
              :loading=true
              layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/ZTDT/VectorTileServer"
              ref="map" mapid="mzmap" style="height:100%;" v-if="mid"></tianditu>
    <!-- 固定顶部其他 -->
    <div class="tmap-fixed">
      <!-- 搜素 -->
      <div class="tmap-search" v-if="!is3D">
        <div class="tmap-search-wrap" style="display: flex;flex:1;">
          <!-- 头像 -->
          <div style="flex:0 0 auto">
            <img v-if="wxuser" :src="wxuser.headpic" @click="personPop.show=true;personPop.load=true" style="height:30px;width:30px;border-radius: 50%;" alt="">
            <img v-else src="@/images/h1.jpg" @click="personPop.show=true" style="height:30px;width:30px;border-radius: 50%;" alt="">
          </div>
          <!-- 搜索 -->
          <div class="tmap-search-input">
            <input type="text" placeholder="查找地点、路线" v-model="searchMap.key"
                   @keyup.enter="searchpoi(true)"
                   @focusin="searchHis()"
                   @focusout="focusout">
          </div>
        </div>
        <!-- 搜索按钮 -->
        <div @click="searchpoi(true)" class="search-btn" >搜索</div>
      </div>
      <!-- 搜索展开 -->
      <div class="tmap-search-list" v-if="searchMap.show && !searchMap.page.show">
        <div class="search-wrap">
          <!-- 顶部专题 -->
          <div class="search-zhuanti">
            <div class="search-zhuanti_item"
                 @click="searchpoi(true,i.serviceurl,i.tag?i.tag:i.name,searchMap.itemList,false)"
                 v-for="i in searchMap.itemList">
              {{i.name}}
            </div>
          </div>
          <!-- 搜索历史列表 -->
          <div class="search-history">
            <a @click="searchMap.key=i.searchkey;searchpoi(true);" v-for="i in searchMap.hisList">{{i.searchkey}}</a>
          </div>
          <div class="tmap-divide"></div>
          <!-- 按钮 -->
          <a class="mt10" @click="searchMap.hisShow=!searchMap.hisShow">{{searchMap.hisShow?'关闭':'开启'}}搜索记录</a>
          <a class="mt10" @click="clearSearchHis">清空搜索记录</a>
        </div>
      </div>
      <div class="mt10">
        <!-- 左侧工具 -->
        <div class="tmap-left-tools" v-if="!is3D">
          <div class="tmap-tools tmap-box">
            <div @click="toolshow=!toolshow">
              <img src="@/images/l-1.png" alt="">
              <div>工具</div>
            </div>
            <!-- 工具展开 -->
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
          </div>
          <div class="tmap-zhoubian tmap-box mt10" @click="zhoubianPop.show=true;zhoubianPop.load=true;zhoubianPop.lng=null;zhoubianPop.lat=null;">
            <img src="@/images/l-2.png" alt="">
            <div>周边</div>
          </div>
        </div>
        <!-- 右侧周边 -->
        <div class="tmap-right-tools">
          <!--<div class="zhuantibtn tmap-zhoubian tmap-box"
               @click="infoPop.show=false;popShow=true" style="padding-top:0;">
            &lt;!&ndash;<p>专题</p>&ndash;&gt;
            <img src="@/images/liebiao.png" style="width:100%;margin:0 auto;" alt="" />
            &lt;!&ndash;<p>列表</p>&ndash;&gt;
          </div>-->
          <div class="tmap-zhoubian tmap-box">
            <div @click="infoPop.show=false;popShow=true">
              <img src="@/images/mlist.png" style="width:24px;margin:0 auto;margin-top:-2px;" alt="" />
              <div class="on">列表</div>
            </div>
            <div class="tmap-divide"></div>
            <div @click="shangbaoPop.show=true">
              <img src="@/images/r-2.png" alt="">
              <div>上报</div>
            </div>
            <template v-if="!is3D">
              <div class="tmap-divide"></div>
              <div @click="dingwei(true)">
                <img src="@/images/r-3.png" alt="">
                <div>定位</div>
              </div>
            </template>
            <div class="tmap-divide"></div>
            <div @click="$router.push({name:'meizhouyitu'})" >
              <img src="@/images/home.png" alt="">
              <div>首页</div>
            </div>
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
    <!-- 底部多少条 -->
    <div v-if="!searchMap.page.show && searchMap.page.data && searchMap.page.data.length && searchMap.count"
         @click.sync="searchMap.page.show=true"
         style="position:fixed;bottom:0;height:36px;line-height:36px;background:#fff;z-index:20;width:100%;text-align: center;">
      在<b class="on">{{searchMap.key || searchMap.tag}}</b>找到<b class="on">{{searchMap.count}}</b>条记录
    </div>
    <!-- 个人中心 -->
    <popup v-model="personPop.show" position="left" height="100%" width="60%" style="z-index:998;">
      <personal v-if="personPop.show" ref="personal"
                @collectMore="collectPop.show=true;collectPop.load=true"
                @setAddr="paddrPop.show=true"
                @collectDetail="collectDetail"
                @addrList="addrPop.show=true;addrPop.load=true"
                @shangbaoMore="myshangbaoPop.show=true"></personal>
    </popup>
    <!-- 常用地址 -->
    <popup v-model="addrPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <addr-list v-if="addrPop.show" @collectDetail="collectDetail" @closePop="closePop();$refs.personal.addr();"></addr-list>
    </popup>
    <!--地址设置-->
    <popup v-model="paddrPop.show" style="z-index:999;height:100%;width:100%;" position="bottom">
      <p-addr v-if="paddrPop.show"
              @closePop="closePop"
              @subSuccess="closePop();$refs.personal.addr();"></p-addr>
    </popup>
    <!-- 个人收藏 -->
    <popup v-model="collectPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <collect-list v-if="collectPop.show" @closePop="closePop();$refs.personal.collect();" ></collect-list>
    </popup>
    <!-- 上报列表 -->
    <popup v-model="myshangbaoPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <shangbao-list v-if="myshangbaoPop.show" @closePop="closePop();$refs.personal.shangbao();"></shangbao-list>
    </popup>
    <!-- 上报 -->
    <popup v-model="shangbaoPop.show" height="100%" :show-mask="false" style="z-index:999;">
      <shangbao-form @closePop="closePop()" v-if="shangbaoPop.show"></shangbao-form>
    </popup>

    <!-- 右侧 -->
    <popup v-model="popShow" position="right" height="100%" width="70%" id="pop" @on-first-show="firstShow">
        <!-- 搜索 -->
        <input type="text" placeholder="请输入关键字查询" v-model="zhuantiSearchKey"
               style="display: block;width: 94%;margin:0 auto;margin-top: 7px;line-height: 30px;text-indent: 10px;">
        <!---->
        <template v-if="mData.length>0 && searchData.length==0">
          <div v-for="i in mData" class="m-pop">
            <div class="m-pop-tit" @click="searchInfoClick(i)">{{i.name}} ({{i.list?i.list.length:0}})
              <img src="@/images/zhankai.png" style="float: right;width:16px;margin-top:12px;" alt=""/>
              </div>
            <div class="m-pop-list" style="overflow: scroll;" v-if="i.show && i.list && i.list.length">
              <!-- searchInfoClick -->
              <a @click="searchInfoClick(ii)" v-show="!ii.hide" v-for="(ii,idx2) in i.list"
                 :style="{'background':(idx2+1)%2==0?'#fff':'#efefef'}"
                 style="font-size: 12px;">{{idx2+1}}、{{ii.attributes.NAME || ii.attributes['名称']}}</a>
            </div>
          </div>
        </template>
        <div v-else  class="m-pop" style="overflow: scroll;">
          <div class="m-pop-list" >
            <a @click="searchInfoClick(ii)" v-for="(ii,idx2) in searchData"
               :style="{'background':(idx2+1)%2==0?'#fff':'#efefef'}"
               style="font-size: 12px;">{{ii.attributes.NAME || ii.attributes['名称']}}</a>
          </div>
        </div>
    </popup>
    <!-- 左下角文字说明 -->
    <div style="position: fixed;z-index:10;left:10px;bottom:10px;font-size:10px;color:#666;">
      资料来源:{{content.origin}}<br/>
      底图来源:天地图<br/>
      主办单位:{{content.zhuban=='温州市规划局'?'温州市自然资源和规划局':content.zhuban}}<br/>
      制作单位:温州市勘察测绘研究院<!--{{content.fuban}}-->
    </div>

    <!-- 搜索结果 -->
    <popup v-model="searchMap.page.show" height="80%" id="searchRes" :show-mask="false"
           style="height:calc(100% - 51px);padding: 0 10px;width: calc(100% - 40px);border-radius: 5px;left: 10px;">
      <!-- 顶部关闭 -->
      <div class="tmap-search-tool">
        <img src="@/images/down10.png" @click="searchMap.page.show=false" alt="">
        <img src="@/images/close.png" @click="searchMap.page.show=false;searchMap.page.data = [];" class="cls" alt="">
      </div>
      <!-- 同组按钮 -->
      <tab v-if="searchMap.tongzuList && searchMap.tongzuList.length>0" :line-width=0>
        <tab-item v-for="i in searchMap.tongzuList" :selected="i.tag==searchMap.tag"
                  @click.native="searchpoi(true,i.serviceurl?i.serviceurl:searchMap.url,i.tag,searchMap.tongzuList,i.iszhuanti,i.iszhoubian)"
                  style="flex: none;padding: 0 10px;width:auto;min-width: 20%;">
          {{i.name}}
        </tab-item>
      </tab>
      <!-- 筛选列表 -->
      <div class="shaixuan">
        <div class="on"><img src="@/img/ico_lm_ov.png" alt="">热门</div>
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
            <div v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
            <div v-if="i.attributes.juli">距您：{{i.attributes.juli}}km</div>
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
          <img src="@/images/close.png" @click="()=>{
            if(highlight){
              highlight.remove();
            }
            infoPop.show=false
          }" class="cls" alt="">
        </div>
        <!-- 详细 -->
        <div class="info-pop-con">
          <div class="info-pop_tit">{{infoPop.info.NAME || infoPop.info['名称']}}</div>
          <div class="info-pop_info">
            <!--<div v-for="i in infoKeyVal" v-if="i.value && i.name!='SUMMARY' && i.name!='简介'">{{i.name}}：{{i.value}}</div>-->
            <div v-if="infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
            <div v-if="infoPop.info.ADDRESS">地址：{{infoPop.info.ADDRESS}}</div>
          </div>
          <div class="info-pop_btn">
            <!-- (infoPop.info.imgList && infoPop.info.imgList.length) -->
            <div @click="Xiangxi" :class="infoPop.info.ADDRESS?'on':''">
              <img v-if="infoPop.info.ADDRESS" src="@/images/tem-1o.png" alt="">
              <img v-else src="@/images/tem-1.png" alt="">详 情</div>
            <div @click="findQuanjing"
                 :class="quanjingPop.url?'on':''">
              <img v-if="quanjingPop.url" src="@/images/tem-2o.png" alt="">
              <img v-else src="@/images/tem-2.png" alt="">全 景</div>
            <div @click="guidPop.show=true;guidPop.form.guid=infoPop.info.FEATUREGUID"><img src="@/images/tem-3.png" alt="">上传照片</div>
          </div>
          <!-- 照片 -->
          <!--<div class="info-pop_img" v-if="!infoPop.simple">
            <div v-if="infoPop.info.imgList">
                <a @click="previewImage(i.ServerUrl+'/'+Location+'/'+name)"
                   v-for="(i,idx) in infoPop.info.imgList">
                  <img :src="i.ServerUrl+'/'+SmallLocation+'/'+name" alt="">
                </a>
            </div>
          </div>-->
          <div class="info-pop_btn2">
            <div @click="zhoubianPop.show=true;zhoubianPop.load=true;
            zhoubianPop.lng=infoPop.info.CENTERX;zhoubianPop.lat=infoPop.info.CENTERY"><img src="@/images/tem-5.png" alt="" >周边</div>
            <div @click="jiucuoPop.guid=infoPop.info.FEATUREGUID;
                          jiucuoPop.centerx=infoPop.info.CENTERX;
                          jiucuoPop.centery=infoPop.info.CENTERY;
                          jiucuoPop.name=infoPop.info.NAME;
                          jiucuoPop.zoom=$refs.map.$data.view.zoom;
                          jiucuoPop.show=true;"><img src="@/images/tem-4.png" alt="" >纠错</div>
            <div @click="shoucang">
              <img src="@/images/shoucang1.png" v-if="infoPop.info.collect && infoPop.info.collect.id" alt="" >
              <img src="@/images/shoucang.png" v-else alt="" >收藏
            </div>
            <!--<div><img src="@/images/tem-8.png" alt="">评论</div>-->
            <div @click="openLocation(infoPop.info.CENTERX,infoPop.info.CENTERY,infoPop.info.NAME,infoPop.info.ADDRESS,'')">
              <img src="@/images/tem-7.png" alt="">导航
            </div>
          </div>
          <!-- 内容 -->
          <!--<div class="info-pop_con" v-if="!infoPop.simple">
            {{infoPop.info.SUMMARY}}
          </div>-->
        </div>
      </div>
    </popup>
    <!-- 详细 -->
    <popup v-model="!infoPop.simple" height="100%" position="bottom" :show-mask="false">
      <t-content :conData="infoPop.info"
                 :view="$refs.map.$data.view"
                 :map="$refs.map.$data.map"
                 :fields="fields"
                 :detail="content.detail"
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
        <label for="">照片</label>
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
      <iframe v-if="quanjingPop.url" :src="quanjingPop.url" frameborder="0"
              style="width:100%;height:calc(100% - 45px);display:block;"></iframe>
      <div class="bottom-btn" @click="quanjingPop.show=false">关闭</div>
    </popup>
    <!-- 周边pop -->
    <popup v-model="zhoubianPop.show" position="left" height="100%" width="100%" style="z-index:999;" :show-mask="false">
      <zhoubian v-if="zhoubianPop.load" @closePop="zhoubianPop.show=false"
                @zhoubianDetail="(ii,list)=>{zhoubianPop.show=false;searchpoi(true,ii.serviceurl,ii.tag?ii.tag:ii.name,list,false,true)}"></zhoubian>
    </popup>
    <!-- 分享Show -->
    <div style="background:rgba(0,0,0,0.6);position: fixed;left:0;top:0;height:100%;width:100%;z-index:9999;"
         v-if="fenxiangShow" @click="fenxiangShow=false">
      <img src="@/images/share.png" style="width:100%" alt="">
    </div>

  </view-box>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import Tianditu from '@/components/libs/tianditu/main';
  import {mapmixin} from '@/mixin/map.js';
  import {Popup,Tab,TabItem,ViewBox} from 'vux';
  import Zhoubian from '@/components/map/zhoubian';
  import Uploader from '@/components/libs/Uploader/Uploader';
  import JiucuoForm from '@/components/personal/jiucuo/form.vue';//纠错
  import TContent from '@/components/home/listView';
  import ShangbaoForm from '@/components/personal/shangbao/form.vue';//上报
  import Personal from '@/components/personal/index';//个人中心
  import PAddr from '@/components/personal/addr/form';
  import AddrList from '@/components/personal/addr/list';//地址列表
  import CollectList from '@/components/personal/collect/list';//收藏
  import ShangbaoList from '@/components/personal/shangbao/list';//上报列表
  export default {
    components:{
    	Tianditu,ViewBox,Popup,Tab,TabItem,JiucuoForm,Zhoubian,Uploader,TContent,ShangbaoForm,
      Personal,PAddr,AddrList,CollectList,ShangbaoList
    },
    mixins:[mapmixin],
    data(){
      return {
        mid:0,
        title:'',
        content:{},
        layerArr:[],
        layerView:null,
        highlight:null,
        mData:[],
        fields:null,
        i:null,
        showConfig:{},
        searchData:[],
        popShow:false,
        //专题搜索
        zhuantiSearchKey:"",
        tempData:[]
      }
    },
    watch:{
    	'infoPop.simple':function(val,oldVal){
        if(val){
          const wx = this.$wechat;
          const self = this;
          wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: self.content.title, // 分享标题
              desc: self.content.summary || '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/mzmap?mid="+self.content.id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: self.content.pic?(/http.*/.test(self.content.pic)?self.content.pic:"http://"+location.host+"/"+self.content.pic.replace('/upload','upload')):'' // 分享图标
            });
            wx.onMenuShareTimeline({
              title: self.content.title, // 分享标题
              desc: self.content.summary || '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/mzmap?mid="+self.content.id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: self.content.pic?(/http.*/.test(self.content.pic)?self.content.pic:"http://"+location.host+"/"+self.content.pic.replace('/upload','upload')):'' // 分享图标
            });
          });
        }
      },
    	zhuantiSearchKey(val,oldVal){
    		const self = this;
        this.mData.forEach(function (m,idx) {
          let reg = new RegExp('.*?'+val);
          m.show = true;
          m.list.forEach(function (child) {
            reg.lastIndex = 0;
            if(reg.test(child.attributes.NAME) || reg.test(child.attributes['名称'])){
              //child.hide = true;
              self.$set(child,'hide',false);
            }else{
              //child.hide = false;
              self.$set(child,'hide',true);
            }
          });
        });
    		/*if(val){
          function deepClone(obj) {
            let objClone = Array.isArray(obj)?[]:{};
            if(obj && typeof obj==="object"){
              for(let key in obj){
                if(obj.hasOwnProperty(key)){
                  //判断ojb子元素是否为对象，如果是，递归复制
                  if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                  }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                  }
                }
              }
            }
            return objClone;
          }
    			//console.log(this.tempData);
          if(this.tempData.length>0){
          	let copyData = deepClone(this.tempData);
          	let arr = [];
          	for(let idx in copyData){
          		arr.push(copyData[idx])
            }
            arr.forEach(function (m,idx) {
              let list = [];
              let reg = new RegExp('.*?'+val);
              m.list.forEach(function (child) {
                reg.lastIndex = 0;
                if(reg.test(child.attributes.NAME) || reg.test(child.attributes['名称'])){
                	list.push(child);
                }
              });
              arr[idx].list = list;
            });
            if(arr && arr.length){
              arr.forEach(function (item) {
                item.show = true;
              });
            }
            this.$set(this.$data,'mData',arr || []);
          }else{
            let found = [];
            let reg = new RegExp('.*?'+val);
            this.tempData.forEach(function (item) {
              reg.lastIndex=0;
              if(reg.test(item.attributes.NAME) || reg.test(item.attributes['名称'])){
                found.push(item);
              }
            });
            this.$set(this.$data,'searchData',found || []);
          }
        }else{
          //console.log(this.tempData);
          if(this.searchData.length>0){
            this.$set(this.$data,'searchData',this.tempData);
          }else{
          	//console.log(33);
            this.$set(this.$data,'mData',this.tempData);
          }
        }*/
      }
    },
    computed:{
    	infoKeyVal(){
        let arr = [];
        let fields = this.fields;
        if(this.content && this.content.detail){
          let details = this.content.detail.split(',');
          const info = this.infoPop.info;
          for(let key in info){
            details.forEach(function (item) {
              if(item==key && key!='SUMMARY'){
                let fd = '';
                fields.forEach(function (f) {
                  if(f.name==key){
                    fd = f.alias;
                  }
                });
                arr.push({
                  name:fd,
                  value:info[key]
                });
              }
            })
          }
        }
        return arr;
      }
    },
    methods:{
      mapload(map,view){
        const self = this;
        self.$vux.loading.show();
        Util.ajax.post('/fapi/public/meizhou/all?mid='+this.mid).then(function (response) {
          self.$vux.loading.hide();
          //console.log(response.data);
          self.$set(self.$data,'content',response.data.content || {});
          if(!self.title && self.content.title){
          	self.title = self.content.title;
          	Util.title(self.content.title);
          }
          if(!self.zoom && self.content.mlevel){
          	view.zoom = self.content.mlevel;
          }
          if(!self.zoom && !self.content.mlevel){
          	view.zoom = 10;
          }
          if(self.lng){
            view.center = [self.lng,self.lat];
          }else if(self.content.lng){
            view.center = [self.content.lng,self.content.lat];
          }
          //分享
          const wx = self.$wechat;
          //alert(/http.*/.test(self.content.pic)?self.content.pic:"http://"+location.host+"/"+self.content.pic.replace('/upload','upload'))
          wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: self.content.title, // 分享标题
              desc: self.content.summary || '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/mzmap?mid="+self.content.id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: self.content.pic?(/http.*/.test(self.content.pic)?self.content.pic:"http://"+location.host+"/"+self.content.pic.replace('/upload','upload')):'' // 分享图标
            });
            wx.onMenuShareTimeline({
              title: self.content.title, // 分享标题
              desc: self.content.summary || '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/mzmap?mid="+self.content.id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: self.content.pic?(/http.*/.test(self.content.pic)?self.content.pic:"http://"+location.host+"/"+self.content.pic.replace('/upload','upload')):'' // 分享图标
            });
          });
          //配置
          if(response.data && response.data.list){
            response.data.list.forEach(function(mm){
              mm.serviceurl.replace()
            });
            let treeData = response.data.list//Util.jsonToTree(response.data.list);
            self.$set(self.$data,'mData',response.data.list);
            //console.log(treeData);
            esriLoader.loadModules([
              'esri/tasks/support/Query',
              'esri/tasks/QueryTask',
              'esri/layers/FeatureLayer'
            ]).then(([Query,QueryTask,FeatureLayer]) => {
              let i = {};
              let ifound = false;
              treeData.forEach(function (childData) {
              	if(childData.lineorpoi==0){
              		i = childData;
              		ifound = true;
              		return;
                }
              });
              if(!ifound){
              	i = treeData[0];
              }
              self.i = i;

              var layerArr = [];
              treeData.forEach(function (childData) {
              	let found = false;
                layerArr.forEach(function (item) {
                  if(item.url==childData.serviceurl){
                  	found=true;
                  	item.pics.push(childData.pic);
                  	item.childs.push(childData);
                  	return;
                  }
                });
                if(!found){
                	layerArr.push({
                		url:childData.serviceurl,
                    lineorpoi:childData.lineorpoi,
                    field:childData.field,
                    detail:childData.detail,
                    pics:[childData.pic],
                    childs:[childData]
                  });
                }
              });
              self.$set(self.$data,'layerArr',layerArr);
              layerArr.forEach(function (layer,idx) {
                var url = layer.url;
                var lid = 'meizhouyitu'+idx;
                self.$set(layer,'lid',lid);
                //
                var querywhere = "1=1";
                layer.childs.forEach(function (child,idx2) {
                	let fenleifield = child.fenleifield;
                	if(!fenleifield){
                		fenleifield = self.content.field;
                  }
                	if(fenleifield){
                    querywhere = fenleifield+" like '%"+child.name+"%'";
                    if(child.enums){
                      querywhere = '(';
                      child.enums.replace(/，/gi,',').split(',').forEach(function (e) {
                        querywhere+= " OR "+fenleifield+" like '%"+e+"%'"
                      });
                      querywhere = querywhere.replace("OR","")+" ) ";
                    }
                  }
                  self.$set(child,'lid',lid+''+idx2);
                  var meizhouLayer = new FeatureLayer(url,{
                    outFields: ["*"],
                    id:lid+''+idx2,
                    definitionExpression: querywhere,
                  });

                  meizhouLayer.on('layerview-create',function (e) {
                    //console.log(e);
                    self.layerView = e.layerView;
                    self.fields = e.layerView.layer.fields;
                    self.$set(layer,'fields',e.layerView.layer.fields);
                    self.$set(child,'layerView',e.layerView);
                  });
                  //是否点
                  if(layer.lineorpoi==0){
                    let pic = '';
                    let defaultsymbol;
                    if(/#.*/.test(child.pic)){
                      defaultsymbol = {
                        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                        style: "circle",
                        color: child.pic,
                        size: child.imgsize1?child.imgsize1:"20px",
                        outline:{
                          width:0
                        }
                      }
                    }else{
                      if(/upload.*!/.test(child.pic) || /\/upload.*/.test(child.pic)){
                        pic = child.pic
                      }else{
                        pic = "/每周一图图标v.2/"+child.pic;
                      }
                      defaultsymbol = {
                        "width":child.imgsize1?child.imgsize1:"20px",
                        "type":"picture-marker",
                        "url":pic,
                        "height":child.imgsize1?child.imgsize1:"20px"
                      }
                    }
                    meizhouLayer.renderer = {
                      type: "simple",
                      symbol: defaultsymbol,
                    };
                  }else if(layer.lineorpoi==1){
                    meizhouLayer.renderer = {
                      type: "simple",
                      symbol: {
                        type: "simple-line", // autocasts as new SimpleLineSymbol()
                        color: child.pic,
                        width: child.linewidth?child.linewidth:"3px",
                        style: child.linestyle?child.linestyle:"solid"
                      }
                    };
                  }else if(layer.lineorpoi==2){
                    //面数据
                    let defaultPic = child.pic;
                    meizhouLayer.renderer = {
                      type: "simple",  // autocasts as new UniqueValueRenderer()
                      symbol: {
                        type: "simple-fill", // autocasts as SimpleFillSymbol
                        color: self.content.field?(/^\[.*?/.test(defaultPic)?JSON.parse(defaultPic):defaultPic):[0, 158, 96, 0.4],
                        style: child.mianstyle?child.mianstyle:"solid",
                        outline: { // autocasts as SimpleLineSymbol
                          color: /^\[.*?/.test(child.outcolor)?JSON.parse(child.outcolor):child.outcolor,//outcolor
                          width: child.outlinewidth?child.outlinewidth:'0px',
                          style:child.outlinestyle?child.outlinestyle:'solid'
                        }
                      }
                    };
                  }
                  //添加
                  map.add(meizhouLayer);
                });
                //查询
                var queryTask = new QueryTask({
                  url: url
                });
                var query = new Query();
                query.outFields = ["*"];
                query.returnGeometry = true;
                query.where="1=1";
                //查询设置
                if(layer.childs.length){
                  layer.childs.forEach(function (m) {
                  	let fenleifield = m.fenleifield;
                  	if(!fenleifield && self.content.field){
                  		fenleifield = self.content.field;
                  		if(self.content.orderfield){
                        query.orderByFields = [self.content.orderfield+" ASC"];
                      }
                    }
                    if(m.orderfield){
                      query.orderByFields = [m.orderfield+" ASC"];
                    }
                  	if(fenleifield){
                      query.where = fenleifield+" like '%"+m.name+"%'";
                      //console.log(m);
                      if(m.enums){
                      	let querywhere = '(';
                      	m.enums.replace(/，/gi,',').split(',').forEach(function (e) {
                          querywhere+= " OR "+fenleifield+" like '%"+e+"%'"
                        });
                      	querywhere = querywhere.replace("OR","")+" ) ";
                      	query.where = querywhere;
                      }
                  	}
                    queryTask.execute(query).then(function(results) {
                      results.features.forEach(function (item) {
                      	item.lid = lid;
                      	item.attributes.lid = lid;
                      });
                      self.$set(m,'list',results.features);
                    });
                  });
                }
              });
              self.tempData = self.mData;

            });
          }
        });
        //没有定义中心时定位
        if(!this.lng || !this.lat){
          self.dingwei(true);
        }
      },
    	searchInfoClick(obj){
      	//console.log(obj);
      	if(obj.list){
      		this.$set(obj,'show',!obj.show);
      		return;
        }else{
      		this.popShow=false;
      		this.meizhouClick(obj);
          return;
      	}
      },
      meizhouClick(graphic){
    		let lid = graphic.lid || graphic.attributes.lid || (graphic.layer?graphic.layer.id:'');
    		if(!lid && graphic.layer){
          lid = graphic.layer.id;
        }
        if(this.highlight){
          this.highlight.remove();
        }
        const self = this;
    		this.layerArr.forEach(function(layer){
    			if(new RegExp(layer.lid+".*").test(lid)){
    				let fd = false;
    				layer.childs.forEach(function (child) {
    					//console.log(graphic.attributes[self.content.field]);
              if(child.enums && child.hignlightcolor){
                child.enums.replace(/，/gi,',').split(',').forEach(function (cenum) {
                  if(new RegExp(".*?"+cenum).test(graphic.attributes[child.fenleifield || self.content.field])){
                    fd = true;
                    self.$refs.map.$data.view.highlightOptions.color =
                      /\#.*/.test(child.hignlightcolor)?child.hignlightcolor:JSON.parse(child.hignlightcolor);
                    return
                  }
                });
              }else if(new RegExp(".*?"+child.name).test(graphic.attributes[child.fenleifield || self.content.field]) && child.hignlightcolor){
              	fd = true;
              	self.$refs.map.$data.view.highlightOptions.color =
                  /\#.*/.test(child.hignlightcolor)?child.hignlightcolor:JSON.parse(child.hignlightcolor);
              }
            });
    				if(!fd){
              self.$refs.map.$data.view.highlightOptions.color = '#00ffff';
            }
    				//console.log(layer);
            try{
              layer.childs.forEach(function (child) {
                if(child.enums){
                  child.enums.replace(/，/gi,',').split(',').forEach(function (cenum) {
                    if(new RegExp(".*?"+cenum).test(graphic.attributes[child.fenleifield || self.content.field])
                      || cenum==graphic.attributes[self.content.field]){
                      self.highlight = child.layerView.highlight(graphic);//高亮
                      return;
                    }
                  });
                }else if(!self.content.field || new RegExp(".*?"+child.name).test(graphic.attributes[child.fenleifield || self.content.field])
                  || child.name==graphic.attributes[child.fenleifield || self.content.field]){
                  self.highlight = child.layerView.highlight(graphic);//高亮
                  return;
                }
              });
            }catch(err){
              console.log(err);
            }
            self.fields = layer.fields;
            self.content.detail = layer.detail;
          }
        });
        this.searchInfo(graphic,true,true);
        /*if(graphic.geometry.x && graphic.geometry.y && this.$refs.map.$data.view.zoom<18){
          this.$refs.map.$data.view.zoom = 18;
        }*/
      }
    },
    mounted(){
      if(this.$route.query){
        this.mid = this.$route.query.mid;
        this.lng = this.$route.query.lng;
        this.lat = this.$route.query.lat;
        this.zoom = this.$route.query.mlevel;
        this.title = this.$route.query.title;
        if(this.title){
          Util.title(this.title);
        }
      }
      const wx = this.$wechat;
      Util.checkLog().then(function (response) {
        if(response.data.code==100){

        }else{
          Util.login();
        }
      });
      if(!Util.isIOS()){
        Util.ajax.post("/pubApi/auth/jsapk?url=" + encodeURIComponent(location.href)).then(function (data) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: Util.wxconfig.appid, // 必填，公众号的唯一标识
            timestamp: data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
            signature: data.data.signature,// 必填，签名
            jsApiList: ['getLocation','openLocation','previewImage','onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表
          });
        });
      }
    }
  }
</script>
