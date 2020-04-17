<template>
  <div class="cehui" style="height:100%;width:100%;overflow: hidden;">
    <!-- 右侧 -->
    <popup v-model="rightpopshow" position="right" :popup-style="{'z-index':9999}" id="pop"
           width="70%" height="100%" style="z-index:999;" @on-first-show="firstShow">
      <!-- 顶部筛选 -->
      <tab>
        <tab-item :selected="rightidx==0" @click.native="rightidx=0">温州2000坐标系</tab-item>
        <tab-item :selected="rightidx==1" @click.native="rightidx=1">温州城市坐标系</tab-item>
      </tab>
      <div v-for="(i,idx) in navData" v-if="rightidx==0">
        <div class="ritem-title" @click="dataShow(i)" >{{i.name}}
          <img src="@/images/zhankai.png" style="float: right;width:16px;margin-top:12px;" alt=""/></div>
        <div class="ritem-list" v-if="i.show">
          <div v-for="(ii,idx2) in i.list" >
            <template v-if="ii.list && ii.list.length">
              <div class="ritem-title" @click="dataShow(ii)" :class="{'on':i.show}">{{ii.name}}
                <img src="@/images/zhankai.png" style="float: right;width:16px;margin-top:12px;" alt=""/></div>
              <div v-if="ii.show" v-for="(i3,idx3) in ii.list" class="ritem-link" :class="{'on':i3.url==nowurl}"
                   @click="dataShow(i3)" :style="{'background':(idx3+1)%2==0?'#fff':'#efefef'}">{{i3.name}}</div>
            </template>
            <template v-else>
              <div class="ritem-link" :class="{'on':ii.url==nowurl}"
                   @click="dataShow(ii)" :style="{'background':(idx2+1)%2==0?'#fff':'#efefef'}">{{ii.name}}</div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="rightidx==1" v-for="(i,idx) in navData2">
        <div class="ritem-title" @click="dataShow(i)" >{{i.name}}
          <img src="@/images/zhankai.png" style="float: right;width:16px;margin-top:12px;" alt=""/></div>
        <div class="ritem-list" v-if="i.show">
          <div v-for="(ii,idx2) in i.list" >
            <template v-if="ii.list && ii.list.length">
              <div class="ritem-title" @click="dataShow(ii)" :class="{'on':i.show}">{{ii.name}}
                <img src="@/images/zhankai.png" style="float: right;width:16px;margin-top:12px;" alt=""/></div>
              <div v-if="ii.show" v-for="(i3,idx3) in ii.list" class="ritem-link" :class="{'on':i3.url==nowurl}"
                   @click="dataShow(i3)" :style="{'background':(idx3+1)%2==0?'#fff':'#efefef'}">{{i3.name}}</div>
            </template>
            <template v-else>
              <div class="ritem-link" :class="{'on':ii.url==nowurl}"
                   @click="dataShow(ii)" :style="{'background':(idx2+1)%2==0?'#fff':'#efefef'}">{{ii.name}}</div>
            </template>
          </div>
        </div>
      </div>
    </popup>
    <tianditu @mapload="mapload"
              @cehuiClick="cehuiClick"
              :loading=true
              layerurl="http://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"
              ref="map" mapid="cehuimap" style="height:100%;"></tianditu>
    <!-- 固定底部 -->
    <!--<div class="cehui-bottom">
      <div class="bitem" v-for="(i,idx) in navData" style="border-right:1px solid #eee;">
        <div class="bitem-tit" @click="dataShow(i)" :class="{'on':i.show}">{{i.name}}</div>
        <div class="bitem-list" v-if="i.show"  style="overflow: scroll;" :style="{'height':idx==0?'auto':'300px'}">
          <a @click="cehuiLoad(ii)" v-for="ii in i.list" :class="{'on':ii.url==nowurl}" style="font-size: 10px;">{{ii.name}}</a>
        </div>
      </div>
    </div>-->
    <!--<div class="cehuibtn"
         @click="content.show=false;rightpopshow=true">
      <p>测绘</p>
      <p>列表</p>
    </div>-->
    <!-- 固定头部介绍 -->
    <div v-if="nowname" style="position: fixed;top:10px;width:calc(100% - 20px);left:10px;z-index:9;
        background: #fff;border-radius: 5px;padding: 10px;box-sizing: border-box">
      <div style="font-size: 16px;font-weight: bold;">{{nowname}}</div>
      <div>{{nowstr}}</div>
      <img  src="@/images/close.png" @click="nowname=''" style="width: 20px; position: absolute; top: 10px; right: 10px;">
    </div>
    <!-- 内容弹出 -->
    <popup height="calc(100% - 200px)"
           v-model="content.show"
           style="width:calc(100% - 40px);"
           :show-mask="false" class="cehui-con">
      <div class="info-pop-tool" style="width:calc(100% - 20px);">
        <img src="@/images/down10.png" @click="content.show=false" alt="">
      </div>
      <!--内容-->
      <div class="con-list" style="overflow-y:scroll;overflow-x:hidden;height:calc(100% );">
        <tab v-if="nowtab && nowtab.length>0">
          <tab-item v-for="(i,idx) in nowtab" :selected="idx==tabidx" @on-item-click="tabidx=idx">{{i.name}}</tab-item>
        </tab>
        <div v-if="nowtab && nowtab.length>0">
          <div class="con-item" v-for="i in nowtab[tabidx].field">
            <div>{{i}}:</div>
            <div>{{content.data[i]}}</div>
          </div>
        </div>
      </div>
    </popup>

    <!--  -->
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
        <div class="tmap-left-tools" v-if="!is3D" style="display:none;">
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
              <div class="tmap-tools_7 tmap-box" @click="qingchu">
                <img src="@/images/t-3.png" alt="">
                <div><span style="opacity: 0">线</span>清除<span style="opacity: 0">线</span></div>
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
          <!--<div class="tmap-zhoubian tmap-box" @click="dituPop.show=true;dituPop.load=true">
            <img src="@/images/r-1.png" alt="">
            <div>地图</div>
          </div>-->
          <div class="tmap-zhoubian tmap-box">
            <!--<div @click="shangbaoPop.show=true">
              <img src="@/images/r-2.png" alt="">
              <div>上报</div>
            </div>-->
            <template v-if="!is3D">
              <!--<div class="tmap-divide"></div>-->
              <div @click="dingwei(true)">
                <img src="@/images/r-3.png" alt="">
                <div>定位</div>
              </div>
            </template>
          </div>
          <!--  -->
          <div class="cehuibtn zhuantibtn tmap-zhoubian tmap-box"
               @click="content.show=false;rightpopshow=true"
               style="position: static;width:30px;margin-top: 10px;">
            <!--<p>测绘</p>-->
            <p>
              <img src="@/images/mlist.png" style="width:16px;margin:0 auto;" alt="" />
            </p>
            <p>列表</p>
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
        <shangbao-form @closePop="closePop();$refs.personal.shangbao();" v-if="shangbaoPop.show"></shangbao-form>
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
      <tab v-if="searchMap.page.show && searchMap.tongzuList && searchMap.tongzuList.length>0">
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
          <div class="s_result_item-info" @click="testsearch(i)">
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
        <!--<div class="info-pop-con">
          <div class="info-pop_tit">{{infoPop.info.NAME || infoPop.info['名称']}}</div>
          <div class="info-pop_info">
            <div v-if="infoPop.info.juli">距离：{{infoPop.info.juli}}千米</div>
            <div v-if="infoPop.info.ADDRESS">地址：{{infoPop.info.ADDRESS}}</div>
          </div>
          <div class="info-pop_btn">
            <div @click="Xiangxi" :class="(infoPop.info.imgList && infoPop.info.imgList.length)?'on':''">
              <img v-if="(infoPop.info.imgList && infoPop.info.imgList.length)" src="@/images/tem-1o.png" alt="">
              <img v-else src="@/images/tem-1.png" alt="">详 情</div>
            <div @click="findQuanjing"
                 :class="quanjingPop.url?'on':''">
              <img v-if="quanjingPop.url" src="@/images/tem-2o.png" alt="">
              <img v-else src="@/images/tem-2.png" alt="">全 景</div>
            <div @click="guidPop.show=true;guidPop.form.guid=infoPop.info.FEATUREGUID"><img src="@/images/tem-3.png" alt="">上传照片</div>
          </div>
          &lt;!&ndash; 照片 &ndash;&gt;
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
          </div>
          &lt;!&ndash; 内容 &ndash;&gt;
        </div>-->
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

  </div>
</template>
<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader'
  import {Popup,Tab,TabItem} from 'vux';
  import Tianditu from '@/components/libs/tianditu/main';
  import {mapmixin} from '@/mixin/map.js';
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
      Tianditu,Popup,Tab,TabItem,JiucuoForm,Zhoubian,Uploader,TContent,ShangbaoForm,
      Personal,PAddr,AddrList,CollectList,ShangbaoList
    },
    mixins:[mapmixin],
    data(){
      return {
        nowurl:"",
        rightpopshow:false,
        rightidx:0,
        nowname:"",
        nowstr:"",
        nowtab:[],
        tabidx:0,
        navData:[],
        navData2:[],
        content:{
          show:false,
          data:{}
        }
      }
    },
    computed:{
      contentData(){
        let data = [];
        for(let key in this.content.data){
          let val = this.content.data[key];
          if(!/^\w.*$/.test(key) && val){
          	if(/.*?时间.*/.test(key)){
          		console.log(key+':'+val);
          		let date = new Date(val);
				let y = date.getFullYear();
				if(y){
					val = date.Format('yyyy-MM-dd');
				}
          	}
            data.push({
              'key':key,
              'val':val///.*?时间.*/.test(key)?new Date(val).Format('yyyy-MM-dd'):val
            })
          }
        }
        return data;
      }
    },
    methods:{
      mapload(map){
        const self = this;
      },
      dataShow(obj){
        //console.log(obj);
        if(obj.list){
          this.$set(obj,'show',!obj.show);
        }else{
          //this.popShow=false;
          this.cehuiLoad(obj);
          this.rightpopshow=false;
        }
      	/*this.navData.forEach(function (item) {
          if(item.name!=i.name)
            item.show=false;
        });
        i.show=!i.show;*/
      },
      testsearch (i) {
        this.searchInfo(i);
      },
      cehuiClick(graphic){
        //console.log(JSON.stringify(graphic.attributes));
        this.content.show = true;
        this.content.data = graphic.attributes;
        for(let key in this.content.data){
          let val = this.content.data[key];
          if(!/^\w.*$/.test(key) && val && /.*?时间.*/.test(key)){
			  let date = new Date(val);
			  //console.log(key+':'+val);
			  let y = date.getFullYear();
			  if(y){
				  val = date.Format('yyyy-MM-dd hh:mm:ss');
			  }
            this.content.data[key] = val;
          }
        }
        this.tabidx = 0;
      },
      cehuiLoad(ii){
        const map = this.$refs.map.$data.map;
        if(map.findLayerById('cehui')!=null){
          map.remove(map.findLayerById('cehui'));
          if(ii.url==this.nowurl){
            this.nowurl = '';
            this.nowname = '';
            return;
          }
        }
        this.$vux.loading.show();
        const self = this;
        esriLoader.loadModules([
          'esri/tasks/support/Query',
          'esri/tasks/QueryTask',
          'esri/layers/FeatureLayer'
        ]).then(([Query,QueryTask,FeatureLayer])=>{
          let url = ii.url;
          self.nowurl = url;
          //self.nowtab = ii.tab;
          self.$set(self.$data,'nowtab',ii.tab);
          self.nowname = ii.name;
          self.nowstr = ii.str;
          let cehuiLayer = new FeatureLayer(url,{
            outFields: ["*"],
            id:'cehui',
            opacity:0.6
          });
          cehuiLayer.on('layerview-create',function () {
            self.$vux.loading.hide();
          })
          map.add(cehuiLayer);
        });
      }
    },
    created(){
    	const self = this;
    	Util.ajax.get('/datas/cehui.json').then(function (response) {
    		var data = eval("("+response.data+")");
        self.$set(self.$data,'navData',data.navData);
        self.$set(self.$data,'navData2',data.navData2);
      });
    },
    mounted(){
      const wx = this.$wechat;
      Util.checkLog().then(function (response) {
        if(response.data.code==100){
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
        }else{
          Util.login();
        }
      });
    }
  }
</script>

<style lang="less">
  @import "../home/home.less";
  @import "cehui.less";
</style>
