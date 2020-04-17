<style lang="less">
  @import "home.less";
</style>

<template>
  <div class="main" style="width:100%;height:100%;">
    <!-- 地图 -->
    <tianditu v-show="!paddrPop.show && !shangbaoPop.show && !jiucuoPop.show"
              @mapload="mapload"
              @change2D3D="change2D3D"
              @searchInfoClick="searchInfoClick"
              @shineiLoad="shineiLoad"
              @shineiClick="shineiClick"
              @hideShinei="hideShinei"
              @quanjingClick="quanjingClick"
              :centerx="lng"
              :centery="lat"
              :zoom="zoom"
              :loading=true
              searchurl="https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0"
              layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
              ref="map" mapid="map"></tianditu>
    <!-- 固定顶部其他 -->
    <div class="tmap-fixed">
      <!-- 搜素 -->
      <div class="tmap-search" v-if="!is3D">
        <div class="tmap-search-wrap" style="display: flex;flex:1;">
          <!-- 头像 -->
          <div style="flex:0 0 auto; width: 20px">
            <!--            <img v-if="wxuser" :src="wxuser.headpic" @click="personPop.show=true;personPop.load=true" style="height:30px;width:30px;border-radius: 50%;" alt="">-->
            <!--            <img v-else src="@/images/h1.jpg" style="height:30px;width:30px;border-radius: 50%;" alt="">-->
          </div>
          <!-- 搜索 -->
          <div class="tmap-search-input">
            <!--  -->
            <input id="searchKey" type="text" placeholder="查找地点、路线" v-model="searchMap.key"
                   @keyup.enter="searchpoi(true)"
                   @focusin="searchHis()"
                   @focusout="focusout">
            <img src="@/images/clear.png" v-if="searchMap.key.length" @click="clearKey" alt="">
          </div>
        </div>
        <!-- 搜索按钮 -->
        <div @click="searchpoi(true)" class="search-btn">搜索</div>
      </div>
      <!-- 搜索展开 -->
      <div class="tmap-search-list" v-if="searchMap.show && !searchMap.page.show"><!--  -->
        <div class="search-wrap" v-if="false">
          <!-- 顶部专题 -->
          <div class="search-zhuanti">
            <div class="search-zhuanti_item"
                 @click="searchpoi(true,i.serviceurl,i.tag?i.tag:i.name,searchMap.itemList,false,false,i.pic || i.icon || '',false)"
                 v-for="(i,idx) in searchMap.itemList" v-if="idx<7">
              {{i.name}}
            </div>
            <div class="search-zhuanti_item"
                 @click="zhoubianPop.show=true;zhoubianPop.load=true;zhoubianPop.lng=null;zhoubianPop.lat=null;zhoubianQuery=false">
              更多
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
            <div class="tmap-tools-open" v-if="toolshow" style="width: 168px;">
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
              <div class="tmap-tools_3 tmap-box" :class="juliShow?'on':''" @click="shishijuli" v-show="false">
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
              <div class="tmap-tools_8 tmap-box" @click="fenxiangShow=true" v-show="false">
                <img src="@/images/fenxiang.png" alt="">
                <div><span style="opacity: 0">线</span>分享<span style="opacity: 0">线</span></div>
              </div>
            </div>
          </div>
          <!--          <div class="tmap-zhoubian tmap-box mt10"-->
          <!--			   @click="zhoubianPop.show=true;zhoubianPop.load=true;zhoubianPop.lng=null;zhoubianPop.lat=null;zhoubianQuery=true">-->
          <!--            <img src="@/images/l-2.png" alt="">-->
          <!--            <div>周边</div>-->
          <!--          </div>-->
          <!-- 室内楼层 -->
          <div class="tmap-zhoubian tmap-box mt10 louceng-list" v-if="shinei.show">
            <div v-for="(i,idx) in shinei.louceng"
                 :class="{'louceng':idx==shinei.idx}"
                 @click="loucengChange(i,idx)">{{i.name}}
            </div>
          </div>
        </div>
        <!-- 右侧周边 -->
        <div class="tmap-right-tools">
          <div class="tmap-zhoubian tmap-box" @click="dituPop.show=true;dituPop.load=true">
            <img src="@/images/r-1.png" alt="">
            <!-- <div>图层</div> -->
            <!-- 信用停车项目跳转到信用地图此处的字样需要修改 (原版是上一行) -->
            <div>应用</div>
          </div>
          <!--          <div class="tmap-zhoubian tmap-box mt10">-->
          <!--            <div @click="shangbaoPop.show=true">-->
          <!--              <img src="@/images/r-2.png" alt="">-->
          <!--              <div>上报</div>-->
          <!--            </div>-->
          <!--            <template v-if="!is3D">-->
          <!--              <div class="tmap-divide"></div>-->
          <!--              <div @click="dingwei(true)">-->
          <!--                <img src="@/images/r-3.png" alt="">-->
          <!--                <div>定位</div>-->
          <!--              </div>-->
          <!--              <div class="tmap-divide"></div>-->
          <!--              <div @click="quanjing" :class="quanjingShow?'on':''">-->
          <!--                <img v-if="quanjingShow" src="@/images/r-4o.png" alt="">-->
          <!--                <img v-else src="@/images/r-4.png" alt="">-->
          <!--                <div>全景</div>-->
          <!--              </div>-->
          <!--              <div class="tmap-divide"></div>-->
          <!--              <div @click="lukuang" :class="lukuangShow?'on':''">-->
          <!--                <img v-if="lukuangShow" src="@/images/lukuang2.png" style="width:19px;" alt="">-->
          <!--                <img v-else src="@/images/lukuang.png" style="width:19px;" alt="">-->
          <!--                <div>路况</div>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </div>-->
        </div>
        <!-- 右侧返回首页 为了信用停车中使用-->
        <div class="tmap-right-tools" style="top: 115px;">
          <div class="tmap-zhoubian tmap-box" @click="goToXypt">
            <img src="@/images/home.png" alt="">
            <!-- <div>图层</div> -->
            <!-- 信用停车项目跳转到信用地图此处的字样需要修改 (原版是上一行) -->
            <div>首页</div>
          </div>
        </div>
        <!--  -->
      </div>

    </div>
    <!-- 固定尾部 -->
    <div class="tmap-fixed-bottom" v-if="shiquShow || juliShow || cejuShow || cemianShow || huixianShow || huimianShow">
      <div class="tool-info" v-if="shiquShow">
        <template v-if="shiquLocation">经度：{{shiquLocation.lng}}&nbsp;&nbsp;纬度：{{shiquLocation.lat}}</template>
        <template v-else>点击地图获取坐标</template>
      </div>
      <div class="tool-info" v-else-if="juliShow">
        <template v-if="juliInfo">{{juliInfo}}米</template>
        <template v-else>点击地图计算距离</template>
      </div>
      <div class="tool-info" v-else @click="testcomplete">
        原位双击或点此结束
      </div>
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
    <!-- 个人收藏 -->
    <popup v-model="collectPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <collect-list v-if="collectPop.show" @collectDetail="collectDetail"
                    @closePop="closePop();$refs.personal.collect();"></collect-list>
    </popup>
    <!-- 常用地址 -->
    <popup v-model="addrPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <addr-list v-if="addrPop.show" @collectDetail="collectDetail"
                 @closePop="closePop();$refs.personal.addr();"></addr-list>
    </popup>
    <!--地址设置-->
    <popup v-model="paddrPop.show" style="z-index:999;height:100%;width:100%;" position="bottom">
      <p-addr v-if="paddrPop.show"
              @closePop="closePop"
              @subSuccess="closePop();$refs.personal.addr();"></p-addr>
    </popup>
    <!-- 上报列表 -->
    <popup v-model="myshangbaoPop.show" position="right" width="100%" height="100%" style="z-index:999;">
      <shangbao-list v-if="myshangbaoPop.show" @closePop="closePop();$refs.personal.shangbao();"></shangbao-list>
    </popup>
    <!-- 周边 -->
    <popup v-model="zhoubianPop.show" position="left" height="100%" width="100%" style="z-index:999;"
           :show-mask="false">
      <zhoubian v-if="zhoubianPop.load" @closePop="closePop"
                @zhoubianDetail="(ii,list)=>{zhoubianPop.show=false;searchpoi(true,ii.serviceurl,ii.tag?ii.tag:ii.name,list,false,zhoubianQuery)}"></zhoubian>
    </popup>
    <!-- 上报 -->
    <div v-transfer-dom>
      <popup v-model="shangbaoPop.show" height="100%" :show-mask="false" @on-first-show="firstShow" id="pop">
        <shangbao-form @closePop="closePop()" v-if="shangbaoPop.show"></shangbao-form>
      </popup>
    </div>
    <!-- 右侧专题列表 -->
    <popup v-model="zhuantiPop.show" position="right" height="100%" width="100%" :show-mask="false"
           style="z-index:1000;">
      <Zhuanti v-show="zhuantiPop.load" @closePop="closePop"
               @zhuantiDetail="(ii,list)=>{
                  dituPop.show=false;closePop();
                  searchpoi(true,ii.serviceurl,ii.tag,list,true,false,ii.icon,true);
                  $refs.zhuanti.clearZt();
               }"></Zhuanti>
    </popup>
    <!-- 右侧地图 -->
    <popup v-model="dituPop.show" position="right" height="100%" width="70%" style="z-index:999;">
      <ditu-map v-if="dituPop.load" ref="zhuanti"
                @dituChange="dituChange"
                @hisChange="lishi"
                @zhuantiChange="zhuantiChange"
                @zhuantiMore="zhuantiPop.show=true;zhuantiPop.load=true;"
                @zhuantiDetail="(ii,list)=>{dituPop.show=false;searchpoi(true,ii.serviceurl,ii.tag,null,true,false,ii.pic,true)}"></ditu-map>
    </popup>
    <!-- 搜索结果 -->
    <popup v-model="searchMap.page.show" height="80%" id="searchRes" :show-mask="false"
           style="height:calc(100% - 51px);padding: 0 10px;width: calc(100% - 40px);border-radius: 5px;left: 10px;">
      <!-- 顶部关闭 -->
      <div class="tmap-search-tool">
        <img src="@/images/down10.png" @click="searchMap.page.show=false" alt="">
        <img src="@/images/close.png" @click="searchMap.page.show=false;searchMap.page.data=[];zhuantiClear();"
             class="cls" alt="">
      </div>
      <!-- 同组按钮 -->
      <tab v-if="searchMap.page.show && searchMap.tongzuList && searchMap.tongzuList.length>0">
        <tab-item v-for="i in searchMap.tongzuList" :selected="i.tag==searchMap.tag"
                  @click.native="i.iszhuanti?zhuantiClear(i.name):'';searchpoi(true,i.serviceurl?i.serviceurl:searchMap.url,i.tag?i.tag:i.name,searchMap.tongzuList,i.iszhuanti,i.iszhoubian && zhoubianQuery,i.pic || i.icon || '')"
                  style="flex: none;padding: 0 10px;width:auto;"
                  :style="{'min-width':searchMap.tongzuList.length<5?(100/searchMap.tongzuList.length)+'%':''}">
          {{i.name}}
        </tab-item>
      </tab>
      <!-- 筛选列表 -->
      <div class="shaixuan">
        <div :class="searchMap.shaixuan.on2?'':'on'" @click="julipaixu">
          <img src="@/img/ico_lm.png" v-if="searchMap.shaixuan.on2">
          <img src="@/img/ico_lm_ov.png" v-else alt="">热门
        </div>
        <!-- 暂时隐藏距离 -->
        <div v-show="false" :class="searchMap.shaixuan.on2?'on':''" @click="julipaixu">
          <img src="@/img/ico_jl.png" v-if="!searchMap.shaixuan.on2">
          <img src="@/img/ico_jl_ov.png" v-else alt="">距离
        </div>
      </div>
      <!-- 搜索列表 -->
      <div class="tmap-search-result" style="height:calc(100% - 128px);overflow:auto;">
        <div class="s-result_item" v-for="(i,idx) in hotSpotDesc">
          <!-- 点击详情 -->
          <div class="s_result_item-info" @click="searchInfo(i)">
            <div>{{i.attributes.NAME||i.attributes.name}} <span v-if="i.attributes.DALEI"
                                                                style="background:#eeeef8;padding:2px 5px;font-size:12px;font-weight:normal;border-radius: 5px;color:#666;position: static;display: inline-block;">
                      {{i.attributes.DALEI}}</span></div>
            <div class="info" v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
            <!-- 暂时隐藏距离 -->
            <div class="info" v-if="false && i.attributes.juli">距离：{{i.attributes.juli}}km</div>
            <!-- 标签 -->
            <!--<div v-if="i.attributes.TAG" class="item-tag-list">
              <span v-for="ii in (i.attributes.TAG).split(',')" class="item-tag">{{ii}}</span>
            </div>-->
          </div>
          <!-- 导航 -->
          <!-- 暂时隐藏 -->
          <div class="s_result_item-icon" v-show="false">
            <img src="@/images/i-daohang.png"
                 @click="openLocation(i.attributes.CENTERX,i.attributes.CENTERY,i.attributes.NAME,i.attributes.ADDRESS,'')"
                 alt="">
          </div>
        </div>
        <!-- 更多 -->
        <div class="bottom-btn" style="text-align: center" v-if="searchMap.page.loadmore"
             @click="searchpoi(false,searchMap.url,searchMap.tag,searchMap.tongzuList)">更多
        </div>
        <div style="text-align: center;color:#666;margin-top:10px;" v-else>没有更多了</div>
      </div>
    </popup>
    <!-- 底部多少条 -->
    <div v-if="!searchMap.page.show && searchMap.page.data && searchMap.page.data.length && searchMap.count"
         @click.sync="searchMap.page.show=true"
         style="position:fixed;bottom:0;height:36px;line-height:36px;background:#fff;z-index:1;width:100%;text-align: center;">
      在<b class="on">{{searchMap.tag || searchMap.key}}</b>找到<b class="on">{{searchMap.count}}</b>条记录
    </div>
    <!-- 详细信息 -->
    <popup v-model="infoPop.show" :show-mask="false"
           style="max-height:calc(100% - 100px);padding: 0 10px;width:100%;box-sizing: border-box;z-index:400;">
      <div class="info-pop">
        <!-- 顶部关闭 -->
        <div class="info-pop-tool">
          <img v-show="!infoPop.iscollect && !searchMap.hideReturn" src="@/images/back.png"
               @click="infoPop.show=false;searchMap.page.show=true;" class="rtn" alt="">
          <!--  -->
          <!-- 暂时隐藏 -->
          <template v-if="false">
            <img v-if="infoPop.simple" src="@/images/up10.png" @click="Xiangxi" alt="">
            <img v-else src="@/images/down10.png" @click="infoPop.simple = true" alt="">
          </template>
          <!--  -->
          <img src="@/images/close.png" @click="infoPop.show=false;clearInfo();" class="cls" alt="">
        </div>
        <!-- 详细 -->
        <div class="info-pop-con">
          <div style="overflow:hidden;position: relative">
            <div style="float:left;width:68%">
              <div class="info-pop_tit">{{infoPop.info.name || infoPop.info.NAME || infoPop.info['名称']}}</div>
              <div class="info-pop_info">
                <!-- 暂时隐藏距离 -->
                <div v-if="false && infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
                <div v-if="infoPop.info.address||infoPop.info.ADDRESS">
                  地址：{{infoPop.info.address||infoPop.info.ADDRESS}}
                </div>
                <div v-if="infoPop.info.area || infoPop.info['tdt.dbo.B_SOUSOU.AREA']">区域：{{infoPop.info.area ||
                  infoPop.info['tdt.dbo.B_SOUSOU.AREA']}}
                </div>
                <div v-if="infoPop.info.phone||infoPop.info.PHONE">
                  <a class="on" style="text-decoration: underline;"
                     :href="'tel:'+ (infoPop.info.phone || infoPop.info.PHONE)">电话：{{infoPop.info.phone||infoPop.info.PHONE}}</a>
                </div>
              </div>
            </div>
            <!-- 暂时隐藏 -->
            <div class="bt_mp" style="bottom:13px;" v-if="false && infoPop.info.ADDRESS" @click="Xiangxi">展开详情</div>
          </div>
          <div v-if="false" class="map_btn" style="margin-top:15px;">
            <a class="on" @click="zhoubianPop.show=true;zhoubianPop.load=true;zhoubianQuery=true;
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
            <a class="on"
               @click="openLocation(infoPop.info.CENTERX,infoPop.info.CENTERY,infoPop.info.NAME,infoPop.info.ADDRESS,'')">导航</a>
            <a :class="quanjingPop.url?'on':''" @click="findQuanjing">全景</a>
            <a class="on" @click="guidPop.show=true;guidPop.form.guid=infoPop.info.FEATUREGUID">传图</a>
          </div>
          <!--<div class="info-pop-con">
          <div class="info-pop_tit">{{infoPop.info.NAME}}</div>
          <div class="info-pop_info">
            <div v-if="infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
            <div v-if="infoPop.info.ADDRESS">地址：{{infoPop.info.ADDRESS}}</div>
          </div>
          <div class="info-pop_btn">
            &lt;!&ndash; (infoPop.info.imgList && infoPop.info.imgList.length) &ndash;&gt;
            <div @click="Xiangxi" :class="infoPop.info.ADDRESS?'on':''">
              <img v-if="infoPop.info.ADDRESS" src="@/images/tem-1o.png" alt="">
              <img v-else src="@/images/tem-1.png" alt="">详 情</div>
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
            &lt;!&ndash;<div><img src="@/images/tem-8.png" alt="">评论</div>&ndash;&gt;
            <div @click="openLocation(infoPop.info.CENTERX,infoPop.info.CENTERY,infoPop.info.NAME,infoPop.info.ADDRESS,'')">
              <img src="@/images/tem-7.png" alt="">导航
            </div>
          </div>-->
          <!--  -->
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
                 @zhoubian="zhoubianPop.show=true;zhoubianPop.load=true;zhoubianQuery=true;
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
      <div class="y-input" style="margin:10px;">
        <label>照片</label>
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
                   :centerx="jiucuoPop.centerx" :centery="jiucuoPop.centery" :pname="jiucuoPop.name"
                   :zoom="jiucuoPop.zoom"
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
    <!-- 室内详细 -->
    <!--<popup v-model="shinei.shangpuShow" :show-mask="false"
           style="max-height:calc(100% - 100px);padding: 0 10px;width: calc(100% - 20px);">
      <div class="info-pop">
        &lt;!&ndash; 顶部关闭 &ndash;&gt;
        <div class="info-pop-tool">
          <img style="display:none;">
          &lt;!&ndash;  &ndash;&gt;
          <img v-if="shinei.shangpuSimple" src="@/images/up10.png" @click="shangpuXiangxi" alt="">
          <img v-else src="@/images/down10.png" @click="shinei.shangpuSimple = true" alt="">
          &lt;!&ndash;  &ndash;&gt;
          <img src="@/images/close.png" @click="shinei.shangpuShow=false" class="cls" alt="">
        </div>
        &lt;!&ndash; 详细 &ndash;&gt;
        <div class="info-pop-con">
          <div class="info-pop_tit">{{shinei.shangpu.NAME}}</div>
          <div class="info-pop_info">
            <div v-if="shinei.shangpu.ADDRESS">地址：{{shinei.shangpu.ADDRESS}}</div>
          </div>
          <div class="info-pop_btn">
            <div @click="shangpuXiangxi" v-if="shinei.shangpuSimple"><img src="@/images/tem-1.png" alt="">详 细</div>
            <div @click="shinei.shangpuSimple = true" v-else><img src="@/images/tem-1.png" alt="">简 介</div>
            &lt;!&ndash;<div @click="findQuanjing"><img src="@/images/tem-2.png" alt="">全 景</div>&ndash;&gt;
            <div @click="guidPop.show=true;guidPop.form.guid=shinei.shangpu.FEATUREGUID"><img src="@/images/tem-3.png" alt="">上传照片</div>
          </div>
          &lt;!&ndash; 照片 &ndash;&gt;
          <div class="info-pop_img" v-if="!shinei.shangpuSimple">
            <div v-if="shinei.shangpu.imgList">
              &lt;!&ndash; 图片列表 &ndash;&gt;
              <a @click="previewImage(shinei.imgurl+shinei.name+'/'+i.image)"
                 v-for="(i,idx) in shinei.shangpu.imgList">
                <div :style="{'background':'url('+shinei.imgurl+shinei.name+'/'+i.image+') no-repeat center 100%','background-size':'100%'}"></div>
              </a>
            </div>
          </div>
          <div class="info-pop_btn2">
            <div><img src="@/images/tem-5.png" alt="" >周边</div>
            <div @click="jiucuoPop.guid=shinei.shangpu.featureguid;
                          jiucuoPop.centerx=shinei.shangpu.centerx;
                          jiucuoPop.centery=shinei.shangpu.centery;
                          jiucuoPop.name=shinei.shangpu.name;
                          jiucuoPop.zoom=$refs.map.$data.view.zoom;
                          jiucuoPop.show=true;"><img src="@/images/tem-4.png" alt="" >纠错</div>
            <div @click="shangpuShoucang">
              <img src="@/images/shoucang1.png" v-if="shinei.shangpu.collect && shinei.shangpu.collect.id" alt="" >
              <img src="@/images/shoucang.png" v-else alt="" >收藏
            </div>
            &lt;!&ndash;<div><img src="@/images/tem-8.png" alt="">评论</div>&ndash;&gt;
            <div @click="openLocation(shinei.shangpu.centerx,shinei.shangpu.centery,shinei.shangpu.name,shinei.shangpu.address,'')">
              <img src="@/images/tem-7.png" alt="">导航
            </div>
          </div>
          &lt;!&ndash; 内容 &ndash;&gt;
          <div class="info-pop_con" v-if="!infoPop.simple && shinei.shangpu.SUMMARY">
            {{shinei.shangpu.SUMMARY}}
          </div>
        </div>
      </div>
    </popup>-->
  </div>
</template>

<script>
    import Util from '@/libs/util';
    import esriLoader from 'esri-loader';
    import Tianditu from '@/components/libs/tianditu/main';
    import Uploader from '@/components/libs/Uploader/Uploader';
    import MapUtil from '@/components/libs/tianditu/util';
    import {Popup, Tab, TabItem} from 'vux';
    import Personal from '@/components/personal/index';//个人中心
    import PAddr from '@/components/personal/addr/form';
    import AddrList from '@/components/personal/addr/list';//地址列表
    import CollectList from '@/components/personal/collect/list';//收藏
    import ShangbaoList from '@/components/personal/shangbao/list';//上报列表
    import Zhoubian from '@/components/map/zhoubian';
    import DituMap from '@/components/map/index';//右侧地图
    import ShangbaoForm from '@/components/personal/shangbao/form.vue';//上报
    import JiucuoForm from '@/components/personal/jiucuo/form.vue';//纠错
    import Zhuanti from '@/components/map/zhuanti';
    import TContent from '@/components/home/listView';
    import SearchData from '@/datas/search.json';

    export default {
        components: {
            Tianditu, Popup, Personal, DituMap, ShangbaoForm, JiucuoForm, CollectList, ShangbaoList, Zhoubian, Uploader
            , Tab, TabItem, AddrList, PAddr, Zhuanti, TContent
        },
        data() {
            return {
                lng: null,
                lat: null,
                zoom: null,
                maploading: false,
                drawloading: false,
                cejuShow: false,
                cemianShow: false,
                huixianShow: false,//绘线
                huimianShow: false,//绘面
                fenxiangShow: false,//分享
                lukuangShow: false,//路况
                shinei: {
                    load: false,
                    show: false,
                    showEvent: null,
                    clickEvent: null,
                    imgurl: "https://portal.wzdmdz.com/原图/室内地图/",
                    name: "",
                    louceng: [],//楼层
                    shangpu: {},//商铺信息
                    shangpuShow: false,
                    shangpuSimple: true,//简要显示
                    idx: 0
                },
                list: [
                    {
                        index: 4,
                        tag: '借阅',
                        serviceurl: 'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/1',
                        pic: require('@/images/1.png')
                    },
                    // {index:5,tag:'医疗',serviceurl:'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/0',pic:require('@/images/2.png')},
                    {index: 5, tag: '医疗', serviceurl: '暂无', pic: require('@/images/2.png')},
                    {
                        index: 6,
                        tag: '停车',
                        serviceurl: 'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/2',
                        pic: require('@/images/3.png')
                    },
                    {index: 7, tag: '租房', serviceurl: '暂无', pic: require('@/images/4.png')},
                    {index: 8, tag: '健身', serviceurl: '暂无', pic: require('@/images/5.png')},
                    {
                        index: 9,
                        tag: '旅游',
                        serviceurl: 'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/3',
                        pic: require('@/images/6.png')
                    },
                    {index: 10, tag: '出行', serviceurl: '暂无', pic: require('@/images/7.png')},
                    {index: 11, tag: '更多', serviceurl: '暂无', pic: require('@/images/8.png')},

                ],
                juliShow: false,
                juliClick: null,
                juliInfo: "",
                shiquShow: false,//拾取
                shiquClick: null,
                quanjingShow: false,
                shiquLocation: null,//拾取坐标
                draw: null,
                view: null,
                is3D: false,
                mapLocation: {},
                mapCenter: [],
                searchMap: {
                    count: 0,
                    shaixuan: {
                        on2: false
                    },
                    hideReturn: false,
                    key: "",
                    tempKey: "",//上一次
                    tag: "",
                    url: "",
                    page: {
                        pageSize: 20,
                        pageNum: 1,
                        start: 0,
                        data: [],
                        show: false,
                        loadmore: true
                    },
                    show: false,//面板显示
                    hisShow: true,//显示历史
                    hisList: [],//历史记录
                    itemList: [],//几大块
                    tongzuList: []//同组
                },
                personPop: {
                    show: false,
                    load: false
                },
                paddrPop: {show: false},
                addrPop: {
                    show: false,
                    load: false
                },
                zhoubianPop: {
                    show: false,
                    load: false,
                    lng: null,
                    lat: null
                },
                zhuantiPop: {
                    show: false,
                    load: false
                },
                myshangbaoPop: {
                    show: false
                },
                dituPop: {
                    show: false,
                    load: false
                },
                shangbaoPop: {
                    show: false
                },
                //纠错
                jiucuoPop: {
                    show: false,
                    guid: '',
                    centerx: 0,
                    centery: 0,
                    name: '',
                    zoom: 12
                },
                infoPop: {
                    show: false,
                    iscollect: false,
                    info: {},
                    simple: true
                },
                quanjingPop: {
                    show: false,
                    url: ""
                },
                //guid上传图片
                guidPop: {
                    show: false,
                    form: {}
                },
                collectPop: {
                    show: false,
                    load: false
                },
                toolshow: false,
                zhoubianQuery: true//周边查询
            }
        },
        computed: {
            wxuser() {
                return this.$store.getters.wxuser;
            },
            // 排序列表的hotspot(降序)
            hotSpotDesc() {
                if (this.searchMap.page.data.length <= 0 || (this.searchMap.page.data[0]['attributes'] && !this.searchMap.page.data[0]['attributes']['HOTSPOT'] && this.searchMap.page.data[0]['attributes']['HOTSPOT'] !== 0)) return this.searchMap.page.data;
                return this.searchMap.page.data.sort((a, b) => {
                    return -(a['attributes']['HOTSPOT'] - b['attributes']['HOTSPOT']);
                });
            }
        },
        methods: {
            goToXypt() {
                window.open('http://tdtservices.wzmap.gov.cn/#/', '_self', null, false);
            },
            testcomplete() {
                this.draw.complete();
            },
            //清除详细点
            clearInfo() {
                const map = this.$refs.map.$data.map;
                if (map.findLayerById('searchInfo') != null) {
                    map.remove(map.findLayerById('searchInfo'));
                }
            },
            clearKey() {
                this.searchMap.key = '';
                $("#searchKey").focus();
                const self = this;
                /*setTimeout(function () {
          self.searchMap.show=true;
        },100);*/
            },
            firstShow() {
                /*var $pop = $('#pop');
        var pop = $pop[0];
        const self = this;
        pop.addEventListener("touchstart", function (event) {
          console.log($pop.scrollTop());
          self.scrollTop = $pop.scrollTop();
          self.startY = event.targetTouches[0].pageY;
        });
        pop.addEventListener("touchmove", function (event) {
          event.preventDefault();
          const pageY = event.targetTouches[0].pageY;
          $pop.scrollTop(self.scrollTop+(self.startY - pageY));
        });*/
            },
            tips(type) {
                let tips = '';
                switch (type) {
                    case 'ceju':
                        tips = '';
                        break;
                    case 'cemian':
                        tips = '';
                        break;
                }

            },
            focusout() {
                const self = this;
                self.searchMap.show = false;
            },
            mapload(map, view) {
                const self = this;
                self.maploading = true;
                //室内地图
                //this.$refs.map.shinei(map,this.$refs.map.$data.view);
                //没有定义中心时定位
                if (!this.lng || !this.lat) {
                    self.dingwei(true);
                }
                //GUIDFOUND
                /*if(self.$route.query && self.$route.query.guid){
          if(self.$route.query.loadmap=='false' && localStorage.getItem('infoItem')){
            self.searchInfo(JSON.parse(localStorage.getItem('infoItem')),true,true);
          }else if(self.$route.query.loadmap=='true' && localStorage.getItem('infoItem')){
            self.searchInfo(JSON.parse(localStorage.getItem('infoItem')),true,false);
          }else{
            self.guidFound(self.$route.query.guid,false,self.$route.query.loadmap=='true'?false:true);
          }
        }*/
            },
            huixian() {
                const self = this;
                if (this.huixianShow) {
                    this.qingchu();
                } else {
                    if (this.cemianShow || this.juliShow || this.shiquShow || this.huimianShow || this.cejuShow) {
                        this.qingchu();
                    }
                    this.huixianShow = true;
                    this.createDraw(function () {
                        MapUtil.enableCreateLine(self.draw, self.$refs.map.$data.view, true);
                    });
                }
            },
            huimian() {
                const self = this;
                if (this.huimianShow) {
                    this.qingchu();
                } else {
                    if (this.cemianShow || this.cejuShow || this.juliShow || this.shiquShow || this.huixianShow) {
                        this.qingchu();
                    }
                    this.huimianShow = true;
                    this.createDraw(function () {
                        MapUtil.enableCreatePolygon(self.draw, self.$refs.map.$data.view, true);
                    });
                }
            },
            cemian() {
                const self = this;
                if (this.cemianShow) {
                    this.qingchu();
                } else {
                    if (this.cejuShow || this.juliShow || this.shiquShow || this.huimianShow || this.huixianShow) {
                        this.qingchu();
                    }
                    this.cemianShow = true;
                    this.createDraw(function () {
                        MapUtil.enableCreatePolygon(self.draw, self.$refs.map.$data.view);
                    });
                }
            },
            ceju() {
                const self = this;
                if (this.cejuShow) {
                    this.qingchu();
                } else {
                    if (this.cemianShow || this.juliShow || this.shiquShow || this.huimianShow || this.huixianShow) {
                        this.qingchu();
                    }
                    this.cejuShow = true;
                    this.createDraw(function () {
                        MapUtil.enableCreateLine(self.draw, self.$refs.map.$data.view);
                    });
                }
            },
            shishijuli() {
                const self = this;
                if (!this.mapLocation) {
                    this.dingwei(false, function () {
                        self.doshiqu();
                    });
                } else {
                    self.doshiqu();
                }
            },
            doshiqu() {
                const self = this;
                if (this.juliShow) {
                    this.qingchu();
                    return;
                }
                if (this.cemianShow || this.cejuShow || this.shiquShow || this.huimianShow || this.huixianShow) {
                    this.qingchu();
                }
                this.juliShow = true;
                esriLoader.loadModules([
                    'esri/geometry/Point',
                    'esri/layers/GraphicsLayer',
                    'esri/Graphic'
                ]).then(([Point, GraphicsLayer, Graphic]) => {
                    var symbol = {
                        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                        url: "images/location.png",
                        width: "50px",
                        height: "50px"
                    };
                    const map = self.$refs.map.$data.map;
                    self.$refs.map.ishitTest = false;
                    var point = new Point({
                        "x": self.mapLocation.lng,
                        "y": self.mapLocation.lat,
                        "spatialReference": map.spatialReference
                    });
                    var picGraphic = new Graphic(point, symbol);
                    if (map.findLayerById('dingwei') != null) {
                        map.remove(map.findLayerById('dingwei'));
                    }
                    var locationLayer = new GraphicsLayer({
                        id: "dingwei"
                    });
                    locationLayer.add(picGraphic);
                    map.add(locationLayer);
                });
                this.createDraw(function () {
                    esriLoader.loadModules([
                        "esri/Graphic",
                        "esri/geometry/Polyline",
                        "esri/geometry/geometryEngine"
                    ]).then(([Graphic, Polyline, geometryEngine]) => {
                        const view = self.$refs.map.$data.view;
                        //const map = this.$ref.smap.$data.map;
                        self.juliClick = view.on('click', function (e) {
                            view.graphics.removeAll();
                            //console.log(vertices);
                            var lines = new Polyline({
                                paths: [[self.mapLocation.lng, self.mapLocation.lat], [e.mapPoint.longitude, e.mapPoint.latitude]],
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
                    });
                });
            },
            shiqu() {
                const self = this;
                if (this.shiquShow) {
                    this.qingchu();
                    return;
                }
                if (this.cemianShow || this.juliShow || this.cejuShow || this.huimianShow || this.huixianShow) {
                    this.qingchu();
                }
                /*this.createDraw(function () {
            esriLoader.loadModules([
              'esri/symbols/PictureMarkerSymbol',
              'esri/geometry/Point',
              'esri/layers/GraphicsLayer',
              'esri/Graphic'
            ]).then(([PictureMarkerSymbol,Point,GraphicsLayer,Graphic])=>{
              const view = self.$refs.map.$data.view;
              const map = self.$refs.map.$data.map;

              var action = self.draw.create("point");
              action.on("cursor-update", function (evt) {
                createPointGraphic(evt.coordinates);//coordinates
              });
              // PointDrawAction.draw-complete
              // Create a point when user clicks on the view or presses "C" key.
              action.on("draw-complete", function (evt) {
              	console.log(2);
                view.graphics.removeAll();
                //action.complete();
                self.draw.reset();
                action = self.draw.create("point");
              });

              function createPointGraphic(coordinates){
                view.graphics.removeAll();
                var point = {
                  type: "point", // autocasts as /Point
                  x: coordinates[0],
                  y: coordinates[1],
                  spatialReference: view.spatialReference
                };
                var graphic = new Graphic({
                  geometry: point,
                  symbol: {
                    type: "simple-marker", // autocasts as SimpleMarkerSymbol
                    style: "square",
                    color: "red",
                    size: "16px",
                    outline: { // autocasts as SimpleLineSymbol
                      color: [255, 255, 0],
                      width: 3
                    }
                  }
                });
                view.graphics.add(graphic);
              }
            });
        });*/
                self.shiquShow = true;
                esriLoader.loadModules([
                    'esri/symbols/PictureMarkerSymbol',
                    'esri/geometry/Point',
                    'esri/layers/GraphicsLayer',
                    'esri/Graphic'
                ]).then(([PictureMarkerSymbol, Point, GraphicsLayer, Graphic]) => {
                    var symbol = {
                        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                        url: "images/s1.png",
                        width: "30px",
                        height: "30px"
                    };
                    const view = self.$refs.map.$data.view;
                    const map = self.$refs.map.$data.map;
                    self.$refs.map.ishitTest = false;
                    self.shiquClick = view.on('click', function (e) {
                        //console.log(2);
                        if (!self.shiquShow) {
                            return;
                        }
                        var point = new Point({
                            "x": e.mapPoint.longitude,
                            "y": e.mapPoint.latitude,
                            "spatialReference": map.spatialReference
                        });
                        self.shiquLocation = {
                            lng: (e.mapPoint.longitude).toFixed(4),
                            lat: (e.mapPoint.latitude).toFixed(4)
                        };
                        var picGraphic = new Graphic(point, symbol);
                        if (map.findLayerById('shiquLayer') != null) {
                            map.remove(map.findLayerById('shiquLayer'));
                        }
                        let shiquLayer = new GraphicsLayer({
                            id: 'shiquLayer',
                        });
                        shiquLayer.add(picGraphic);
                        map.add(shiquLayer);
                    })
                });
            },
            //清除
            qingchu(state) {
                if (this.draw) {
                    this.draw.reset();
                }
                if (MapUtil.action1) {
                    MapUtil.action1.complete();
                }
                if (MapUtil.action2) {
                    MapUtil.action2.complete();
                }
                this.cejuShow = false;
                this.cemianShow = false;
                this.juliShow = false;
                if (this.juliClick) {
                    this.juliClick.remove();
                }
                this.shiquShow = false;
                if (this.shiquClick) {
                    this.shiquClick.remove();
                }
                this.huimianShow = false;
                this.huixianShow = false;
                const map = this.$refs.map.$data.map;
                const view = this.$refs.map.$data.view;
                /*if(map.wxlocationLayer!=null){
        	map.wxlocationLayer.removeAll();
        }*/
                if (map.locationLayers != null) {
                    map.locationLayers.removeAll();
                }
                if (map.findLayerById('shiquLayer') != null) {
                    map.remove(map.findLayerById('shiquLayer'));
                }
                if (map.findLayerById('zhuantilayer') != null && state) {
                    map.remove(map.findLayerById('zhuantilayer'));
                }
                if (map.findLayerById('dingwei') != null) {
                    map.remove(map.findLayerById('dingwei'));
                }
                if (map.findLayerById('searchInfo') && state) {
                    map.remove(map.findLayerById('searchInfo'));
                }
                view.graphics.removeAll();
                this.$refs.map.ishitTest = true;
            },
            dingwei(iscenter, callback) {
                const wx = this.$wechat;
                const self = this;
                wx.error(function (res) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    console.log(res);
                });
                wx.ready(function () {
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            self.mapLocation = {lng, lat};
                            //定位到中心
                            if (iscenter) {
                                esriLoader.loadModules([
                                    'esri/geometry/Point',
                                    'esri/layers/GraphicsLayer',
                                    'esri/Graphic'
                                ]).then(([Point, GraphicsLayer, Graphic]) => {
                                    var symbol = {
                                        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                                        url: "images/location.png",
                                        width: "50px",
                                        height: "50px"
                                    };
                                    const map = self.$refs.map.$data.map;
                                    var point = new Point({
                                        "x": lng,
                                        "y": lat,
                                        "spatialReference": map.spatialReference
                                    });
                                    var picGraphic = new Graphic(point, symbol);
                                    if (map.findLayerById('dingwei') != null) {
                                        map.remove(map.findLayerById('dingwei'));
                                    }
                                    var locationLayer = new GraphicsLayer({
                                        id: "dingwei"
                                    });
                                    locationLayer.add(picGraphic);
                                    map.add(locationLayer);
                                    self.$refs.map.$data.view.center = [lng, lat];
                                    if (callback) {
                                        callback();
                                    }
                                });
                            } else {
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    });
                });
            },
            createDraw(callback) {
                const self = this;
                self.$vux.loading.show('加载中');
                if (this.draw == null) {
                    if (self.drawloading) {
                        return;
                    }
                    self.drawloading = true;
                    esriLoader.loadModules([
                        "esri/views/2d/draw/Draw"
                    ])
                        .then(([Draw]) => {
                            let draw = new Draw({
                                view: self.$refs.map.$data.view
                            });
                            self.draw = draw;
                            self.drawloading = false;
                            self.$vux.loading.hide();
                            callback(draw);
                        });
                } else {
                    self.$vux.loading.hide();
                    callback();
                }
            },
            //影像
            yingxiang(hideBiaozhu) {
                this.$refs.map.yingxiangMap();
            },
            //仿真
            fangzhen() {
                this.$refs.map.fangzhenMap();
            },
            //历史地图
            lishi(year) {
                this.$refs.map.historyMap(year);
            },
            //搜索历史
            searchHis() {
                //加载历史
                const self = this;
                Util.ajax.post('/fapi/needlogin/searchhis/list').then(function (response) {
                    self.$set(self.searchMap, 'hisList', response.data || []);
                });
                //显示
                this.searchMap.show = true;
            },
            clearSearchHis() {
                const self = this;
                Util.ajax.post('/fapi/needlogin/searchhis/clear').then(function (response) {
                    if (response.data.code == 100) {
                        self.$set(self.searchMap, 'hisList', []);
                        self.$vux.toast.text('清除成功');
                    } else {
                        self.$vux.alert.show(response.data.msg);
                    }
                });
            },
            //搜索
            searchpoi(flush, url, tag, list, iszhuanti, iszhoubian, pic, zhuantihide) {
                console.log(flush, url, tag, list, iszhuanti, iszhoubian, pic, zhuantihide)
                //console.log(tag);
                if (url == '暂无') {
                    this.$vux.toast.text('暂无数据');
                    return;
                }
                if (!this.searchMap.key && !tag && url != 'https://services.wzmap.gov.cn/server/rest/services/TDT/JCQ/MapServer/0') {
                    this.$vux.toast.text('请输入关键词');
                    return;
                }
                const self = this;
                let key = this.searchMap.key;
                this.$set(this.searchMap, 'tempKey', key);
                if (key) {
                    Util.ajax.post('/fapi/needlogin/searchhis/add', {searchkey: key}).then(function (response) {
                        self.searchMap.hisList.push(key);
                    });
                }
                if (flush) {
                    this.searchMap.page.start = 0;
                    this.searchMap.page.pageNum = 1;
                    this.searchMap.page.data = [];
                } else {
                    this.searchMap.page.pageNum++;
                    this.searchMap.page.start = this.searchMap.page.start + this.searchMap.page.pageSize;
                }
                this.infoPop.show = false;
                this.infoPop.simple = true;
                self.$vux.loading.show('搜索中');

                let querywhere = "";
                esriLoader.loadModules([
                    "esri/tasks/QueryTask",
                    "esri/tasks/support/Query",
                    "esri/geometry/Polyline",
                    "esri/geometry/geometryEngine",
                    'esri/geometry/Circle',
                    'esri/geometry/Point'
                ]).then(async ([QueryTask, Query, Polyline, geometryEngine, Circle, Point]) => {
                    var layerurl2 = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
                    var layerurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/1";
                    //var layerurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/QUANJING/MapServer/1";
                    if (url) {
                        layerurl = url;
                        self.searchMap.url = url;
                    } else {
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
                    query.where = " ( NAME LIKE '%" + key + "%' OR ADDRESS LIKE '%" + key + "%' ) ";//AND FSCALE<="+view.zoom  // Return all cities with a population greater than 1 million
                    //标签
                    if (tag) {
                        //标签
                        query.where = "TAG LIKE '%" + tag + "%' AND NAME is not null";
                        if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7') {
                            query.where = "tdt.DBO.教育.TAG LIKE '%" + tag + "%' "//AND tdt.dbo.t_base_photo.Sort=1
                            query.groupByFieldsForStatistics = ["tdt.DBO.教育.NAME"];
                        } else if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/4') {
                            query.where = "tdt.DBO.观光旅游_ZT.TAG LIKE '%" + tag + "%' "//AND tdt.dbo.t_base_photo.Sort=1
                            query.groupByFieldsForStatistics = ["tdt.DBO.观光旅游_ZT.NAME"];
                        }
                        self.searchMap.tag = tag;
                    } else {
                        self.searchMap.tag = '';
                    }
                    //同组
                    if (list && list.length) {
                        self.$set(self.searchMap, 'tongzuList', list)
                    } else {
                        if (tag) {
                            Util.ajax.post('/fapi/public/option/zttongzu?name=' + tag).then(function (response) {
                                if (response.data && response.data.length) {
                                    if (iszhuanti) {
                                        response.data.forEach(function (data) {
                                            data.iszhuanti = true;
                                        });
                                    }
                                    self.$set(self.searchMap, 'tongzuList', response.data)
                                }
                            });
                        } else {
                            self.$set(self.searchMap, 'tongzuList', []);
                        }
                    }
                    //周边2公里
                    if (iszhoubian) {
                        var geo = new Circle(new Point({
                            "x": self.zhoubianPop.lng ? self.zhoubianPop.lng : (self.mapLocation.lng ? self.mapLocation.lng : view.center.x),
                            "y": self.zhoubianPop.lat ? self.zhoubianPop.lat : (self.mapLocation.lat ? self.mapLocation.lat : view.center.y),
                            "spatialReference": map.spatialReference
                        }), {"radius": 2000});
                        query.geometry = geo;
                        self.$set(self.searchMap, 'iszhoubian', true);
                    } else {
                        self.$set(self.searchMap, 'iszhoubian', false);
                    }
                    // if (url.indexOf('http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/') > -1) {
                    //   query.orderByFields = ["HOTSPOT DESC"];
                    //   query.returnCountOnly = false;
                    //   query.returnCentroid = false;
                    //   query.outFields = ["*"];
                    // }
                    if (!url) {
                        query.orderByFields = ["FEATUREGUID DESC"];
                    }
                    if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7') {
                        query.orderByFields = ["tdt.DBO.教育.HOTSPOT DESC"];
                    } else if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/4') {
                        query.orderByFields = ["tdt.DBO.观光旅游_ZT.HOTSPOT DESC"];
                    }
                    if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/JCQ/MapServer/0') {
                        query.orderByFields = [];
                        query.where = '1=1';
                        /*query.start = null;
            query.num = null;*/
                    }
                    // When resolved, returns features and graphics that satisfy the query.
                    querywhere = query.where;
                    //是否关键字搜索
                    if (!url) {
                        query.where = " ( NAME LIKE '%" + key + "%' OR ADDRESS LIKE '%" + key + "%' OR SHORTNAME LIKE '%" + key + "%' ) ";
                        let response = await queryTask.execute(query);
                        let searchArr = [];
                        let total = 0;
                        if (!response.features || response.features.length < 1) {
                            response = await Util.ajax.post('/sousuo2/_search', {
                                "query": {
                                    "multi_match": {
                                        "query": key,
                                        "type": "best_fields",
                                        "fields": ["name^2", "address", "shortname^2"],
                                        "tie_breaker": 0.2
                                    }
                                },
                                "size": self.searchMap.page.pageSize,
                                "from": self.searchMap.page.start
                            })
                            searchArr = response.data.hits.hits;
                            total = response.data.hits.total;
                            searchArr.forEach(function (poi) {
                                self.$set(poi, 'attributes', {
                                    NAME: poi._source.name,
                                    ADDRESS: poi._source.address,
                                    CENTERX: poi._source.centerx,
                                    CENTERY: poi._source.centery,
                                    SORT: poi._source.sort,
                                    DALEI: poi._source.dalei,
                                    FEATUREGUID: poi._source.featureguid
                                });
                            });
                        } else {
                            searchArr = response.features;
                            total = searchArr.length;
                        }
                        if (searchArr && searchArr.length == self.searchMap.page.pageSize) {
                            self.searchMap.page.loadmore = true;
                        } else {
                            self.searchMap.page.loadmore = false;
                        }
                        self.$set(self.searchMap, 'count', total);
                        searchArr.forEach(function (poi) {
                            if (poi.attributes.CENTERX && poi.attributes.CENTERY != 'NULL') {
                                var po = new Polyline({
                                    paths: [[self.mapLocation.lng || view.center.x, self.mapLocation.lat || view.center.y], [poi.attributes.CENTERX, poi.attributes.CENTERY]],
                                    spatialReference: view.spatialReference
                                });
                                self.$set(poi.attributes, 'juli', (geometryEngine.geodesicLength(po, "meters") / 1000).toFixed(2));
                            }
                            self.searchMap.page.data.push(poi);
                        });

                        self.searchMap.page.show = true;
                        self.searchMap.show = false;
                        self.infoPop.show = false;
                        self.infoPop.iscollect = false;
                        //按距离排
                        if (iszhoubian) {
                            self.searchMap.shaixuan.on2 = false;//距离排序
                            self.julipaixu();
                        } else {
                            self.searchMap.shaixuan.on2 = false;//筛选重置
                        }
                        self.$vux.loading.hide();

                    } else {
                        if (tag = '1=1') {
                            query.where = '1=1';
                        }
                        if (url === 'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/2') {
                            query.where = "1=1 and YYQK = '已运营'";
                        }
                        queryTask.execute(query).then(function (results) {
                            console.log(results);
                            //console.log(results.features);
                            if (results.features && results.features.length == self.searchMap.page.pageSize) {
                                self.searchMap.page.loadmore = true;
                            } else {
                                self.searchMap.page.loadmore = false;
                            }
                            results.features.forEach(function (poi) {
                                if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7') {
                                    poi.attributes = JSON.parse(JSON.stringify(poi.attributes).replace(/tdt\.DBO\.教育\./gi, ''));
                                } else if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/4') {
                                    poi.attributes = JSON.parse(JSON.stringify(poi.attributes).replace(/tdt\.DBO\.观光旅游_ZT\./gi, ''));
                                }
                                if (poi.attributes.FNAME && !poi.attributes.NAME) {
                                    poi.attributes.NAME = poi.attributes.FNAME;
                                }
                                if (poi.attributes.secondCheck == 1) {
                                    console.log(poi);
                                }
                                var arr;
                                //距离
                                try {
                                    if (poi.attributes.CENTERX) {
                                        arr = [poi.attributes.CENTERX, poi.attributes.CENTERY];
                                    } else if (poi.geometry && poi.geometry.x && poi.geometry.y) {
                                        poi.attributes.CENTERX = poi.geometry.x;
                                        poi.attributes.CENTERY = poi.geometry.y;
                                        arr = [poi.geometry.x, poi.geometry.y];
                                    }
                                    if (arr) {
                                        console.log(self.zhoubianPop.lng + "_" + self.zhoubianPop.lat);
                                        var po = new Polyline({
                                            paths: [[self.zhoubianPop.lng || self.mapLocation.lng || view.center.x, self.zhoubianPop.lat || self.mapLocation.lat || view.center.y], arr],
                                            spatialReference: view.spatialReference
                                        });
                                        self.$set(poi.attributes, 'juli', (geometryEngine.geodesicLength(po, "meters") / 1000).toFixed(2));
                                    }
                                } catch (e) {

                                }
                                self.searchMap.page.data.push(poi);
                            });
                            //显示多少条记录
                            if (flush) {
                                query.start = null;
                                query.num = null;
                                queryTask.executeForCount(query).then(function (results) {
                                    console.log(results);
                                    self.$set(self.searchMap, 'count', results);
                                });
                            }
                            //专题绘制
                            if (map.findLayerById('zhuantilayer')) {
                                map.remove(map.findLayerById('zhuantilayer'));
                            }
                            if (iszhuanti) {
                                esriLoader.loadModules([
                                    "esri/layers/FeatureLayer",
                                    "fcl/FlareClusterLayer_v4",
                                    "esri/renderers/ClassBreaksRenderer",
                                    "esri/symbols/SimpleFillSymbol",
                                    "esri/symbols/SimpleLineSymbol",
                                    "esri/symbols/SimpleMarkerSymbol",
                                    "esri/symbols/PictureMarkerSymbol",
                                    "esri/geometry/SpatialReference",
                                    'esri/tasks/support/Query',
                                    "esri/tasks/QueryTask"
                                ]).then(([FeatureLayer, fcl, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, PictureMarkerSymbol
                                             , SpatialReference, Query, QueryTask]) => {
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
                                    if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/11') {
                                        renderer = {
                                            type: "simple",
                                            symbol: {
                                                type: "simple-line", // autocasts as new SimpleLineSymbol()
                                                color: "#009e60",
                                                width: "3px",
                                                style: "solid"
                                            }
                                        }
                                    }
                                    //面
                                    if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/JCQ/MapServer/0') {
                                        renderer = {
                                            type: "simple",
                                            symbol: {
                                                type: "simple-fill", // autocasts as SimpleFillSymbol
                                                color: [0, 158, 96, 0.4],
                                                style: "solid",
                                                outline: { // autocasts as SimpleLineSymbol
                                                    color: [255, 255, 255],
                                                    width: 1
                                                }
                                            }
                                        }
                                        var featurelayer = new FeatureLayer(url, {
                                            outFields: ["*"],
                                            id: 'zhuantilayer',
                                            renderer: renderer,
                                            definitionExpression: querywhere
                                        });
                                        map.add(featurelayer);
                                        return;
                                    }
                                    /*var featurelayer = new FeatureLayer(url, {
                    outFields: ["*"],
                    id: 'zhuantilayer',
                    renderer: renderer,
                    definitionExpression: querywhere
                  });
                  map.add(featurelayer);*/

                                    //专题聚合
                                    var rSymbol = new SimpleMarkerSymbol({
                                        size: 26,
                                        color: "#FF0000",
                                        outline: null
                                    });

                                    renderer = new ClassBreaksRenderer({
                                        defaultSymbol: renderer.symbol
                                    });
                                    renderer.field = "clusterCount";

                                    var smSymbol = new SimpleMarkerSymbol({
                                        size: 22,
                                        outline: new SimpleLineSymbol({color: [221, 159, 34, 0.8]}),
                                        color: [255, 198, 0, 0.8]
                                    });
                                    var mdSymbol = new SimpleMarkerSymbol({
                                        size: 24,
                                        outline: new SimpleLineSymbol({color: [82, 163, 204, 0.8]}),
                                        color: [0, 170, 255, 0.8]
                                    });
                                    var lgSymbol = new SimpleMarkerSymbol({
                                        size: 28,
                                        outline: new SimpleLineSymbol({color: [41, 163, 41, 0.8]}),
                                        color: [51, 204, 51, 0.8]
                                    });
                                    var xlSymbol = new SimpleMarkerSymbol({
                                        size: 32,
                                        outline: new SimpleLineSymbol({color: [200, 52, 59, 0.8]}),
                                        color: [250, 65, 74, 0.8]
                                    });

                                    renderer.addClassBreakInfo(0, 19, smSymbol);
                                    renderer.addClassBreakInfo(20, 150, mdSymbol);
                                    renderer.addClassBreakInfo(151, 1000, lgSymbol);
                                    renderer.addClassBreakInfo(1001, Infinity, xlSymbol);

                                    var areaRenderer;

                                    // if area display mode is set. Create a renderer to display cluster areas. Use SimpleFillSymbols as the areas are polygons
                                    var defaultAreaSym = new SimpleFillSymbol({
                                        style: "solid",
                                        color: [0, 0, 0, 0.2],
                                        outline: new SimpleLineSymbol({color: [0, 0, 0, 0.3]})
                                    });

                                    areaRenderer = new ClassBreaksRenderer({
                                        defaultSymbol: defaultAreaSym
                                    });
                                    areaRenderer.field = "clusterCount";

                                    var smAreaSymbol = new SimpleFillSymbol({
                                        color: [255, 204, 102, 0.4],
                                        outline: new SimpleLineSymbol({color: [221, 159, 34, 0.8], style: "dash"})
                                    });
                                    var mdAreaSymbol = new SimpleFillSymbol({
                                        color: [102, 204, 255, 0.4],
                                        outline: new SimpleLineSymbol({color: [82, 163, 204, 0.8], style: "dash"})
                                    });
                                    var lgAreaSymbol = new SimpleFillSymbol({
                                        color: [51, 204, 51, 0.4],
                                        outline: new SimpleLineSymbol({color: [41, 163, 41, 0.8], style: "dash"})
                                    });
                                    var xlAreaSymbol = new SimpleFillSymbol({
                                        color: [250, 65, 74, 0.4],
                                        outline: new SimpleLineSymbol({color: [200, 52, 59, 0.8], style: "dash"})
                                    });

                                    areaRenderer.addClassBreakInfo(0, 19, smAreaSymbol);
                                    areaRenderer.addClassBreakInfo(20, 150, mdAreaSymbol);
                                    areaRenderer.addClassBreakInfo(151, 1000, lgAreaSymbol);
                                    areaRenderer.addClassBreakInfo(1001, Infinity, xlAreaSymbol);

                                    // Set up another class breaks renderer to style the flares individually
                                    var flareRenderer = new ClassBreaksRenderer({
                                        defaultSymbol: renderer.defaultSymbol
                                    });
                                    flareRenderer.field = "clusterCount";

                                    var smFlareSymbol = new SimpleMarkerSymbol({
                                        size: 14,
                                        color: [255, 204, 102, 0.8],
                                        outline: new SimpleLineSymbol({color: [221, 159, 34, 0.8]})
                                    });
                                    var mdFlareSymbol = new SimpleMarkerSymbol({
                                        size: 14,
                                        color: [102, 204, 255, 0.8],
                                        outline: new SimpleLineSymbol({color: [82, 163, 204, 0.8]})
                                    });
                                    var lgFlareSymbol = new SimpleMarkerSymbol({
                                        size: 14,
                                        color: [51, 204, 51, 0.8],
                                        outline: new SimpleLineSymbol({color: [41, 163, 41, 0.8]})
                                    });
                                    var xlFlareSymbol = new SimpleMarkerSymbol({
                                        size: 14,
                                        color: [250, 65, 74, 0.8],
                                        outline: new SimpleLineSymbol({color: [200, 52, 59, 0.8]})
                                    });

                                    flareRenderer.addClassBreakInfo(0, 19, smFlareSymbol);
                                    flareRenderer.addClassBreakInfo(20, 150, mdFlareSymbol);
                                    flareRenderer.addClassBreakInfo(151, 1000, lgFlareSymbol);
                                    flareRenderer.addClassBreakInfo(1001, Infinity, xlFlareSymbol);

                                    var data = [];
                                    var queryTask = new QueryTask({
                                        url: url
                                    });
                                    var q = new Query();
                                    var prefix = "";
                                    // q.where = prefix+"TAG LIKE '%"+tag+"%'";
                                    q.returnGeometry = true;
                                    q.start = 0;
                                    q.num = 20000;
                                    q.outFields = ['*'];
                                    queryTask.execute(q).then(function (results) {
                                        if (results.features.length) {
                                            for (var x = 0; x < results.features.length; x++) {
                                                data.push(
                                                    {
                                                        "name": "",
                                                        "iszhuanti": true,
                                                        "zhuantiurl": url + "",
                                                        "GUID": results.features[x].attributes[prefix + "FEATUREGUID"] || results.features[x].attributes[prefix + "GUID"],
                                                        "x": results.features[x].geometry.x,
                                                        "y": results.features[x].geometry.y
                                                    });
                                            }
                                        }
                                        var options = {
                                            id: "zhuantilayer",
                                            clusterRenderer: renderer,
                                            areaRenderer: areaRenderer,
                                            flareRenderer: flareRenderer,
                                            spatialReference: new SpatialReference({"wkid": 4326}),
                                            subTypeFlareProperty: "facilityType",
                                            singleFlareTooltipProperty: "name",
                                            displaySubTypeFlares: true,
                                            maxSingleFlareCount: 8,
                                            clusterRatio: 125,
                                            clusterToScale: 3000,
                                            clusterAreaDisplay: "activated",
                                            data: data
                                        }
                                        var clusterLayer = new fcl.FlareClusterLayer(options);
                                        map.add(clusterLayer);
                                    });

                                });
                            }
                            /*self.searchMap.page.data.sort(function (a,b) {
               return a.attributes.juli-b.attributes.juli;//距离由近到远
               })*/
                            self.searchMap.page.show = !zhuantihide;
                            self.searchMap.show = false;
                            self.infoPop.show = false;
                            self.infoPop.iscollect = false;
                            //按距离排 self.searchMap.shaixuan.on2 ||
                            if (iszhoubian) {
                                self.searchMap.shaixuan.on2 = false;//距离排序
                                self.julipaixu();
                            } else {
                                self.searchMap.shaixuan.on2 = false;//筛选重置
                            }
                            self.$vux.loading.hide();
                        });
                    }

                });
            },
            searchShowInMap(obj) {
                console.log(obj);
            },
            Xiangxi() {
                /*const imgList = this.infoPop.info.imgList;
      	if(imgList && imgList.length && imgList.length>0){*/
                if (this.infoPop.info.ADDRESS) {
                    this.infoPop.simple = false;
                } else {
                    this.$vux.toast.text('没有更多详情了');
                }
            },
            zhuantiClear(name) {
                const map = this.$refs.map.$data.map;
                if (map.findLayerById('zhuantilayer')) {
                    map.remove(map.findLayerById('zhuantilayer'));
                }
                if (name) {
                    $("#zhuantiData >div.on").removeClass('on');
                    $("#zhuantiData >div").each(function () {
                        if ($(this).text() == name) {
                            $(this).addClass('on');
                        }
                    });
                } else {
                    if (this.$refs.zhuanti) {
                        this.$refs.zhuanti.clearZt();
                    }
                }
            },
            //搜索详细
            async searchInfo(obj, hideReturn, showIcon) {
                console.log(obj);
                //重新查新
                if (!obj.geometry || obj.attributes.iszhuanti) {
                    console.log('重新查询')
                    this.$vux.loading.show();
                    const loadArr = await esriLoader.loadModules([
                        "esri/tasks/QueryTask",
                        "esri/tasks/support/Query"
                    ]);
                    const Q1 = loadArr[1];
                    const task = loadArr[0];
                    let url = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
                    SearchData.forEach(function (searchItem) {
                        if (searchItem.name == obj.attributes.SORT) {
                            url = searchItem.url
                        }
                    });
                    if (obj.attributes.iszhuanti) {
                        url = obj.attributes.zhuantiurl;
                    }
                    var t = new task({
                        url: url
                    });
                    var q = new Q1();
                    q.returnGeometry = true;
                    q.outFields = ["*"];
                    var prefix = "";
                    if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7') {
                        prefix = 'tdt.DBO.教育.';
                    } else if (url == 'https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/4') {
                        prefix = 'tdt.DBO.观光旅游_ZT.';
                    }
                    if (url == 'https://115.223.34.189:6443/arcgis/rest/services/XYDT/XYDT/MapServer/1') {
                        q.where = prefix + "GUID='" + (obj.attributes.FEATUREGUID || obj.attributes.GUID) + "'";
                    } else {
                        q.where = prefix + "FEATUREGUID='" + (obj.attributes.FEATUREGUID || obj.attributes.GUID) + "'";
                    }
                    const objResult = await t.execute(q);
                    this.$vux.loading.hide();
                    if (objResult.features[0]) {
                        obj = objResult.features[0];
                    }
                }
                obj.attributes = JSON.parse(JSON.stringify(obj.attributes).replace(/tdt\.DBO\..*?\.|tdt.dbo.t_base_photo\./gi, ''));

                const self = this;
                this.searchMap.hideReturn = hideReturn;
                this.searchMap.page.show = false;
                this.infoPop.show = true;
                self.$set(self.quanjingPop, 'url', '');
                const map = this.$refs.map.$data.map;
                const view = this.$refs.map.$data.view;
                if (view.popup) {
                    view.popup.close();
                }
                //console.log(JSON.stringify(obj.attributes));
                if (obj.geometry && obj.geometry.x) {
                    this.$set(obj.attributes, 'CENTERX', obj.geometry.x);
                    this.$set(obj.attributes, 'CENTERY', obj.geometry.y);
                }
                if (obj.geometry && obj.geometry.paths) {
                    this.$set(obj.attributes, 'CENTERX', obj.geometry.paths[0][0][0]);
                    this.$set(obj.attributes, 'CENTERY', obj.geometry.paths[0][0][1]);
                }
                if (obj.geometry && obj.geometry.rings) {
                    this.$set(obj.attributes, 'CENTERX', obj.geometry.rings[0][0][0]);
                    this.$set(obj.attributes, 'CENTERY', obj.geometry.rings[0][0][1]);
                }
                this.$set(this.infoPop, 'info', obj.attributes);
                //后台获取图片 /fapi/needlogin/uploadimg/guid/
                Util.ajax.post('/pubApi/wzmap/poiimg?guid=' + obj.attributes.FEATUREGUID).then(function (res) {
                    if (res.data && res.data.length) {
                        self.$set(self.infoPop.info, 'imgList', res.data);
                    }
                });
                //是否收藏
                Util.ajax.post('/fapi/needlogin/collect/guid?guid=' + obj.attributes.FEATUREGUID).then(function (res) {
                    if (res.data.collect) {
                        self.$set(self.infoPop.info, 'collect', res.data.collect);
                    }
                });
                //全景
                esriLoader.loadModules([
                    "esri/tasks/QueryTask",
                    "esri/tasks/support/Query"
                ]).then(([QueryTask, Query]) => {
                    var queryTask = new QueryTask({
                        url: "https://services.wzmap.gov.cn/server/rest/services/TDT/QUANJING/MapServer/0"
                    });
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                    query.start = 0;//开始
                    query.num = 1;//多少
                    query.where = " FEATUREGUID='" + obj.attributes.FEATUREGUID + "' ";
                    queryTask.execute(query).then(function (results) {
                        if (results.features.length > 0 && results.features[0].attributes.VR) {
                            self.$set(self.quanjingPop, 'url', results.features[0].attributes.VR);
                            self.$set(self.infoPop.info, 'vrurl', results.features[0].attributes.VR);
                        } else {
                            self.$set(self.quanjingPop, 'url', '');
                        }
                    });
                });
                //分类代码
                Util.ajax.post('/fapi/public/option/fcode?fcode=' + obj.attributes.FCODE).then(function (res) {
                    if (res.data.fcode) {
                        res.data.fcode.zhoubian = res.data.fcode.zhoubian.replace(/，/gi, ',');
                        self.$set(self.infoPop.info, 'option', res.data.fcode);
                    }
                });
                if (obj.attributes.CENTERX) {
                    view.center = [obj.attributes.CENTERX, obj.attributes.CENTERY];
                }
                if (obj.geometry && (obj.geometry.x || obj.geometry.y) && (!hideReturn || (hideReturn && showIcon))) {
                    esriLoader.loadModules([
                        'esri/symbols/PictureMarkerSymbol',
                        'esri/geometry/Point',
                        'esri/layers/GraphicsLayer',
                        'esri/Graphic'
                    ]).then(([PictureMarkerSymbol, Point, GraphicsLayer, Graphic]) => {
                        var symbol = {
                            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                            url: require("@/img/l2.png"),
                            width: "26px",
                            height: "26px",
                            yoffset: "13px"
                        };
                        var point = new Point({
                            "x": obj.attributes.CENTERX || obj.geometry.x,
                            "y": obj.attributes.CENTERY || obj.geometry.y,
                            "spatialReference": map.spatialReference
                        });
                        var picGraphic = new Graphic(point, symbol);
                        if (map.findLayerById('searchInfo') != null) {
                            map.remove(map.findLayerById('searchInfo'));
                        }
                        var graphicLayer = new GraphicsLayer({
                            graphics: [picGraphic],
                            id: 'searchInfo'
                        });
                        map.add(graphicLayer);
                    });
                }
                //绘线
                view.graphics.removeAll();
                if (obj.geometry && (obj.geometry.paths || obj.geometry.rings)) {
                    view.extent = obj.geometry.extent;
                }
                if (obj.geometry && obj.geometry.paths) {
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
                if (obj.geometry && obj.geometry.rings) {
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
                //功能曲面 || obj.attributes.NAME=='安堡锦园'
                if (obj.attributes.relation) {
                    esriLoader.loadModules([
                        "esri/Graphic",
                        "esri/geometry/Polygon",
                        "esri/tasks/QueryTask",
                        "esri/tasks/support/Query"
                    ])
                        .then(([Graphic, Polygon, QueryTask, Query]) => {
                            var queryTask = new QueryTask({
                                url: "https://services.wzmap.gov.cn/server/rest/services/TDT/GNQM/MapServer/0"
                            });
                            var query = new Query();
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            query.start = 0;//开始
                            query.num = 1;//多少
                            query.where = " NAME='" + obj.attributes.NAME + "' ";
                            queryTask.execute(query).then(function (results) {
                                if (results.features.length) {
                                    console.log('功能曲面');
                                    console.log(results.features[0]);
                                    var lines = new Polygon({
                                        rings: results.features[0].geometry.rings,
                                        spatialReference: view.spatialReference
                                    });
                                    var graphic = new Graphic({
                                        geometry: lines,
                                        symbol: {
                                            type: "simple-fill", // autocasts as new SimpleFillSymbol
                                            style: "none",
                                            outline: { // autocasts as SimpleLineSymbol
                                                color: '#419fed',
                                                width: 2,
                                                style: 'dash'
                                            }
                                        }
                                    });
                                    view.graphics.add(graphic);
                                }
                            });
                        });
                }
            },
            searchInfoClick() {
                if (!this.infoPop.show) {
                    this.infoPop.show = true;
                }
            },
            //地图更改
            dituChange(type) {
                if (type == 1) {
                    const self = this;
                    this.$refs.map.resetMap(function () {
                        if (self.$refs.map.$data.map.searchInfoLayer) {
                            self.$refs.map.$data.map.add(self.$refs.map.$data.map.searchInfoLayer);
                        }
                    });
                } else if (type == 2) {
                    this.yingxiang();
                } else if (type == 3) {
                    this.fangzhen();
                }
            },
            //专题更改
            zhuantiChange(name) {
                if (name == '3D') {
                    this.$refs.map.threeDMap();
                } else {
                    this.$refs.map.zhuantiMap(name);
                }
            },
            quanjingOpen(url) {
                this.quanjingPop.show = true;
                this.quanjingPop.url = url;
            },
            quanjingClick(graphic) {

            },
            //全景
            quanjing() {
                const self = this;
                const map = this.$refs.map.$data.map;
                if (map.findLayerById('quanjing') != null) {
                    self.quanjingShow = !self.quanjingShow;
                    map.findLayerById('quanjing').visible = self.quanjingShow;
                    //map.remove('quanjing');
                    return;
                }
                self.quanjingShow = true;
                self.$vux.loading.show('全景加载中');
                var url = 'https://services.wzmap.gov.cn/server/rest/services/TDT/QUANJING/MapServer/0';
                var sqlwhere = " VR <> '' ";
                //FSCALE
                esriLoader.loadModules([
                    'esri/tasks/support/Query',
                    'esri/tasks/QueryTask',
                    'esri/layers/FeatureLayer',
                    'esri/symbols/PictureMarkerSymbol',
                    'esri/geometry/Point',
                    'esri/layers/GraphicsLayer',
                    'esri/Graphic'
                ]).then(([Query, QueryTask, FeatureLayer, PictureMarkerSymbol, Point, GraphicsLayer, Graphic]) => {
                    var PopInit = async function (feature) {
                        console.log(feature);
                        var str = '';
                        //data-layer-id="quanjing"
                        if (feature.graphic.attributes.FEATUREGUID) {
                            self.$vux.loading.show();
                            const response = await Util.ajax.post('/pubApi/wzmap/vrimg?guid=' + feature.graphic.attributes.FEATUREGUID);
                            self.$vux.loading.hide();
                            if (response.data) {
                                str += "<a class='quanjingOpen' onclick='' data-url='" + response.data.link + "' style='display:block;text-align:center;position:relative;' >" +
                                    "<img src='" + response.data.spic + "'>" +
                                    "<span style='position:absolute;top:50%;left:50%;font-weight: bold;padding: 4px;background: rgba(255,255,255,0.8);" +
                                    "margin-left: -36px;margin-top: -13px;font-size: 16px;'>" +
                                    "查看全景</span></a>";
                                //str += "<a class='quanjingOpen' onclick='' data-url='"+response.data.link+"' style='display:block;text-align:center;' >查看全景</a>";
                            } else {
                                str = '暂无内容'
                            }
                        }
                        var symbol = {
                            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                            url: "images/l2.png",
                            width: "26px",
                            height: "26px",
                            yoffset: "13px"
                        };
                        var graphic = feature.graphic;
                        var point = new Point({
                            "x": graphic.attributes.CENTERX || graphic.geometry.x,
                            "y": graphic.attributes.CENTERY || graphic.geometry.y,
                            "spatialReference": map.spatialReference
                        });
                        var picGraphic = new Graphic(point, symbol);
                        if (map.findLayerById('searchInfo') != null) {
                            map.remove(map.findLayerById('searchInfo'));
                        }
                        var graphicLayer = new GraphicsLayer({
                            graphics: [picGraphic],
                            id: 'searchInfo'
                        });
                        map.add(graphicLayer);
                        return str;
                    }
                    var quanjingLayer = new FeatureLayer(url, {
                        //mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        id: 'quanjing',
                        definitionExpression: sqlwhere,
                        popupEnabled: true,
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
                    quanjingLayer.on('layerview-create', function () {
                        self.$vux.loading.hide();
                    });
                    map.add(quanjingLayer);
                });
            },
            //图片上传
            uploadSuccess(imglist) {
                this.$set(this.guidPop.form, 'attachs', imglist);
            },
            guidUpload() {
                const self = this;
                if (!this.guidPop.form.attachs) {
                    this.$vux.toast.text('请选择图片');
                    return;
                }
                self.$vux.loading.show('上传中');
                Util.ajax.post('/fapi/needlogin/uploadimg/add', this.guidPop.form).then(function (response) {
                    self.$vux.loading.hide();
                    if (response.data.code == 100) {
                        self.$vux.alert.show('上传成功，等待管理员审核');
                        self.$set(self.guidPop, 'form', {});
                        self.$refs.guidupload.clearImgList();
                        self.guidPop.show = false;
                    } else {
                        self.$vux.alert.show(response.data.msg);
                    }
                });
            },
            //收藏
            shoucang() {
                const self = this;
                let info = this.infoPop.info;
                self.$vux.loading.show('');
                if (info.collect && info.collect.id) {
                    Util.ajax.post("/fapi/needlogin/collect/del?ids=" + info.collect.id).then(function (response) {
                        self.$vux.loading.hide();
                        if (response.data.code == 100) {
                            self.$set(self.infoPop.info, 'collect', {});
                            self.$vux.toast.text("取消收藏成功");
                        } else {
                            self.$vux.toast.text(response.data.msg);
                        }
                    });
                } else {
                    self.$set(info, 'collect', {
                        guid: info.FEATUREGUID,
                        lng: info.CENTERX,
                        lat: info.CENTERY,
                        title: info.NAME,
                        addr: info.ADDRESS
                    });
                    Util.ajax.post("/fapi/needlogin/collect/add", info.collect).then(function (response) {
                        self.$vux.loading.hide();
                        if (response.data.code == 100) {
                            self.$set(info.collect, 'id', response.data.id);
                            self.$set(self.infoPop, 'info', info);
                            self.$vux.toast.text("收藏成功");
                        } else {
                            self.$vux.toast.text(response.data.msg);
                        }
                    });
                }
            },
            //（显示在地图）
            collectDetail(collect) {
                const self = this;
                self.personPop.show = false;
                self.collectPop.show = false;
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
                    ]).then(([PictureMarkerSymbol, Point, GraphicsLayer, Graphic]) => {
                        var symbol = {
                            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                            url: "images/l2.png",
                            width: "20px",
                            height: "20px"
                        };
                        var point = new Point({
                            "x": collect.lng,
                            "y": collect.lat,
                            "spatialReference": map.spatialReference
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
                        view.center = [collect.lng, collect.lat];
                    });
                });
            },
            findQuanjing() {
                const self = this;
                if (self.quanjingPop.url) {
                    self.quanjingPop.show = true;
                } else {
                    self.$vux.toast.text('未找到全景');
                }
                /* self.$vux.loading.show('');
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query"
        ]).then(([QueryTask,Query]) => {
          var layerurl = "https://portal.wzdmdz.com/server/rest/services/tdt_test/PXS/MapServer/1";
          var queryTask = new QueryTask({
            url: layerurl
          });
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.start = 0;//开始
          query.num = 1;//多少
          query.where = " FEATUREGUID='"+self.infoPop.info.FEATUREGUID+"' ";
          queryTask.execute(query).then(function(results){
            console.log(results.features);
            self.$vux.loading.hide('');
            if(results.features.length>0 && results.features[0].attributes.VR){
            	self.quanjingPop.url =  results.features[0].attributes.VR;
            	self.quanjingPop.show = true;
            }else{
            	self.$vux.toast.text('未找到全景');
            }
          });
        });*/
            },
            //
            change2D3D(is3D) {
                this.is3D = is3D;
            },
            //导航
            openLocation(lng, lat, name, address, url) {
                if (!lng || !lat) {
                    this.$vux.toast.text('未找到对应的地址');
                    return;
                }
                let gcj = Util.togcj02(lng, lat);
                const wx = this.$wechat;
                const self = this;
                wx.ready(function () {
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
            shineiLoad(louceng, name) {
                this.$set(this.shinei, 'louceng', louceng);
                const self = this;
                louceng.forEach(function (l, idx) {
                    if (l.name == 'L1') {
                        self.shinei.idx = idx;
                    }
                })
                this.shinei.name = name;
                console.log(name);
                this.shinei.show = true;
            },
            //楼层点击
            loucengChange(i, idx) {
                this.shinei.idx = idx;
                this.$refs.map.louceng(i.url1, i.url2, i.name);
            },
            //商铺点击
            shineiClick(graphic) {
                //console.log(graphic);
                this.searchInfo(graphic, true, true);
                /*const self = this;
        self.$vux.loading.show();
        console.log(JSON.stringify(graphic.attributes));
        self.$set(self.shinei,'shangpu',graphic.attributes);
        //判断收藏
        Util.ajax.post('/fapi/needlogin/collect/guid?guid='+graphic.attributes.FEATUREGUID).then(function (res) {
          self.$vux.loading.hide();
          if(res.data.collect){
            self.$set(self.shinei.shangpu,'collect',res.data.collect);
          }
        });
        self.shinei.shangpuShow = true;*/
            },
            //室内详细
            shangpuXiangxi() {
                //获取图片
                const self = this;
                if (!self.shinei.shangpu.load) {
                    self.$vux.loading.show();
                    Util.ajax.post('/pubApi/wzmap/shineiimg?guid=' + self.shinei.shangpu.FEATUREGUID).then(function (response) {
                        self.$vux.loading.hide();
                        if (response.data.code == 100 && response.data.list && response.data.list.length > 0) {
                            self.$set(self.shinei.shangpu, 'imgList', response.data.list);
                            self.shinei.shangpuSimple = false;
                            self.$set(self.shinei.shangpu, 'load', true);
                        } else {
                            self.$vux.toast.text('没有更多了');
                        }
                    });
                } else if (self.shinei.shangpu.imgList) {
                    self.shinei.shangpuSimple = false;
                } else {
                    self.$vux.toast.text('没有更多了');
                }
            },
            //商铺收藏
            /*shangpuShoucang(){
        const self = this;
        let info = this.shinei.shangpu;
        self.$vux.loading.show('');
        if(info.collect && info.collect.id){
          Util.ajax.post("/fapi/needlogin/collect/del?ids="+info.collect.id).then(function (response) {
            self.$vux.loading.hide();
            if(response.data.code==100){
              self.$set(self.shinei.shangpu,'collect',{});
              self.$vux.toast.text("取消收藏成功");
            }else{
              self.$vux.toast.text(response.data.msg);
            }
          });
        }else{
          self.$set(info,'collect',{
            guid:info.featureguid,
            lng:info.centerx,
            lat:info.centery,
            title:info.name,
            addr:info.address
          });
          Util.ajax.post("/fapi/needlogin/collect/add",info.collect).then(function (response) {
            self.$vux.loading.hide();
            if(response.data.code==100){
              self.$set(info.collect,'id',response.data.id);
              self.$set(self.shinei,'shangpu',info);
              self.$vux.toast.text("收藏成功");
            }else{
              self.$vux.toast.text(response.data.msg);
            }
          });
        }
      },*/
            //室内隐藏
            hideShinei() {
                this.shinei.show = false;
            },
            //专题
            zhuantiShow() {

            },
            //预览图片
            previewImage(url) {
                this.$wechat.previewImage({
                    current: url, // 当前显示图片的http链接
                    urls: [url] // 需要预览的图片http链接列表
                })
            },
            closePop() {
                this.zhoubianPop.show = false;
                this.collectPop.show = false;
                this.addrPop.show = false;
                this.paddrPop.show = false;
                this.jiucuoPop.show = false;
                this.myshangbaoPop.show = false;
                this.shangbaoPop.show = false;
                this.zhuantiPop.show = false;
                console.log(this.$route.meta.title);
                Util.title(this.$route.meta.title);
            },
            //距离排序
            julipaixu() {
                if (this.searchMap.shaixuan.on2) {
                    console.log(123);
                    this.searchMap.shaixuan.on2 = false;
                    this.$set(this.searchMap.page, 'data', this.searchMap.tempData);
                } else {
                    console.log(3);
                    // 暂时隐藏距离排序
                    // this.searchMap.shaixuan.on2 = true;
                    // this.$set(this.searchMap,'tempData',JSON.parse(JSON.stringify(this.searchMap.page.data)));
                    // this.searchMap.page.data.sort(function (a,b) {
                    //   return a.attributes.juli-b.attributes.juli;//距离由近到远
                    // })
                }
            },
            lukuang() {
                const self = this;
                const map = this.$refs.map.$data.map;
                const view = this.$refs.map.$data.view;
                if (this.lukuangShow) {
                    this.lukuangShow = false;
                    if (map.findLayerById('lukuang') != null) {
                        map.remove(map.findLayerById('lukuang'));
                    }
                } else {
                    this.lukuangShow = true;
                    this.$vux.loading.show();
                    esriLoader.loadModules([
                        "esri/layers/WMSLayer"
                    ])
                        .then(([WMSLayer]) => {
                            if (map.findLayerById('lukuang') != null) {
                                map.remove(map.findLayerById('lukuang'));
                            }
                            var WMSLayer = new WMSLayer({
                                id: "lukuang",
                                url: "http://121.43.99.232:8899/traffic/geoserver/zjplatform/RTIC_POLYLINE/ows", // url to the service,
                                sublayers: [{
                                    name: "RTIC_POLYLINE"
                                }],
                                version: "1.1.1"
                            });
                            map.add(WMSLayer);
                            setTimeout(function () {
                                self.$vux.loading.hide();
                            }, 1000);
                        });
                }
            }
        },
        async mounted() {
            const self = this;
            if (this.$route.query) {
                //console.log(this.$route.query);
                if (this.$route.query.lng) {
                    this.lng = this.$route.query.lng;
                }
                if (this.$route.query.lat) {
                    this.lat = this.$route.query.lat;
                }
                if (this.$route.query.zoom) {
                    this.zoom = this.$route.query.zoom;
                }
            }
            //
            /*if(this.$route.query && this.$route.query.shinei){
        this.$set(this.shinei,'load',true);
      }*/
            const wx = this.$wechat;
            Util.checkLog().then(function (response) {
                if (response.data.code == 100) {
                    //http://wxsc.izkl.site/?code=001iS8Qw1mTVMh0k0SRw1ja5Qw1iS8QS&state=STATE#/
                } else {
                    Util.login();
                }
            });
            if (!Util.isIOS()) {
                Util.ajax.post("/pubApi/auth/jsapk?url=" + encodeURIComponent(location.href)).then(function (data) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: Util.wxconfig.appid, // 必填，公众号的唯一标识
                        timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                        signature: data.data.signature,// 必填，签名
                        jsApiList: ['getLocation', 'openLocation', 'previewImage', 'onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
                    });
                });
            }
            //全景点击
            $('body').on('click', '.quanjingOpen', function () {
                self.quanjingOpen($(this).attr('data-url'));
            });
            //搜索几块
            Util.ajax.post('/fapi/public/option/ssfl').then(function (response) {
                if (response.data && response.data.length > 0) {
                    self.$set(self.searchMap, 'itemList', response.data);
                }
            });

            this.$nextTick(() => {
                setTimeout(() => {
                    console.log(this.$refs.zhuanti)
                    if (this.$route.query.feature) {
                        this.dituPop.show = false;
                        var data = this.list[this.$route.query.feature]
                        console.log(data)
                        this.searchpoi(true, data.serviceurl, data.tag, null, true, false, data.pic, true)
                    }
                }, 2000)

            })

        }
    }
</script>
