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

      <div class="mt10">
        <!-- 右侧周边 -->
        <div class="tmap-right-tools">
          <div class="tmap-zhoubian tmap-box">
            <div @click="infoPop.show=false;popShow=true">
              <img src="@/images/mlist.png" style="width:18px;margin:0 auto;" alt="" />
              <div class="on">列表</div>
            </div>
            <div class="tmap-divide"></div>
            <div @click="qiehuanYingxiang">
              <img src="@/images/qiehuan.png" style="width:16px;">
              <div v-if="isYingxiang">矢量</div>
              <div v-else>影像</div>
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

    <!-- 底部多少条 -->
    <div v-if="!searchMap.page.show && searchMap.page.data && searchMap.page.data.length && searchMap.count"
         @click.sync="searchMap.page.show=true"
         style="position:fixed;bottom:0;height:36px;line-height:36px;background:#fff;z-index:20;width:100%;text-align: center;">
      在<b class="on">{{searchMap.key || searchMap.tag}}</b>找到<b class="on">{{searchMap.count}}</b>条记录
    </div>

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
            <div class="m-pop-tit" @click="searchInfoClick(i)">
              <div :data="i.pic" style="display: inline-block;position: relative;width:26px;height:26px;vertical-align: bottom;margin-bottom:7px;border-radius:5px;"
                   :style="computedBg(i.pic)" >
                  <!--<img :src="computedImg(i.pic)" style="display: block;margin:0 auto;max-width:24px;
                  max-height:24px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)" />-->
              </div>
              {{i.name}} ({{i.list?i.list.length:0}})
              <img src="@/images/zhankai.png" :style="{transform: 'rotate(' + (i.show ? '-180' : '0') + 'deg)'}" style="float: right;width:16px;margin-top:12px;" alt=""/>
            </div>
            <div class="m-pop-list" style="overflow: scroll;" v-if="i.show && i.list && i.list.length">
              <!-- searchInfoClick -->
              <a @click="searchInfoClick(ii)" v-show="!ii.hide" v-for="(ii,idx2) in i.list"
                 :style="{'background':(idx2+1)%2==0?'#fff':'#f5f5f5'}"
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

    <!-- 详细信息 -->
    <popup v-model="infoPop.show" :show-mask="false"
           style="max-height:calc(100% - 100px);padding: 0 10px;width:100%;box-sizing: border-box;z-index:400;">
      <div class="info-pop">
        <!-- 顶部关闭 -->
        <div class="info-pop-tool">
          <img v-show="!infoPop.iscollect && !searchMap.hideReturn" src="@/images/back.png" @click="infoPop.show=false;searchMap.page.show=true;" class="rtn" alt="">
          <!--  -->
          <img src="@/images/up10.png" @click="Xiangxi" alt="">
          <!--<img v-else src="@/images/down10.png" @click="infoPop.simple = true" alt="">-->
          <!--  -->
          <img src="@/images/close.png" @click="()=>{
            if(highlight){
              highlight.remove();
            }
            if($refs.map.$data.map.findLayerById('searchInfo')!=null){
              $refs.map.$data.map.remove($refs.map.$data.map.findLayerById('searchInfo'));
            }
            infoPop.show=false
          }" class="cls" alt="">
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
          <!--<div class="info-pop_btn">
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


  </view-box>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import Tianditu from '@/components/libs/tianditu/main';
  import {mapmixin} from '@/mixin/simplemap.js';
  import {Popup,Tab,TabItem,ViewBox} from 'vux';
  import Zhoubian from '@/components/map/zhoubian';
  import Uploader from '@/components/libs/Uploader/Uploader';
  import JiucuoForm from '@/components/personal/jiucuo/form.vue';//纠错
  import TContent from '@/components/home/listView';
  import ShangbaoForm from '@/components/personal/shangbao/form.vue';//上报
  //import Personal from '@/components/personal/index';//个人中心
  //import PAddr from '@/components/personal/addr/form';
  //import AddrList from '@/components/personal/addr/list';//地址列表
  //import CollectList from '@/components/personal/collect/list';//收藏
  //import ShangbaoList from '@/components/personal/shangbao/list';//上报列表
  export default {
    components:{
    	Tianditu,ViewBox,Popup,Tab,TabItem,JiucuoForm,Zhoubian,Uploader,TContent,ShangbaoForm
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
        layerurl:"",
        //专题搜索
        zhuantiSearchKey:"",
        tempData:[],
        isYingxiang:false
      }
    },
    watch:{
    	'infoPop.simple':function(val,oldVal){
        const wx = this.$wechat;
        const self = this;
        if(val){
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
        }else{
          wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: self.infoPop.info.NAME, // 分享标题
              desc: self.content.summary || '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/mzmap?mid="+self.content.id+"&guid="+self.infoPop.info.FEATUREGUID+"&layerurl="+self.layerurl+"&loadmap=false", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: self.content.pic?(/http.*/.test(self.content.pic)?self.content.pic:"http://"+location.host+"/"+self.content.pic.replace('/upload','upload')):'' // 分享图标
            });
            wx.onMenuShareTimeline({
              title: self.infoPop.info.NAME, // 分享标题
              desc: self.content.summary || '', // 分享描述
              link: "http://tdt.wzmap.gov.cn/#/mzmap?mid="+self.content.id+"&guid="+self.infoPop.info.FEATUREGUID+"&layerurl="+self.layerurl+"&loadmap=false", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
      qiehuanYingxiang(){
        if(this.isYingxiang){
          this.$refs.map.zhuantiMap('简约版',true);
        }else{
          this.$refs.map.yingxiangMap(true);
        }
        this.isYingxiang = !this.isYingxiang;
      },
      guidFound(guid,layerurl){
        const self = this;
        self.$vux.loading.show('查找中');
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query"
        ]).then(([QueryTask,Query]) => {
          var queryTask = new QueryTask({
            url: layerurl
          });
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.where = "FEATUREGUID='"+guid+"' ";
          queryTask.execute(query).then(function (results) {
            self.$vux.loading.hide();
            if(results.features && results.features.length){
              let item = results.features[0];
              self.searchInfo(item,true);
              self.infoPop.simple = false;
            }
          });
        });
      },
      computedImg(pic){
        pic = pic.replace('↵','');
        pic = pic.replace(/\r|\n|\r\n/gi,'');
        if(/^(#|rgb).*/.test(pic)){
          return pic;
        }else if(/(http|\/upload).*/.test(pic)){
          return pic;
        }else{
          return '/每周一图图标v.2/'+pic;
        }
      },
      computedBg(pic){
        pic = pic.replace('↵','');
        pic = pic.replace(/\r|\n|\r\n/gi,'');
        let result =  {
          'background-color':'#fff',
          'background-position':'center',
          'background-size':'100% 100%',
          'background-repeat':'no-repeat'
        };
        if(/^(#|rgb).*/.test(pic)){
          result['background-color'] = pic;
        }else if(/(http|\/upload).*/.test(pic)){
          result['background-image'] = 'url('+pic+')';
        }else{
          result['background-image'] = 'url(\'/每周一图图标v.2/'+pic+'\')';
        }
        return result;
      },
      mapload(map,view){
        const self = this;
        self.$vux.loading.show();
        //点击次数
        Util.ajax.post('/fapi/public/meizhou/read/'+this.mid).then(function (response) {});
        //GUID
        if(this.$route.query && this.$route.query.guid && this.$route.query.layerurl){
        	this.guidFound(this.$route.query.guid,this.$route.query.layerurl);
        }
        //地图加载
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
            /*response.data.list.forEach(function(mm){
              mm.serviceurl.replace()
            });*/
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
                    field:childData.fenleifield,
                    detail:childData.detail,
                    pics:[childData.pic],
                    childs:[childData]
                  });
                }
              });
              self.$set(self.$data,'layerArr',layerArr);
              layerArr.forEach(function (layer,idx) {
              	console.log(layer);
                var url = layer.url;
                var lid = 'meizhouyitu'+idx;
                self.$set(layer,'lid',lid);
                //
                var querywhere = "1=1";
                var meizhouLayer = new FeatureLayer(url,{
                  outFields: ["*"],
                  id:'meizhouyitu'+idx,
                  definitionExpression: querywhere,
                });
                meizhouLayer.on('layerview-create',function (e) {
                  console.log('加载完毕');
                  self.layerView = e.layerView;
                  self.$set(layer,'layerView',e.layerView);
                  self.$set(layer,'fields',e.layerView.layer.fields);
                  self.fields = e.layerView.layer.fields;
                });
                //图标设置
                let arrs = [];
                if(layer.lineorpoi==0){
                  let pic = '';
                  let arrs = [];
                  layer.childs.forEach(function (d) {
                  	if(d.enums){
                  		d.enums.replace(/，/gi,',').split(',').forEach(function (_enum) {
                        if(/#.*/.test(d.pic)){
                          arrs.push({"symbol":{
                            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                            style: "circle",
                            color: d.pic,
                            size: d.imgsize1?d.imgsize1:'20px',
                            outline:{
                              width:0
                            }
                          },
                            "value":_enum
                          });
                        }else{
                          if(/(\/upload|http|upload).*/.test(d.pic)){
                            pic = d.pic
                          }else{
                            pic = "/每周一图图标v.2/"+d.pic;
                          }
                          arrs.push({
                            "symbol":{
                              "width":d.imgsize1?d.imgsize1:'20px',
                              "type":"picture-marker",
                              "url":pic,
                              "height":d.imgsize1?d.imgsize1:'20px'
                            },
                            "value":_enum
                          });
                        }
                      })
                    }else{
                      if(/#.*/.test(d.pic)){
                        arrs.push({"symbol":{
                          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                          style: "circle",
                          color: d.pic,
                          size: d.imgsize1?d.imgsize1:'20px',
                          outline:{
                            width:0
                          }
                        },
                          "value":d.name
                        });
                      }else{
                        if(/(\/upload|http|upload).*/.test(d.pic)){
                          pic = d.pic
                        }else{
                          pic = "/每周一图图标v.2/"+d.pic;
                        }
                        arrs.push({
                          "symbol":{
                            "width":d.imgsize1?d.imgsize1:'20px',
                            "type":"picture-marker",
                            "url":pic,
                            "height":d.imgsize1?d.imgsize1:'20px'
                          },
                          "value":d.name
                        });
                      }
                    }
                  });

                  let defaultsymbol;
                  if(/#.*/.test(pic)){
                    defaultsymbol = {
                      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                      style: "circle",
                      color: pic,
                      size: "20px",
                      outline:{
                        width:0
                      }
                    }
                  }else{
                    /*if(/(upload|\/upload|http).*!/.test(pic)){
                      pic = pic
                    }else{
                      pic = "/每周一图图标v.2/"+pic;
                    }*/
                    defaultsymbol = {
                      "width":"20px",
                      "type":"picture-marker",
                      "url":pic,
                      "height":"20px"
                    }
                  }
                  console.log('layer');
                  meizhouLayer.renderer = {
                    type: "unique-value",  // autocasts as new UniqueValueRenderer()
                    field: layer.field || self.content.field,
                    defaultSymbol: defaultsymbol,
                    uniqueValueInfos: arrs
                  };
                  console.log(meizhouLayer.renderer);
                }else if(layer.lineorpoi==1){
                  layer.childs.forEach(function (d) {
                    if(d.enums){
                      d.enums.replace(/，/gi,',').split(',').forEach(function (_enum) {
                        arrs.push({
                          "symbol": {
                            type: "simple-line", // autocasts as new SimpleLineSymbol()
                            color: d.pic,
                            width: d.linewidth?d.linewidth:'3px',
                            style: d.linestyle
                          },
                          "value": _enum
                        });
                      })
                    }else{
                      arrs.push({
                        "symbol": {
                          type: "simple-line", // autocasts as new SimpleLineSymbol()
                          color: d.pic,
                          width: d.linewidth?d.linewidth:'3px',
                          style: d.linestyle
                        },
                        "value": d.name
                      });
                    }
                  });
                  meizhouLayer.renderer = {
                    type: "unique-value",  // autocasts as new UniqueValueRenderer()
                    field: layer.field,
                    defaultSymbol: {
                      type: "simple-line", // autocasts as new SimpleLineSymbol()
                      color: "",
                      width: "3px",
                      style: "solid"
                    },
                    uniqueValueInfos: arrs
                  };
                }else{
                  layer.childs.forEach(function (d) {
                    let defaultPic = d.pic;
                    if(d.enums){
                      d.enums.replace(/，/gi,',').split(',').forEach(function (_enum) {
                        arrs.push({
                          "symbol": {
                            type: "simple-fill", // autocasts as SimpleFillSymbol
                            color: layer.field?(/^\[.*?/.test(defaultPic)?JSON.parse(defaultPic):defaultPic):[0, 158, 96, 0.4],
                            style: d.mianstyle?d.mianstyle:"solid",
                            outline: { // autocasts as SimpleLineSymbol
                              color: /^\[.*?/.test(d.outcolor)?JSON.parse(d.outcolor):d.outcolor,//outcolor
                              width: d.outlinewidth?d.outlinewidth:'0px',
                              style:d.outlinestyle?d.outlinestyle:'solid'
                            }
                          },
                          "value": _enum
                        });
                      })
                    }else{
                      arrs.push({
                        "symbol": {
                          type: "simple-fill", // autocasts as SimpleFillSymbol
                          color: layer.field?(/^\[.*?/.test(defaultPic)?JSON.parse(defaultPic):defaultPic):[0, 158, 96, 0.4],
                          style: d.mianstyle?d.mianstyle:"solid",
                          outline: { // autocasts as SimpleLineSymbol
                            color: /^\[.*?/.test(d.outcolor)?JSON.parse(d.outcolor):d.outcolor,//outcolor
                            width: d.outlinewidth?d.outlinewidth:'0px',
                            style:d.outlinestyle?d.outlinestyle:'solid'
                          }
                        },
                        "value": d.name
                      });
                    }
                  });
                  meizhouLayer.renderer = {
                    type: "unique-value",  // autocasts as new UniqueValueRenderer()
                    field: layer.field,
                    defaultSymbol: {
                      type: "simple-fill", // autocasts as new SimpleLineSymbol()
                      color: "",
                      style: "solid"
                    },
                    uniqueValueInfos: arrs
                  };
                }
                map.add(meizhouLayer);

                /*layer.childs.forEach(function (child,idx2) {
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
                    if(/#.*!/.test(child.pic)){
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
                      if(/upload.*!/.test(child.pic) || /\/upload.*!/.test(child.pic)){
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
                });*/


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
        /*if(!this.lng || !this.lat){
          self.dingwei(true);
        }*/
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
    				self.layerurl = layer.url;
    				/*layer.childs.forEach(function (child) {
    					//console.log(graphic.attributes[self.content.field]);
              if(child.enums && child.hignlightcolor){
                child.enums.replace(/，/gi,',').split(',').forEach(function (cenum) {
                  if(new RegExp(".*?"+cenum).test(graphic.attributes[child.fenleifield || self.content.field])){
                    fd = true;
                    self.$refs.map.$data.view.highlightOptions.color =
                      /\#.*!/.test(child.hignlightcolor)?child.hignlightcolor:JSON.parse(child.hignlightcolor);
                    return
                  }
                });
              }else if(new RegExp(".*?"+child.name).test(graphic.attributes[child.fenleifield || self.content.field]) && child.hignlightcolor){
              	fd = true;
              	self.$refs.map.$data.view.highlightOptions.color =
                  /\#.*!/.test(child.hignlightcolor)?child.hignlightcolor:JSON.parse(child.hignlightcolor);
              }
            });
    				if(!fd){
              self.$refs.map.$data.view.highlightOptions.color = '#00ffff';
            }*/
    				try {
    					if(layer.lineorpoi && layer.lineorpoi>0){
                self.highlight = layer.layerView.highlight(graphic);
              }
            }catch (e){
    					console.log(e);
            }
            /*try{
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
            }*/
            self.fields = layer.fields;
            console.log('layer');
            console.log(layer);
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
