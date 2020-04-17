<style lang="less" scoped>
  @import "../home/home.less";
  .zhuantibtn{
    box-shadow:0 0 5px #aaa;background: @theme-color;
    z-index:1;border-radius:3px;text-align: center;color:#fff;font-size: 10px;
  }
  .m-pop{
  .m-pop-tit{
    border-radius:5px;
    box-sizing: border-box;
    padding:0 10px;
    height:40px;line-height: 40px;
    margin:10px;background:@theme-color;color:#fff;
  }
  .m-pop-list{
    background:#efefef;
    margin: 0 10px;
  >a{
     display: block;text-indent: 10px;
     padding:10px 5px;
   }
  }
  }
</style>

<template>
  <div style="height:100%;">
    <tianditu @mapload="mapload"
              @xuequ2Click="xuequ2Click"
              :loading=true
              layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/ZTDT/VectorTileServer"
              ref="map" mapid="xmap" style="height:100%;"></tianditu>
	  <!-- 左下角文字说明 -->
	  <div style="position: fixed;z-index:10;left:10px;bottom:10px;font-size:10px;color:#666;">
		  学区仅供参考
	  </div>
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
            <input id="searchKey" type="text" placeholder="查找地点、路线" v-model="searchMap.key"
                   @keyup.enter="searchpoi(true)"
                   @focusin="searchHis()"
                   @focusout="focusout">
            <img src="@/images/clear.png" v-if="searchMap.key.length" @click="clearKey" alt="">
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
                <div><span style="opacity: 0">线</span>清除<span style="opacity: 0">线</span></div>
              </div>
              <div class="tmap-tools_8 tmap-box" @click="fenxiangShow=true">
                <img src="@/images/fenxiang.png" alt="">
                <div><span style="opacity: 0">线</span>分享<span style="opacity: 0">线</span></div>
              </div>
            </div>
          </div>
          <!--<div class="tmap-zhoubian tmap-box mt10" @click="zhoubianPop.show=true;zhoubianPop.load=true;zhoubianPop.lng=null;zhoubianPop.lat=null;">
            <img src="@/images/l-2.png" alt="">
            <div>周边</div>
          </div>-->
        </div>
        <!-- 右侧周边 -->
        <div class="tmap-right-tools">
          <!--<div class="tmap-zhoubian tmap-box" @click="dituPop.show=true;dituPop.load=true">
            <img src="@/images/r-1.png" alt="">
            <div>地图</div>
          </div>-->
          <!-- infoPop.show=false;popShow=true -->
          <!--<div class="zhuantibtn tmap-zhoubian tmap-box"
               @click="infoPop.show=false;popShow=true" style="padding-top:0;">
            <img src="@/images/mlist.png" style="margin:0 auto;width: 16px;padding: 6px 0;" alt="" />
          </div>-->
          <div class="tmap-zhoubian tmap-box">
            <div @click="infoPop.show=false;popShow=true">
              <img src="@/images/mlist.png" style="width:16px;" alt="">
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
            <!--<div class="tmap-divide"></div>
            <div @click="changeXuequ">
              <img src="@/images/qiehuan.png" alt="" style="width:16px;">
              <template v-if="lid==0"><div>中学</div></template>
              <template v-if="lid==1"><div>小学</div></template>
            </div>-->
          </div>
          <!--  -->
          <div class="zhuantibtn tmap-zhoubian tmap-box"
               @click="changeXuequ"
               style="position: static;width:30px;margin-top: 10px;">
            <p><img src="@/images/qiehuan2.png" alt="" style="width:16px;"></p>
            <template v-if="lid==0"><p>中学</p></template>
            <template v-if="lid==1"><p>小学</p></template>
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
    <!-- 右侧 -->
    <popup v-model="popShow" position="right" height="100%" width="70%" >
      <!-- 搜索 -->
      <input type="text" placeholder="请输入关键字查询" v-model="zhuantiSearchKey"
			 style="display: block;width: 94%;margin:0 auto;margin-top: 10px;line-height: 30px;text-indent: 10px;">
      <!---->
      <div  class="m-pop mt10" style="overflow: scroll;">
        <div class="m-pop-list" >
          <a @click="searchInfoClick(ii)" v-for="(ii,idx2) in searchData" v-if="!ii.hide"
             :style="{'background':(idx2+1)%2==0?'#fff':'#efefef'}"
             style="font-size: 12px;">{{ii.attributes.NAME || ii.attributes['名称']}}</a>
        </div>
      </div>
    </popup>
    <!-- 个人中心 -->
    <popup v-model="personPop.show" position="left" height="100%" width="60%" style="z-index:998;">
      <personal v-if="personPop.show" ref="personal"
                @collectMore="collectPop.show=true;collectPop.load=true"
                @setAddr="paddrPop.show=true"
                @collectDetail="collectDetail"
                @addrList="addrPop.show=true;addrPop.load=true"
                @shangbaoMore="myshangbaoPop.show=true"></personal>
    </popup>
    <!-- 个人收藏 -->
    <popup v-model="collectPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <collect-list v-if="collectPop.load" @collectDetail="collectDetail" @closePop="closePop();$refs.personal.collect();" ></collect-list>
    </popup>
    <!-- 常用地址 -->
    <popup v-model="addrPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <addr-list v-if="addrPop.load" @collectDetail="collectDetail" @closePop="closePop"></addr-list>
    </popup>
    <!--地址设置-->
    <popup v-model="paddrPop.show" style="z-index:999;height:100%;width:100%;" position="bottom">
      <p-addr v-if="paddrPop.show"
              @closePop="closePop"
              @subSuccess="closePop();$refs.personal.addr();"></p-addr>
    </popup>
    <!-- 上报 -->
    <popup v-model="shangbaoPop.show" height="100%" :show-mask="false" style="z-index:999;">
      <shangbao-form @closePop="closePop" v-if="shangbaoPop.show"></shangbao-form>
    </popup>
    <!-- 上报列表 -->
    <popup v-model="myshangbaoPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <shangbao-list v-if="myshangbaoPop.show" @closePop="closePop"></shangbao-list>
    </popup>

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
    <!-- 底部多少条 -->
    <div v-if="!searchMap.page.show && searchMap.page.data && searchMap.page.data.length && searchMap.count"
         @click="searchMap.page.show=true"
         style="position:fixed;bottom:0;height:36px;line-height:36px;background:#fff;z-index:1;width:100%;text-align: center;">
      在<b class="on">{{searchMap.key || searchMap.tag}}</b>找到<b class="on">{{searchMap.count}}</b>条记录
    </div>
    <!-- 详细信息 -->
    <popup v-model="infoPop.show && infoPop.simple" :show-mask="false"
           style="max-height:calc(100% - 100px);padding: 0 10px;width:100%;box-sizing: border-box">
      <div class="info-pop">
        <!-- 顶部关闭 -->
        <div class="info-pop-tool">
          <img src="@/images/back.png"
               v-show="!searchMap.hideReturn"
               @click="()=>{if(infoPop.simple){infoPop.show=false;searchMap.page.show=true;}else{infoPop.simple=false}}"
               class="rtn" alt="">
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
            <div class="bt_mp" style="bottom:13px;" v-if="infoPop.info.ADDRESS" @click="Xiangxi">展开详情</div>
          </div>
          <div class="map_btn" style="margin-top:15px;">
            <a class="on" @click="zhoubianPop.show=true;zhoubianPop.load=true;
            zhoubianPop.lng=infoPop.info.CENTERX;zhoubianPop.lat=infoPop.info.CENTERY">周边</a>
            <a @click="shoucang" :class="(infoPop.info.collect && infoPop.info.collect.id)?'on':''">收藏</a>
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
        <!--<div class="info-pop-con" :style="{'padding':infoPop.simple?'0 10px':'0'}">
          <template v-if="infoPop.simple">
            <div class="info-pop_tit">{{infoPop.info.NAME}}</div>
            <div class="info-pop_info">
              <div v-if="infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
              <div v-if="infoPop.info.ADDRESS">地址：{{infoPop.info.ADDRESS}}</div>
            </div>
            <div class="info-pop_btn">
              <div @click="Xiangxi" :class="infoPop.info.ADDRESS?'on':''">
                <img v-if="infoPop.info.ADDRESS" src="@/images/tem-1o.png" alt="">
                <img v-else src="@/images/tem-1.png" alt="">详 细</div>
              <div @click="findQuanjing"
                   :class="quanjingPop.url?'on':''">
                <img v-if="quanjingPop.url" src="@/images/tem-2o.png" alt="">
                <img v-else src="@/images/tem-2.png" alt="">全 景</div>
              <div @click="guidPop.show=true;guidPop.form.guid=infoPop.info.FEATUREGUID"><img src="@/images/tem-3.png" alt="">上传照片</div>
            </div>
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
              <div @click="openLocation(infoPop.info.CENTERX,infoPop.info.CENTERY,infoPop.info.NAME,infoPop.info.ADDRESS,'')">
                <img src="@/images/tem-7.png" alt="">导航
              </div>
            </div>
          </template>
        </div>-->
      </div>
    </popup>
    <!-- 教育内容 -->
    <popup v-model="!infoPop.simple" height="100%" position="bottom" :show-mask="false">
      <jiaoyu-content :conData="infoPop.info"
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
                      @findQuanjing="findQuanjing"></jiaoyu-content>
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
                   :centerx="jiucuoPop.centerx" :centery="jiucuoPop.centery" :name="jiucuoPop.name" :zoom="jiucuoPop.zoom"
                   :guid="jiucuoPop.guid"
                   @closePop="jiucuoPop.show=false;"></jiucuo-form>
    </popup>
    <!-- 全景pop -->
    <popup v-model="quanjingPop.show" position="right" width="100%" height="100%" :show-mask="false">
      <iframe v-if="quanjingPop.show" :src="quanjingPop.url" frameborder="0"
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

  </div>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import Tianditu from '@/components/libs/tianditu/main';
  import {mapmixin} from '@/mixin/map.js';
  import {Popup,Tab,TabItem} from 'vux';
  import Zhoubian from '@/components/jiaoyu/zhoubian';
  import Uploader from '@/components/libs/Uploader/Uploader';
  import JiucuoForm from '@/components/personal/jiucuo/form.vue';//纠错
  import JiaoyuContent from '@/components/jiaoyu/listView.vue';
  import {jiaoyuConfig} from '@/config/tdt';
  import ShangbaoForm from '@/components/personal/shangbao/form.vue';//上报
  import Personal from '@/components/personal/index';//个人中心
  import PAddr from '@/components/personal/addr/form';
  import AddrList from '@/components/personal/addr/list';//地址列表
  import CollectList from '@/components/personal/collect/list';//收藏
  import ShangbaoList from '@/components/personal/shangbao/list';//上报列表
  export default {
    components:{
      Tianditu,Popup,JiaoyuContent,JiucuoForm,Zhoubian,Uploader,Tab,TabItem,ShangbaoForm,
      Personal,PAddr,AddrList,CollectList,ShangbaoList
    },
    mixins:[mapmixin],
    data(){
    	return {
    		lid:0,
			popShow:false,
			layerView:null,
			highlight:null,
			zhuantiSearchKey:"",
			searchData:[],
			tempData:[]
		}
    },
	  watch:{
		  zhuantiSearchKey(val,oldVal){
			  const self = this;
			  self.searchData.forEach(function (child,idx) {
				  let reg = new RegExp('.*?'+val);
				  reg.lastIndex = 0;
				  if(reg.test(child.attributes.NAME) || reg.test(child.attributes['名称'])){
					  self.$set(child,'hide',false);
				  }else{
					  self.$set(child,'hide',true);
				  }
			  });
		  }
	  },
    methods:{
    	mapload(map){
    		this.minit(map);
    		const self = this;
			Util.ajax.post('/fapi/public/jiaoyu/option/fl').then(function (response) {
				if (response.data && response.data.length > 0) {
					self.$set(self.searchMap, 'itemList', response.data);
				}
			});
      	},
      searchInfoClick(obj){
        this.popShow=false;
        if(this.highlight){
          this.highlight.remove();
        }
        if(obj.geometry.rings){
        	const self = this;
        	const view = this.$refs.map.$data.view;
          esriLoader.loadModules([
            "esri/Graphic",
            "esri/geometry/Polygon"
          ])
          .then(([Graphic, Polygon]) => {
            var p = new Polygon({
              rings: obj.geometry.rings,
              spatialReference: { wkid: 4326 }
            });
          var graphic = new Graphic({
            geometry: p,
            symbol: {
              type: "simple-fill", // autocasts as new SimpleFillSymbol
              color: '#ff0000',//009e60
              style: "none",
              outline: { // autocasts as SimpleLineSymbol
                color: [255, 0, 0],
                width: 2,
                style:'short-dash'
              }
            }
          });
          view.graphics.add(graphic);
          //view.center = obj.geometry.paths[0][0];
        });
        }
        //this.highlight = this.layerView.highlight(obj);//高亮
        this.searchInfo(obj,true);
      },
      minit(map){
        const self = this;
        const view = self.$refs.map.$data.view;
        view.graphics.removeAll();
        esriLoader.loadModules([
          'esri/tasks/support/Query',
          'esri/tasks/QueryTask',
          'esri/layers/FeatureLayer'
        ]).then(([Query,QueryTask,FeatureLayer]) => {
        	if(map.findLayerById('xuequ1')!=null){
        		map.remove(map.findLayerById('xuequ1'));
          }
          let url = 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7';
          let url2 = 'https://services.wzmap.gov.cn/server/rest/services/JIAOYUZY/XUEQUFW/MapServer/0';
          let name = '小学';
          if(self.lid==1){
            url2 = 'https://services.wzmap.gov.cn/server/rest/services/JIAOYUZY/XUEQUFW/MapServer/1';
            name = '中学';
            Util.title('初中学区');
          }else{
            Util.title('小学学区');
          }
          var labelClass = {
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
            labelExpressionInfo: {
              expression: "$feature.NAME"
            }
          };
          //
          var xuequLayer = new FeatureLayer(url2,{
            outFields: ["*"],
            id:'xuequ1',
            labelInfo:labelClass
          });
          xuequLayer.on('layerview-create',function (e) {
          	console.log('加载完毕');
            console.log(e);
            self.layerView = e.layerView;
          });
          map.add(xuequLayer);

          //查询
          let arr = [];
          let query = new Query();
          var queryTask = new QueryTask({
            url: url2
          });
          query.outFields = ["*"];
          query.returnGeometry = true;
          query.where="1=1";
          queryTask.execute(query).then(function(results){
            self.fields = results.fields;
            results.features.forEach(function (item) {
              //
              arr.push(item);
            });
            self.searchData = arr;
            self.$set(self.$data,'tempData',self.searchData);
          });
          //
          /*var xuequLayer2 = new FeatureLayer(url,{
           outFields: ["*"],
           id:'xuequ2',
           definitionExpression: " TAG like '%"+name+"%' "
           });
           xuequLayer2.renderer={
           type: "simple",
           symbol:{
           type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
           url: "/images/xuexiao.png",
           width: "14px",
           height: "14px"
           }
           };
           map.add(xuequLayer2);*/
        });
      },
      xuequ2Click(graphic){
    		//console.log(graphic);
    		jiaoyuConfig.replace(graphic);
    		this.searchInfo(graphic,true);
        if(graphic.geometry.rings){
          const self = this;
          const view = this.$refs.map.$data.view;
          esriLoader.loadModules([
            "esri/Graphic",
            "esri/geometry/Polygon"
          ])
          .then(([Graphic, Polygon]) => {
            var p = new Polygon({
              rings: graphic.geometry.rings,
              spatialReference: { wkid: 4326 }
            });
          var g = new Graphic({
            geometry: p,
            symbol: {
              type: "simple-fill", // autocasts as new SimpleFillSymbol
              color: '#ff0000',//009e60
              style: "none",
              outline: { // autocasts as SimpleLineSymbol
                color: [255, 0, 0],
                width: 2,
                style:'short-dash'
              }
            }
          });
          view.graphics.add(g);
          //view.center = obj.geometry.paths[0][0];
        });
        }
      },
      //搜索
      async searchpoi(flush,url,tag,list,iszhuanti,iszhoubian){
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
        const arr = await esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/geometry/Polyline",
          "esri/geometry/geometryEngine",
          'esri/geometry/Circle',
          'esri/geometry/Point'
        ]);
        let QueryTask = arr[0];
        let Query = arr[1];
        let Polyline = arr[2];
        let geometryEngine = arr[3];
        let Circle = arr[4];
        let Point = arr[5];

        var layerurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7";
        var layerurl2 = "https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7";
        var defaulturl = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
        if(url){
          layerurl = url;
          self.searchMap.url = url;
        }else{
          self.searchMap.url = '';
        }
        console.log(layerurl);
        // Represents the REST endpoint for a layer of cities.
        var queryTask = new QueryTask({
          url: layerurl
        });
        var prefix = "tdt.DBO.教育.";
        /*if(!/幼儿园|小学|初中|高中|大学|职高\/技校|特殊教育|培训机构/.test(tag)){
          prefix = "";
        }*/
        const view = self.$refs.map.$data.view;
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.start = self.searchMap.page.start;//开始
        query.num = self.searchMap.page.pageSize;//多少
        query.where = " "+prefix+"NAME LIKE '%"+key+"%' ";//AND FSCALE<="+view.zoom  // Return all cities with a population greater than 1 million
        //标签
        if(tag){
          query.where = prefix+"TAG LIKE '%"+tag+"%'";
          self.searchMap.tag = tag;
          //找同组的
          if(list){
            self.$set(self.searchMap,'tongzuList',list)
          }else{
            Util.ajax.post('/fapi/public/option/zttongzu?name='+tag).then(function (response) {
              if(response.data && response.data.length)
                self.$set(self.searchMap,'tongzuList',response.data)
            });
          }
        }else{
          self.searchMap.tag = '';
        }
        if(iszhoubian && self.zhoubianPop.lng && self.zhoubianPop.lat){
          var geo = new Circle(new Point({
            "x" : self.zhoubianPop.lng,
            "y" : self.zhoubianPop.lat,
            "spatialReference" : self.$refs.map.$data.map.spatialReference
          }), { "radius": 3000 });
          query.geometry = geo;
        }
        if(self.searchMap.areaName){
          query.where += " AND AREA='"+self.searchMap.areaName+"'";
        }
        query.orderByFields = [prefix+"HOTSPOT DESC"];
        let results = await queryTask.execute(query);
        //从POI中查
        /*if(results.features && results.features.length==0 && layerurl==layerurl2){
          //console.log('poi查询');
          queryTask.url = defaulturl;
          results = await queryTask.execute(query);
        }*/
        self.$vux.loading.hide();
        //console.log(results.features);
        if(results.features && results.features.length==self.searchMap.page.pageSize){
          self.searchMap.page.loadmore = true;
        }else{
          self.searchMap.page.loadmore = false;
        }
        results.features.forEach(function (poi) {
        	jiaoyuConfig.replace(poi);
          self.searchMap.page.data.push(poi);
        });

        self.searchMap.page.show = true;
        self.searchMap.show=false;
        self.infoPop.show=false;
      },
      changeXuequ(){
        this.lid = this.lid==0?1:0;
      	this.minit(this.$refs.map.$data.map);
      }
    },
    mounted(){
      if(this.$route.query && this.$route.query.lid){
      	this.lid = this.$route.query.lid;
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
            jsApiList: ['getLocation','openLocation','previewImage'] // 必填，需要使用的JS接口列表
          });
        });
      }
    }
  }
</script>
