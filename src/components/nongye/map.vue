<style lang="less">
  @import "../home/home.less";
</style>

<template>
  <div class="main" style="width:100%;height:100%;">
    <!-- 地图 -->
    <tianditu style="height:100%;" :style="{'height':loadmap?'100%':'1%'}"
              @mapload="mapload"
              @changeView="changeView"
              @change2D3D="change2D3D"
              @searchInfoClick="searchInfoClick"
              @nongyeClick="nongyeClick"
              @ptssClick="nongyeClick"
              @shineiClick="nongyeClick"
              :loading=true
              ref="map" mapid="nongyemap"
              searchurl="https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6"
              layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
    ></tianditu>
    <!-- 固定顶部其他 -->
    <div class="tmap-fixed" v-show="loadmap">
      <!-- 搜素 -->
      <div class="tmap-search" v-if="!is3D">
        <div class="tmap-search-wrap" style="display: flex;flex:1;">
          <!-- 搜索 -->
          <div class="tmap-search-input">
            <input id="searchKey" type="text" placeholder="   查找地点、路线" v-model="searchMap.key"
                   @keyup.enter="searchpoiHandler"
                   @focusin="searchHis()"
                   @focusout="focusout"
                   style="padding: 0 30px 0 20px;
                          box-sizing: border-box;">
            <img src="@/images/clear.png" v-if="searchMap.key.length" @click="clearKey" alt="">
          </div>
        </div>
        <!-- 搜索按钮 -->
        <div @click="searchpoiHandler" class="search-btn" >搜索</div>
      </div>
      <!-- 搜索展开 -->
      <div class="tmap-search-list" v-if="searchMap.show && !searchMap.page.show">
        <div class="search-wrap">
          <!-- 顶部专题 -->
          <div class="search-zhuanti">
            <div class="search-zhuanti_item" @click="searchpoi(true,i.serviceurl,i.tag,searchMap.itemList,true)"
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
                <img src="@/images/huixian.png" alt="">
                <div><span style="opacity: 0">线</span>绘线<span style="opacity: 0">线</span></div>
              </div>
              <div class="tmap-tools_6 tmap-box" @click="huimian" :class="huimianShow?'on':''">
                <img src="@/images/huimian.png" alt="">
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
          <!-- 配套设施 -->
          <div class="tmap-zhoubian tmap-box mt10 louceng-list" v-if="infoPop.info && infoPop.info.option && infoPop.info.option.zhoubian"
               style="height:auto;max-height:auto;">
            <div v-for="(i,idx) in infoPop.info.option.zhoubian.split(',')"
                 :class="{'on':idx==ptss.idx}"
                 @click="ptssClick(i,idx)">
              <img :src="ptssImg(i,idx)" style="width:15px;" alt="">
              <div>{{i}}</div>
            </div>
          </div>
        </div>
        <!-- 右侧周边 -->
        <div class="tmap-right-tools">
          <div class="tmap-zhoubian tmap-box mt10" v-if="!is3D">
            <!-- 暂时隐藏 -->
            <template v-if="false">
              <div @click="shangbaoPop.show=true">
                <img src="@/images/r-2.png" alt="">
                <div>上报</div>
              </div>
              <div class="tmap-divide"></div>
              <div @click="dingwei(true)">
                <img src="@/images/r-3.png" alt="">
                <div>定位</div>
              </div>
              <div class="tmap-divide"></div>
              <div @click="quanjing" :class="quanjingShow?'on':''">
                <img v-if="quanjingShow" src="@/images/r-4o.png" alt="">
                <img v-else src="@/images/r-4.png" alt="">
                <div>全景</div>
              </div>
              <div class="tmap-divide"></div>
              <div @click="$router.push({name:'nongye'})" >
                <img src="@/images/home.png" alt="">
                <div>首页</div>
              </div>
            </template>
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
    <!-- 个人中心 -->
    <popup v-model="personPop.show" position="left" height="100%" width="60%" style="z-index:999;">
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
    <!-- 搜索结果 -->
    <popup v-model="searchMap.page.show" height="80%" id="searchRes" :show-mask="false"
           style="height:calc(100% - 90px);padding: 0 10px;width: calc(100% - 40px);border-radius: 5px;left: 10px;">
      <!-- 顶部关闭 -->
      <div class="tmap-search-tool">
        <img src="@/images/down10.png" @click="searchMap.page.show=false" alt="">
        <img src="@/images/close.png" @click="searchMap.page.show=false;searchMap.page.data = [];" class="cls" alt="">
      </div>
      <!-- 同组按钮 -->
      <tab v-if="searchMap.page.show && searchMap.tongzuList && searchMap.tongzuList.length>0">
        <tab-item v-for="i in searchMap.tongzuList" :selected="i.tag==searchMap.tag"
                  @click.native="searchpoi(true,i.serviceurl?i.serviceurl:searchMap.url,i.tag,searchMap.tongzuList,i.iszhuanti,i.iszhoubian)"
                  style="flex: none;padding: 0 10px;width:auto;min-width: 20%;">
          {{i.name}}
        </tab-item>
      </tab>
      <!-- 筛选列表 -->
      <div class="shaixuan">
        <!-- 暂时隐藏 -->
        <template v-if="false">
          <div :class="searchMap.shaixuan.on2?'':'on'" @click="julipaixu">
            <img src="@/img/ico_lm.png" v-if="searchMap.shaixuan.on2">
            <img src="@/img/ico_lm_ov.png" v-else alt="">热门
          </div>
          <div :class="searchMap.shaixuan.on2?'on':''" @click="julipaixu">
            <img src="@/img/ico_jl.png" v-if="!searchMap.shaixuan.on2">
            <img src="@/img/ico_jl_ov.png" v-else alt="">距离
          </div>
        </template>
          <template v-if="searchMap.shaixuan.option">
            <template v-for="(i,idx) in searchMap.shaixuan.option">
              <div v-if="i.name=='区域'" :class="searchMap.areaName?'on':''"  @click="searchMap.areaShow=true">
                <img v-if="searchMap.areaName" src="@/img/ico_qy_ov.png" alt=""><img v-else src="@/img/ico_qy.png" alt="">
                <template v-if="searchMap.areaName">{{searchMap.areaName}}</template>
                <template v-else>区域<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
              </div>
              <div v-else-if="i.name=='月份'" :class="searchMap.monthName?'on':''"  @click="searchMap.monthShow=true">
                <img v-if="searchMap.monthName" src="@/img/ico_sj_ov.png" alt=""><img v-else src="@/img/ico_sj.png" alt="">
                <template v-if="searchMap.monthName">{{searchMap.monthName}}</template>
                <template v-else>月份<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
              </div>
              <div v-else-if="i.name=='价格' && searchMap.tag=='农家乐'" :class="searchMap.priceName?'on':''"  @click="searchMap.priceShow=true">
                <!--<img v-if="searchMap.monthName" src="@/img/ico_sj_ov.jpg" alt=""><img v-else src="@/img/ico_sj.jpg" alt="">-->
                <template v-if="searchMap.priceName">{{searchMap.priceName}}</template>
                <template v-else>价格<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
              </div>
              <div v-else-if="i.name=='价格'" :class="searchMap.priceName2?'on':''"  @click="searchMap.priceShow2=true">
                <!--<img v-if="searchMap.monthName" src="@/img/ico_sj_ov.jpg" alt=""><img v-else src="@/img/ico_sj.jpg" alt="">-->
                <template v-if="searchMap.priceName2">{{searchMap.priceName2}}</template>
                <template v-else>价格<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
              </div>
            </template>
          </template>
      </div>
      <!-- 搜索列表 -->
      <div class="tmap-search-result" style="height:calc(100% - 128px);overflow:auto;">
        <template v-for="(i,idx) in searchMap.page.data">
          <template v-if="i.attributes.ROUTE && searchMap.tag=='乡村示范带'">
            <div class="s-result_item" >
              <!-- 点击详情 -->
              <div class="s_result_item-info" @click="searchInfo(i)">
                <div style="line-height:40px;">{{i.attributes.NAME}}</div>
              </div>
              <!-- 展开 -->
              <div class="s_result_item-icon" @click="showPoiline(i)" style="text-indent:1em;">
                <img src="@/img/arrow_down.png" style="height: 6px;width:auto;" alt="">
              </div>
            </div>
            <!-- 展开列表 -->
            <div class="s-result_item" v-if="i.list && i.show" v-for="(ii,idx2) in i.list" style="min-height:26px;">
              <div class="s_result_item-info" @click="guidFound(ii.pguid,true)">
                <div style="line-height: 26px;color:#666;">{{ii.pname}}</div>
              </div>
              <div class="s_result_item-icon">
                <img src="@/images/i-daohang.png" @click="guidFound(ii.pguid,true)" style="width:26px;">
              </div>
            </div>
          </template>
          <!-- 点 -->
          <div class="s-result_item" v-else>
            <!-- 点击详情 -->
            <div class="s_result_item-info" @click="searchInfo(i)">
              <div>{{i.attributes.NAME}}</div>
              <div v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
              <!-- 暂时隐藏 -->
              <div v-if="false && i.attributes.juli">距离：{{i.attributes.juli}}km</div>
              <!--<div v-if="i.attributes.TAG" class="item-tag-list">
                <span v-for="ii in (i.attributes.TAG).split(',')" class="item-tag">{{ii}}</span>
              </div>-->
            </div>
            <!-- 导航 -->
            <!-- 暂时隐藏 -->
            <div class="s_result_item-icon" v-show="false">
              <img src="@/images/i-daohang.png"
                   @click="openLocation(i.attributes.CENTERX,i.attributes.CENTERY,i.attributes.NAME,i.attributes.ADDRESS,'')" alt="">
            </div>
          </div>
        </template>
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
    <popup v-model="infoPop.show"
           :show-mask="false"
           style="max-height:calc(100% - 100px);padding: 0 10px;width:100%;box-sizing: border-box;z-index:400;">
      <div class="info-pop">
        <!-- 顶部关闭 -->
        <div class="info-pop-tool">
          <img src="@/images/back.png" v-show="!searchMap.hideReturn || ($route.query && $route.query.guid && infoPop.info.FEATUREGUID==$route.query.guid)"
               @click="()=>{
                if(!searchMap.hideReturn){
                  infoPop.show=false;searchMap.page.show=true
                }else{
                  goback();
                }
               }" class="rtn" alt="">
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
              <div class="info-pop_tit">{{infoPop.info.NAME || infoPop.info['名称']}}</div>
              <div class="info-pop_info">
                <!-- 暂时隐藏 -->
                <div v-if="false && infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
                <div v-if="infoPop.info.ADDRESS">地址：{{infoPop.info.ADDRESS}}</div>
                <div v-if="infoPop.info.PHONE"><a class="on" style="text-decoration: underline;" :href="'tel:'+infoPop.info.PHONE">电话：{{infoPop.info.PHONE}}</a></div>
              </div>
            </div>
            <!-- 暂时隐藏 -->
            <div class="bt_mp" style="bottom:13px;" v-if="false && infoPop.info.ADDRESS" @click="Xiangxi">展开详情</div>
            <div class="bt_mp" style="bottom:30px;background-color: #009e60;" @click="openLocation(infoPop.info.CENTERX,infoPop.info.CENTERY,infoPop.info.NAME,infoPop.info.ADDRESS,'')">导航</div>
          </div>
          <!-- 暂时隐藏 -->
          <div class="map_btn" style="margin-top:15px;" v-if="false">
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
        <!--<div class="info-pop-con">
          <div class="info-pop_tit">{{infoPop.info.NAME}}</div>
          <div class="info-pop_info">
            <div v-if="infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
            <div v-if="infoPop.info.ADDRESS">地址：{{infoPop.info.ADDRESS}}</div>
          </div>
          <div class="info-pop_btn">
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
            <div @click="openLocation(infoPop.info.CENTERX,infoPop.info.CENTERY,infoPop.info.NAME,infoPop.info.ADDRESS,'')">
              <img src="@/images/tem-7.png" alt="">导航
            </div>
          </div>
        </div>-->
      </div>
    </popup>
    <!-- 详细 -->
    <popup v-model="!infoPop.simple" height="100%" position="bottom" :show-mask="false"
           :style="{'transition-duration':loadmap?'300ms':'0ms'}">
      <nongye-content :conData="infoPop.info"
                      :view="$refs.map.$data.view"
                      :map="$refs.map.$data.map"
                      :changeurl="loadmap"
                      v-if="!infoPop.simple"
                      @closePop="infoPop.simple=true;loadmap=true;"
                      @zhoubian="loadmap=true;zhoubianPop.show=true;zhoubianPop.load=true;
                      zhoubianPop.lng=infoPop.info.CENTERX;zhoubianPop.lat=infoPop.info.CENTERY"
                      @guidFound="(obj)=>{
                        infoPop.simple=true;loadmap=true;
                        guidFound(obj.attributes.FEATUREGUID);
                      }"
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
                      @findQuanjing="findQuanjing"></nongye-content>
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
      <jiucuo-form
                   :centerx="jiucuoPop.centerx" :centery="jiucuoPop.centery"
                   :pname="jiucuoPop.name" :zoom="jiucuoPop.zoom"
                   :guid="jiucuoPop.guid"
                   @closePop="closePop"></jiucuo-form>
    </popup>
    <!-- 全景pop -->
    <popup v-model="quanjingPop.show" position="right" width="100%" height="100%" :show-mask="false">
      <iframe v-if="quanjingPop.show" :src="quanjingPop.url" frameborder="0"
              style="width:100%;height:calc(100% - 45px);display:block;"></iframe>
      <div class="bottom-btn" @click="quanjingPop.show=false">关闭</div>
    </popup>
    <!-- 分享Show -->
    <div style="background:rgba(0,0,0,0.6);position: fixed;left:0;top:0;height:100%;width:100%;z-index:9999;"
         v-if="fenxiangShow" @click="fenxiangShow=false">
      <img src="@/images/share.png" style="width:100%" alt="">
    </div>
    <!-- 周边 -->
    <popup v-model="zhoubianPop.show" position="left" height="100%" width="100%" style="z-index:999;" :show-mask="false">
      <zhoubian v-if="zhoubianPop.load" @closePop="closePop"
                @zhoubianDetail="(ii,list)=>{closePop();searchpoi(true,ii.serviceurl,ii.tag?ii.tag:ii.name,list,false,true)}"></zhoubian>
    </popup>
    <!-- 筛选 -->
    <actionsheet v-model="searchMap.areaShow" @on-click-menu="clickArea"
                 :menus="['全部','鹿城区','龙湾区','瓯海区','乐清市','瑞安市','平阳县','永嘉县','文成县','泰顺县','苍南县','洞头区']">
    </actionsheet>
    <actionsheet v-model="searchMap.monthShow" @on-click-menu="clickMonth"
                 :menus="['全部','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']">
    </actionsheet>
    <actionsheet v-model="searchMap.priceShow" @on-click-menu="clickPrice"
                 :menus="[{'label':'全部','value':''},{'label':'人均50以下','value':'PRICE_number<50'},
                 {'label':'50-80','value':'PRICE_number>=50 AND PRICE_number<=80'},
                 {'label':'80-120','value':'PRICE_number>=80 AND PRICE_number<=120'}
                 ,{'label':'120-150','value':'PRICE_number>=120 AND PRICE_number<=150'}]">
    </actionsheet>
    <actionsheet v-model="searchMap.priceShow2" @on-click-menu="clickPrice2"
                 :menus="[{'label':'全部','value':''},{'label':'200以下','value':'PRICE_number<200'},
                 {'label':'200-500','value':'PRICE_number>=200 AND PRICE_number<=500'},
                 {'label':'500-1000','value':'PRICE_number>=500 AND PRICE_number<=1000'},
                 {'label':'1000-1800','value':'PRICE_number>=1000 AND PRICE_number<=1800'},
                 {'label':'1800以上','value':'PRICE_number>1800'}]">
    </actionsheet>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import Tianditu from '@/components/libs/tianditu/main';
  import Uploader from '@/components/libs/Uploader/Uploader';
  import MapUtil from '@/components/libs/tianditu/util';
  import {Popup,Tab,TabItem,Actionsheet} from 'vux';
  import Personal from '@/components/personal/index';//个人中心
  import PAddr from '@/components/personal/addr/form';//
  import AddrList from '@/components/personal/addr/list';//地址列表
  import CollectList from '@/components/personal/collect/list';//收藏
  import ShangbaoList from '@/components/personal/shangbao/list';//上报列表
  import ShangbaoForm from '@/components/personal/shangbao/form.vue';//上报
  import JiucuoForm from '@/components/personal/jiucuo/form.vue';//纠错
  import Zhoubian from '@/components/nongye/zhoubian.vue';
  import NongyeData from '@/datas/nongye.json';//农业筛选数据
  import NongyeContent from '@/components/nongye/listView.vue';
  import {nongyeConfig} from '@/config/tdt';
  export default {
    components: {
      Tianditu,Popup,Personal,ShangbaoForm,JiucuoForm,CollectList,ShangbaoList,Uploader
      ,Tab, TabItem,Zhoubian,PAddr,AddrList,Actionsheet,NongyeContent
    },
    data () {
      return {
        loadmap:true,
        drawloading:false,
        cejuShow:false,
        cemianShow:false,
        juliShow:false,
        juliClick:null,
        juliInfo:"",
        shiquShow:false,//拾取
        shiquClick:null,
        quanjingShow:false,
        shiquLocation:null,//拾取坐标
        huixianShow:false,//绘线
        huimianShow:false,//绘面
        fenxiangShow:false,//分享
        draw:null,
        view:null,
        is3D:false,
        mapLocation:{},
        mapCenter:[],
        searchMap:{
        	count:0,
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
          shaixuan:{
        		option:[],//配置
          	on1:true,
            on2:false,
            on3:false,
            on4:false,
            on5:false,
            on6:false,
          	list1:[],//区域
            list2:[],//类型
            list3:[],//月份
            list4:[]//价格
          },
          show:false,//面板显示
          hisShow:true,//显示历史
          hisList:[],//历史记录
          itemList:[],//几大块
          tongzuList:[],//同组
          //筛选相关
          areaShow:false,
          areaName:"",
          monthShow:false,
          monthName:"",
          priceShow:false,
          priceName:"",
          priceValue:"",
          priceShow2:false,
          priceName2:"",
          priceValue2:""
        },
        //配套设施
        ptss:{
          idx:-1
        },
        //面点关系
        poiline:[],
        paddrPop:{
          show:false
        },
        addrPop:{
          show:false,
          load:false
        },
        personPop:{
          show:false
        },
        zhoubianPop:{
          show:false,
          load:false,
          lng:null,
          lat:null
        },
        myshangbaoPop:{
          show:false
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
          show:false
        },
        toolshow:false
      }
    },
    computed:{
      wxuser(){
        return  this.$store.getters.wxuser;
      }
    },
    watch:{
    	'infoPop.simple':function (val,oldVal) {
        if(val){
        	const wx = this.$wechat;
        	const self = this;
        	wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: self.infoPop.info.NAME, // 分享标题
              desc: '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/nmap?guid="+self.infoPop.info.FEATUREGUID+"&loadmap=true", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:'' // 分享图标
            });
            wx.onMenuShareTimeline({
              title: self.infoPop.info.NAME, // 分享标题
              desc: '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/nmap?guid="+self.infoPop.info.FEATUREGUID+"&loadmap=true", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: '' // 分享图标
            });
          });
        }
      }
    },
    methods: {
      searchpoiHandler () {
        const tagName = this.$route.query['tagName'];
        switch (tagName) {
          case '借阅':
            this.searchpoi(true, 'https://grcxf.wzcredit.gov.cn/server/rest/services/XYDT/XYDT/MapServer/1');
            break;
          case '停车':
            this.searchpoi(true, 'https://grcxf.wzcredit.gov.cn/server/rest/services/XYDT/XYDT/MapServer/2');
            break;
          case '医院':
            this.searchpoi(true, 'https://grcxf.wzcredit.gov.cn/server/rest/services/XYDT/XYDT/MapServer/3');
            break;
          default:
            this.searchpoi(true);
        }
      },
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
      mapload(map,view){
        const self = this;
        //GUID
        if(self.$route.query && self.$route.query.guid){
          if(self.$route.query.loadmap=='false' && localStorage.getItem('infoItem')){
            self.searchInfo(JSON.parse(localStorage.getItem('infoItem')),true,true);
          }else if(self.$route.query.loadmap=='true' && localStorage.getItem('infoItem')){
            self.searchInfo(JSON.parse(localStorage.getItem('infoItem')),true,false);
          }else{
            self.guidFound(self.$route.query.guid,false,self.$route.query.loadmap=='true'?false:true);
          }
        }

        //搜索几块s
        Util.ajax.post('/fapi/public/nongye/option/fl').then(function (response) {
          if(response.data && response.data.length>0){
            self.$set(self.searchMap,'itemList',response.data);
            //传参数
            /*if(self.$route.query && self.$route.query.tab){
              const tab = JSON.parse(self.$route.query.tab);
              let list = response.data;
              if(self.$route.query.list){
                list = JSON.parse(self.$route.query.list);
              }
              self.searchpoi(true,tab.serviceurl,tab.tag,list);
            }else if(self.$route.query && self.$route.query.searchkey){
              self.searchMap.key = self.$route.query.searchkey;
              self.searchpoi(true);
            }*/
          }
        });

        this.dingwei();
        //点击查询
        /*esriLoader.loadModules([
          'esri/layers/FeatureLayer'
        ]).then(([FeatureLayer])=>{
        	let url = 'https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6';
        	var nlayer = new FeatureLayer(url,{
            outFields: ["*"],
            id:'nongyeLayer',
            //definitionExpression: "FSCALE <= 13",
            mode: FeatureLayer.MODE_SNAPSHOT,
            renderer:{
              type: "simple",
              symbol:{
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                style: "circle",
                color: [255,255,255,0.01],
                size: "20px",
                outline:{
                  width:0
                }
              }
            }
          });
          /!*view.watch("zoom", function(event){
            //var zoom=view.zoom+7;
              //alert(zoom);
            nlayer.definitionExpression="FSCALE<= "+view.zoom;
            nlayer.refresh();
          });*!/
        	map.add(nlayer);
        });*/

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
            MapUtil.enableCreateLine(self.draw,self.$refs.map.$data.view,true);
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
            MapUtil.enableCreatePolygon(self.draw,self.$refs.map.$data.view,true);
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
            MapUtil.enableCreatePolygon(self.draw,self.$refs.map.$data.view);
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
            MapUtil.enableCreateLine(self.draw,self.$refs.map.$data.view);
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
          self.$refs.map.ishitTest = false;
          var point = new Point({
            "x" : self.mapLocation.lng,
            "y" : self.mapLocation.lat,
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
        });
        this.createDraw(function () {
          esriLoader.loadModules([
            "esri/Graphic",
            "esri/geometry/Polyline",
            "esri/geometry/geometryEngine"
          ]).then(([Graphic,Polyline,geometryEngine]) => {
            const view = self.$refs.map.$data.view;
            //const map = this.$ref.smap.$data.map;
            self.juliClick = view.on('click',function (e) {
              view.graphics.removeAll();
              //console.log(vertices);
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
          const view = self.$refs.map.$data.view;
          const map = self.$refs.map.$data.map;

          self.shiquClick = view.on('click',function (e) {
            console.log(2);
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
            if (map.locationLayers == null) {
              map.locationLayers = new GraphicsLayer({
                graphics: [picGraphic]
              });
              map.add(map.locationLayers);
            } else {
              map.locationLayers.removeAll();
            }
            map.locationLayers.add(picGraphic);
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
        const map = this.$refs.map.$data.map;
        const view = this.$refs.map.$data.view;
        if(map.wxlocationLayer){
          map.wxlocationLayer.removeAll();
        }
        if(map.ptssLayer) {
          map.ptssLayer.removeAll();
        }
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
		  if (map.findLayerById('ptss') != null) {
			  map.remove(map.findLayerById('ptss'));
		  }
        view.graphics.removeAll();
        this.$refs.map.ishitTest = true;
      },
      changeView(center){
        //console.log(center);
        //this.view = view;
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
                  const map = self.$refs.map.$data.map;
                  var point = new Point({
                    "x" : lng,
                    "y" : lat,
                    "spatialReference" : map.spatialReference
                  });
                  var picGraphic = new Graphic(point, symbol);
                  if (map.wxlocationLayer == null) {
                    map.wxlocationLayer = new GraphicsLayer({
                      graphics: [picGraphic]
                    });
                    map.add(map.wxlocationLayer);
                  } else {
                    map.wxlocationLayer.visible = true;
                    map.wxlocationLayer.removeAll();
                  }
                  map.wxlocationLayer.add(picGraphic);
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
              view:self.$refs.map.$data.view
            });
            self.$set(self.$data,'draw',draw);
            self.drawloading = false;
            callback();
          });
        }else{
          callback();
        }
      },
      yingxiang(){
        this.$refs.map.yingxiangMap();
      },
      fangzhen(){
        this.$refs.map.fangzhenMap();
      },
      lishi(year){
        if(year!=2017){
          this.$refs.map.historyMap(year);
        }else{
          this.yingxiang();
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
        ])
        let QueryTask = arr[0];
        let Query = arr[1];
        let Polyline = arr[2];
        let geometryEngine = arr[3];
        let Circle = arr[4];
        let Point = arr[5];
        var defaulturl = 'https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0';
        var layerurl = "https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6";
        var layerurl2 = "https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6";
        var searchIdx = 6;
        var sname = '';
        if(url){
          layerurl = url;
          self.searchMap.url = url;
        }else{
          self.searchMap.url = '';
        }
        searchIdx = parseInt(layerurl.replace(/.*\//gi,''));
        sname = nongyeConfig.nameConfig[searchIdx];
        var queryTask = new QueryTask({
          url: layerurl
        });
        var prefix = " tdt.DBO."+sname+".";
        if(!/乡村示范带|乡村景点|美丽乡村|农业园|农家乐|民宿|土特产|精品线路|景区景点/.test(tag)){
          prefix = "";
        }
        if(layerurl==layerurl2){
        	prefix="tdt.DBO.农业旅游.";
        }
        const view = self.$refs.map.$data.view;
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.start = self.searchMap.page.start;//开始
        query.num = self.searchMap.page.pageSize;//多少
        query.where = prefix+"NAME LIKE '%"+key+"%' ";//AND FSCALE<="+view.zoom  // Return all cities with a population greater than 1 million
        //标签
        if(tag!=self.searchMap.tag){
        	self.searchMap.areaName = "";
        	self.searchMap.monthName = "";
        	self.searchMap.priceName = "";
        	self.searchMap.priceValue = "";
          self.searchMap.priceName2 = "";
          self.searchMap.priceValue2 = "";
        }
        if(tag){
          //面点
          if(!/.*?(8)$/.test(layerurl)){
            query.where = prefix+"TAG LIKE '%"+tag+"%' AND "+prefix+"NAME is not null ";
          }else{
            query.where = prefix+"NAME is not null";
          }
          self.$set(self.searchMap,'tag',tag);
          //条件
          if(self.searchMap.areaName){
          	query.where+=" AND "+prefix+"AREA='"+self.searchMap.areaName+"' "
          }
          if(self.searchMap.monthName){
            query.where+=" AND "+prefix+"MONTH like '%"+self.searchMap.monthName+"%' "
          }
          if(self.searchMap.priceValue){
            query.where+=" AND "+self.searchMap.priceValue.replace(/PRICE_number/gi,prefix+'PRICE_number')
          }
          /*//找同组的
          if(list){
            self.$set(self.searchMap,'tongzuList',list)
          }else{
            Util.ajax.post('/fapi/public/option/zttongzu?name='+tag).then(function (response) {
              if(response.data && response.data.length)
                self.$set(self.searchMap,'tongzuList',response.data)
            });
          }*/
          //筛选
          let sfound = false;
          NongyeData.forEach(function (shaixuan) {
            if(new RegExp(".*?"+tag).test(shaixuan.name)){
            	self.$set(self.searchMap.shaixuan,'option',shaixuan.shaixuan);
            	sfound = true;
            }
          });
          if(!sfound){
            self.$set(self.searchMap.shaixuan,'option',[]);
          }
        }else{
          self.searchMap.tag = '';
        }
        //同组
        if(list){
          self.$set(self.searchMap,'tongzuList',list)
        }else{
          if(tag){
            Util.ajax.post('/fapi/public/option/zttongzu?name='+tag).then(function (response) {
              if(response.data && response.data.length)
                self.$set(self.searchMap,'tongzuList',response.data)
            });
          }else {
            self.$set(self.searchMap,'tongzuList',[]);
          }
        }
        if(iszhoubian && self.zhoubianPop.lng && self.zhoubianPop.lat){
          var geo = new Circle(new Point({
            "x" : self.zhoubianPop.lng?self.zhoubianPop.lng:(self.mapLocation.lng?self.mapLocation.lng:view.center.x),
            "y" : self.zhoubianPop.lat?self.zhoubianPop.lat:(self.mapLocation.lat?self.mapLocation.lat:view.center.y),
            "spatialReference" : self.$refs.map.$data.map.spatialReference
          }), { "radius": 2000 });
          query.geometry = geo;
        }
        query.orderByFields = [prefix+"HOTSPOT DESC"];
        if(/乡村景点|美丽乡村|农业园|农家乐|民宿|土特产|精品线路/.test(tag)){
          //query.where = query.where+' AND tdt.dbo.t_base_photo.Sort=1 ';
          query.groupByFieldsForStatistics = [ prefix+".NAME" ];
        }
        // When resolved, returns features and graphics that satisfy the query.
        let results = await queryTask.execute(query);
        //如果农业查不到，从POI中查
        /*if(results.features && results.features.length==0 && layerurl==layerurl2){
        	console.log('poi查询');
          queryTask.url = defaulturl;
          results = await queryTask.execute(query);
        }*/
        console.log(results.features);
        if(results.features && results.features.length==self.searchMap.page.pageSize){
          self.searchMap.page.loadmore = true;
        }else{
          self.searchMap.page.loadmore = false;
        }
        results.features.forEach(function (poi) {
          nongyeConfig.replace(poi);
          var arr;
          //距离
          if(poi.attributes.CENTERX && poi.attributes.CENTERY){
            arr = [poi.attributes.CENTERX,poi.attributes.CENTERY]
          }else{
            poi.attributes.CENTERX = poi.geometry.x;
            poi.attributes.CENTERY = poi.geometry.y;
            arr = [poi.geometry.x,poi.geometry.y]
          }
          if(arr[0] && arr[1]){
            var po = new Polyline({
              paths: [[self.mapLocation.lng || view.center.x,self.mapLocation.lat || view.center.y],arr],
              spatialReference: view.spatialReference
            });
            self.$set(poi.attributes,'juli',(geometryEngine.geodesicLength(po, "meters")/1000).toFixed(2));
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
        self.$vux.loading.hide();
        self.searchMap.page.show = true;
        self.searchMap.show=false;
        self.infoPop.show=false;
		  //按距离排
		  if(self.searchMap.shaixuan.on2 || iszhoubian){
			  self.searchMap.shaixuan.on2 = false;//距离排序
			  self.julipaixu();
		  }else{
			  self.searchMap.shaixuan.on2 = false;//筛选重置
		  }
      },
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
      searchInfo(obj,hideReturn,hide){
      	this.searchMap.hideReturn = hideReturn;
        const self = this;
        this.searchMap.page.show = false;
        this.infoPop.show=true;
        console.log(JSON.stringify(obj.attributes));
        if(obj.geometry.x){
        	this.$set(obj.attributes,'CENTERX',obj.geometry.x);
          this.$set(obj.attributes,'CENTERY',obj.geometry.y);
        }
        if(obj.geometry.paths){
          this.$set(obj.attributes,'CENTERX',obj.geometry.paths[0][0][0]);
          this.$set(obj.attributes,'CENTERY',obj.geometry.paths[0][0][1]);
        }
        if(obj.geometry.rings){
          this.$set(obj.attributes,'CENTERX',obj.geometry.rings[0][0][0]);
          this.$set(obj.attributes,'CENTERY',obj.geometry.rings[0][0][1]);
        }
        this.$set(this.infoPop,'info',obj.attributes);
        //后台获取图片 /fapi/needlogin/uploadimg/guid/
        if(!this.infoPop.info.imgList){
          Util.ajax.post('/pubApi/wzmap/poiimg?guid='+obj.attributes.FEATUREGUID).then(function (res) {
            if(res.data && res.data.length) {
              self.$set(self.infoPop.info, 'imgList', res.data);
            }
          });
        }
        if(hide){
          self.infoPop.simple = false;
        }
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
        }).catch((err) => {
          console.log(err);
        });
          const map = this.$refs.map.$data.map;
          const view = this.$refs.map.$data.view;
          if(view.popup){
          	view.popup.close();
          }
          //const sqlwhere = 'FEATUREGUID="'+obj.attributes.FEATUREGUID+'"';
		  if(map.findLayerById('searchInfo')!=null){
			  map.remove(map.findLayerById('searchInfo'));
		  }
          if(obj.geometry.x || obj.geometry.y){
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
              var graphicLayer = new GraphicsLayer({
                graphics: [picGraphic],
                id:'searchInfo'
              });
              map.add(graphicLayer);
              view.center = [obj.attributes.CENTERX || obj.geometry.x,obj.attributes.CENTERY || obj.geometry.y];
            });
          }
          //绘线
          console.log(obj);
          view.graphics.removeAll();
          if(obj.geometry.rings || obj.geometry.paths){
          	if(obj.geometry.extent){
              view.extent = obj.geometry.extent;
            }else{
              view.center = [obj.attributes.CENTERX,obj.attributes.CENTERY];
            }
          }
          if(obj.geometry.paths || obj.geometry.rings){
            esriLoader.loadModules([
              "esri/Graphic",
              "esri/geometry/Polyline"
            ])
            .then(([Graphic, Polyline]) => {
              var lines = new Polyline({
                paths: obj.geometry.paths || obj.geometry.rings,
                spatialReference: view.spatialReference
              });
              var graphic = new Graphic({
                geometry: lines,
                symbol: {
                  type: "simple-line", // autocasts as new SimpleFillSymbol
                  color: '#00ffff',
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
      closePop(){
        this.zhoubianPop.show=false;
        this.collectPop.show=false;
        this.addrPop.show=false;
        this.paddrPop.show=false;
        this.myshangbaoPop.show=false;
        console.log(this.jiucuoPop);
        this.jiucuoPop.show=false;
        this.shangbaoPop.show=false;
        Util.title(this.$route.meta.title);
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
      uploadSuccess(imglist){
        this.$set(this.guidPop.form,'attachs',imglist);
      },
      guidUpload(){
        const self = this;
        if(!this.guidPop.form.attachs){
          this.$vux.toast.text('请选择图片');
          return;
        }
        Util.ajax.post('/fapi/needlogin/uploadimg/add',this.guidPop.form).then(function (response) {
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
        const wx = this.$wechat;
        const self = this;
        let gcj = Util.togcj02(lng,lat);
        wx.ready(function(){
          wx.openLocation({
            latitude: gcj[1], // 纬度，浮点数，范围为90 ~ -90
            longitude: gcj[0], // 经度，浮点数，范围为180 ~ -180。
            name: name, // 位置名
            address: address, // 地址详情说明
            scale: self.$refs.map.$data.view.zoom, // 地图缩放级别,整形值,范围从1~28。默认为最大
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
      //距离排序
      julipaixu(){
      	if(this.searchMap.shaixuan.on2){
          this.searchMap.shaixuan.on2 = false;
          this.$set(this.searchMap.page,'data',this.searchMap.tempData);
        }else{
          this.searchMap.shaixuan.on2 = true;
          this.$set(this.searchMap,'tempData',JSON.parse(JSON.stringify(this.searchMap.page.data)))
          this.searchMap.page.data.sort(function (a,b) {
            return a.attributes.juli-b.attributes.juli;//距离由近到远
          })
        }
      },
      /*//筛选
      doshaixuan(type,sql){
        this.searchMap.shaixuan.on2 = false;
        this.searchMap.shaixuan.on3 = false;
        this.searchMap.shaixuan.on4 = false;
        this.searchMap.shaixuan.on5 = false;
        this.searchMap.shaixuan.on6 = false;
      },*/
      //区域点击
      clickArea(key,item){
        if(item=='全部'){
          item = '';
        }
        this.searchMap.areaName = item;
        this.searchpoi(true,this.searchMap.url,this.searchMap.tag,this.searchMap.tongzuList);
      },
      clickMonth(key,item){
        if(item=='全部'){
          item = '';
        }
        this.searchMap.monthName = item;
        this.searchpoi(true,this.searchMap.url,this.searchMap.tag,this.searchMap.tongzuList);
      },
      clickPrice(key,item){
      	console.log(key);
      	console.log(item);
        this.searchMap.priceName = item.label=='全部'?'':item.label;
        this.searchMap.priceValue = item.value;
        this.searchpoi(true,this.searchMap.url,this.searchMap.tag,this.searchMap.tongzuList);
      },
      clickPrice2(key,item){
        console.log(item);
        this.searchMap.priceName2 = item.label=='全部'?'':item.label;
        this.searchMap.priceValue = item.value;
        this.searchpoi(true,this.searchMap.url,this.searchMap.tag,this.searchMap.tongzuList);
      },
      //底图点击
      nongyeClick(graphic){
      	//console.log(graphic);
        this.ptss.idx = -1;
      	if(!graphic.attributes.CENTERX || !graphic.attributes.CENTERY){
      		this.$set(graphic.attributes,'CENTERX',graphic.geometry.x);
      		this.$set(graphic.attributes,'CENTERY',graphic.geometry.y);
        }
      	//view.popup =
        this.searchInfo(graphic,true);
      },
      //配套设施
      ptssClick(i,idx){
        console.log(i);
        const map = this.$refs.map.$data.map;
        if(this.ptss.idx==idx){
          this.ptss.idx = -1;
			if (map.findLayerById('ptss') != null) {
				map.remove(map.findLayerById('ptss'));
			}
          return;
        }
        this.ptss.idx = idx;
        const self = this;
        const view = this.$refs.map.$data.view;
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          'esri/geometry/Circle',
          'esri/geometry/Point',
          'esri/layers/FeatureLayer',
          'esri/layers/GraphicsLayer',
          'esri/Graphic'
        ]).then(([QueryTask,Query,Circle,Point,FeatureLayer,GraphicsLayer,Graphic]) => {
        	//
          var symbol = {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: '/地图上显示图标/'+i+'.png',
            width: "20px",
            height: "20px"
          };
          //

          if (map.findLayerById('ptss') != null) {
          	map.remove(map.findLayerById('ptss'));
          }
          var graphicLayer = new GraphicsLayer({
            id:'ptss'
          });
          //map.searchInfoLayer.attributes = obj.attributes;
          map.add(graphicLayer);
        	//
          var defaulturl = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
          var queryTask = new QueryTask({
            url: defaulturl
          });
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          var geo = new Circle(new Point({
            "x" : self.infoPop.info.CENTERX,
            "y" : self.infoPop.info.CENTERY,
            "spatialReference" : map.spatialReference
          }), { "radius": 2000 });
          query.geometry = geo;
          query.where = " TAG like '%"+i+"%' ";
          queryTask.execute(query).then(function (results) {
            console.log(results);
            if(results.features && results.features.length){
              results.features.forEach(function (item) {
                var point = new Point({
                  "x" : item.attributes.CENTERX || item.geometry.x,
                  "y" : item.attributes.CENTERY || item.geometry.y,
                  "spatialReference" : map.spatialReference
                });
                var picGraphic = new Graphic(point, symbol);
                self.$set(picGraphic,'attributes',item.attributes);
                graphicLayer.add(picGraphic);
              });
            }
          });
        });
      },
      //图标
      ptssImg(i,idx){
      	let val = '/配套设施图标/';
      	switch (i){
          case '商店':
          	val = idx==this.ptss.idx?'/配套设施图标/便利店绿.png':'/配套设施图标/便利店灰.png';
          	break;
          case '餐饮':
            val = idx==this.ptss.idx?'/配套设施图标/餐饮绿.png':'/配套设施图标/餐饮灰.png';
            break;
          case '公厕':
            val = idx==this.ptss.idx?'/配套设施图标/公厕绿.png':'/配套设施图标/公厕灰.png';
            break;
          case '景点':
            val = idx==this.ptss.idx?'/配套设施图标/景区景点绿.png':'/配套设施图标/景区景点灰.png';
            break;
          case '停车场':
            val = idx==this.ptss.idx?'/配套设施图标/停车场绿.png':'/配套设施图标/停车场灰.png';
            break;
          case '住宿':
            val = idx==this.ptss.idx?'/配套设施图标/住宿绿.png':'/配套设施图标/住宿灰.png';
            break;
        }
        return val;
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
      guidFound(guid,shouReturn,hide){
        const self = this;
        self.$vux.loading.show('查找中');
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query"
        ]).then(([QueryTask,Query]) => {
          //
          var defaulturl = "https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6";
          var prefix = 'tdt.DBO.农业旅游.';
          if(guid=='7878d7a2b7244f7e9a6d5fe926ed9771' || guid=='30e11b145b384e4ea704f876e7f258b5'){
          	defaulturl = 'https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/8';
            prefix = 'tdt.DBO.旅游线路.';
          }
          if(guid=='b6625f1512d64c5798d8dcdbbd7dd187'){
          	defaulturl = 'https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/4'
            prefix = 'tdt.DBO.乡村振兴示范带范围面.';
          }
          var queryTask = new QueryTask({
            url: defaulturl
          });
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.where = prefix+"FEATUREGUID='"+guid+"' ";//tdt.DBO.农业旅游.
          queryTask.execute(query).then(function (results) {
            self.$vux.loading.hide();
            if(results.features && results.features.length){
              let item = results.features[0];
              nongyeConfig.replace(item);
              self.searchInfo(item,!shouReturn,hide);
            }
          });
        });
      },
      showPoiline(i){
      	this.$set(i,'show',!i.show);
      	if(!i.list){
      		this.$set(i,'list',[]);
          this.poiline.forEach(function (data) {
            if(data.lguid==i.attributes.FEATUREGUID){
            	i.list.push(data);
            }
          });
        }
      },
      goback(){
      	console.log('goback')
      	console.log(history);
      	console.log(this.$store.getters.nowRoute);
		  if (this.$store.getters.nowRoute && this.$store.getters.nowRoute.name) {
		  		console.log(11122);
			  if(this.$store.state.app.nowRoute.query.guid &&
					  this.$store.state.app.nowRoute.query.guid!=this.infoPop.info.FEATUREGUID && this.$store.state.app.nowRoute.query.loadmap){
				  const query = this.$store.state.app.nowRoute.query;
				  console.log(222444);
				  this.guidFound(query.guid,false,true);
			  }else{
				  this.$router.push({
					  name: this.$store.state.app.nowRoute.name,
					  query: this.$store.state.app.nowRoute.query
				  });
			  }
		  } else {
		  	console.log(333);
			  history.go(-1);
			  console.log(this.$route);
		  }
      }
    },
    mounted(){
      const self = this;
      //是否加载地图
      const query = this.$route.query;
      if(query && query.loadmap=='false'){
        this.loadmap = false;
      }
      const wx = this.$wechat;
      Util.checkLog().then(function (response) {
        if(response.data.code!=100){
          Util.login();
        }else{

        }
      });
      if(!Util.isIOS()){
        var param = new URLSearchParams();
        param.append('url', window.location.href.split('#')[0]);
        param.append("token", window.localStorage.getItem("token"));
        Util.ajax.post("http://115.223.34.189:8099/xypt/wx/getsign", param).then(function (data) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx7eeb4eea87cf3ce6', // 必填，公众号的唯一标识
            timestamp: data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.data.noncestr, // 必填，生成签名的随机串
            signature: data.data.signature,// 必填，签名
            jsApiList: ['getLocation','openLocation','previewImage'
              ,'updateAppMessageShareData','updateTimelineShareData'
              ,'onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表
          });
        });
      }
      //全景点击
      $('body').on('click','.quanjingOpen',function () {
        self.quanjingOpen($(this).attr('data-url'));
      });
      //面点关系
      Util.ajax.post('/fapi/public/nongye/option/poiline').then(function(res){
        self.$set(self.$data,'poiline',res.data || []);
      });
    }
  }
</script>
