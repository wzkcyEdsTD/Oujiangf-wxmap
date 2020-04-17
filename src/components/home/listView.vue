<style scoped lang="less">
  @import "../jiaoyu/index.less";
</style>
<template>

  <div id="jiaoyuListView">
    <!--头部开始-->
    <div class="top_chome">
      <!--<div class="ihome" @click="goback"></div>-->
      <div class="icloes" @click="goback"></div>
    </div>
    <!--头部-->
    <div class="xczt_banner">
      <img :src="topImg" v-if="topImg" class="ims">
      <div v-else style="height:50px;"></div>
    </div>
    <div class="main">
      <div class="rt_tit" style="min-height:32px;">
        <span class="fl">
          <b>{{content.NAME || content.name || content['名称']}}</b>
          <!-- 暂时去除距离 -->
          <div class="tit" style="padding-left:10px;"><template v-if="false && content.juli">距您：{{content.juli}}KM</template>
            <template v-if="content.ADDRESS">地址：{{content.ADDRESS}}</template></div>
        </span>
        <div class="bt_mp" @click="goback">进入地图</div>
      </div>
      <div class="clear"></div>
      <div class="map_mu" v-if="content.DEFINING_TAG && content.DEFINING_TAG!=' '">
        <a v-for="i in content.DEFINING_TAG.split(',')" v-if="i">{{i}}</a>
      </div>
      <div class="clear h20"></div>
      <div class="map_btn" v-show="false">
        <a class="on" @click="$emit('zhoubian')">周边</a>
        <a @click="$emit('shoucang')" :class="(content.collect && content.collect.id)?'on':''">
          {{(content.collect && content.collect.id)?'已收藏':'收藏'}}
        </a>
        <a class="on" @click="$emit('jiucuo')">纠错</a>
        <a class="on" @click="openLocation(content.CENTERX,content.CENTERY,content.NAME,content.ADDRESS,'')">导航</a>
        <a :class="content.vrurl?'on':''" @click="$emit('findQuanjing')">全景</a>
        <a class="on" @click="$emit('guidUpload')">传图</a>
      </div>
      <div class="clear"></div>
      <a name="twjj11" id="twjj11"></a>
      <div class="about">
        <div class="rt_tit mart" >
          <strong>基本信息</strong>
        </div>
        <div class="wz" v-if="infoKeyVal && infoKeyVal.length" style="padding-left:10px;">
          <div v-for="i in infoKeyVal" v-if="i.value && i.name!='SUMMARY' && i.name!='简介' ">
            <template v-if="i.name=='电话'"><a class="on" style="text-decoration: underline;" :href="'tel:'+i.value">{{i.name}}：{{i.value}}</a></template>
            <template v-else>{{i.name}}：{{i.value}}</template>
          </div>
        </div>
        <div class="wz" v-else-if="content.option" style="padding-left:10px;">
          <template v-for="i in content.option.zhanshi.split('、')">
            <template v-if="content[i.replace(/(\(|（).*/,'')] && i.replace(/(\(|（).*/,'')!='SUMMARY'">
              <template v-if="i.replace(/(\(|（).*/,'')=='PHONE'"><a class="on" style="text-decoration: underline;" :href="'tel:'+content[i.replace(/(\(|（).*/,'')]">{{i.replace(/.*?(\(|（)/,'').replace(/）|\)/,'')}}:{{content[i.replace(/(\(|（).*/,'')]}}</a></template>
              <template v-else>{{i.replace(/.*?(\(|（)/,'').replace(/）|\)/,'')}}:{{content[i.replace(/(\(|（).*/,'')]}}</template>
              <br/>
            </template>
          </template>
        </div>
        <div class="wz" v-else style="padding-left:10px;">
          <template v-if="content.ADDRESS">地址：{{content.ADDRESS}}<br/></template>
          <!-- 暂时去除距离 -->
          <template v-if="false && content.juli">距您：{{content.juli}}</template>
        </div>
        <div class="rt_tit mart" v-if="content.imgList && content.imgList.length">
          <strong>图库</strong>
          <a  @click="$emit('guidUpload')" class="pmore">上传图片</a>
        </div>
      </div>
      <!-- 图片 -->
      <previewer ref="previewer" :list="content.imgList" v-if="content.imgList"></previewer>
      <div class="swiper-container" id="swiper2" v-if="content.imgList && content.imgList.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide"  v-for="(i,idx) in content.imgList"
               @click="previewImage(i.ServerUrl+'/'+(i.Location || i.SmallLocation)+'/'+i.Name,idx)">
            <div style="height:100px;position: relative;overflow:hidden;"
                 :style="{'background':'url(\''+(i.ServerUrl+'/'+(i.SmallLocation || i.Location)+'/'+i.Name)+'\') no-repeat','background-size':'100%'}">
              <!--<img :src="i.ServerUrl+'/'+(i.SmallLocation || i.Location)+'/'+i.Name" style="position: absolute;" alt="">-->
            </div>
          </div>
        </div>
      </div>
      <!--<ul class="item-pic" v-if="content.imgList && content.imgList.length">
        <li v-for="(i,idx) in content.imgList"
            @click="previewImage(i.ServerUrl+'/'+(i.Location || i.SmallLocation)+'/'+i.Name,i.ServerUrl+'/'+(i.Location || i.SmallLocation)+'/'+i.Name)">
          <div style="height:100px;"
               :style="{'background':'url('+i.ServerUrl+'/'+(i.SmallLocation || i.Location)+'/'+i.Name+') no-repeat center 100%','background-size':'100%'}"></div>
        </li>
      </ul>-->
      <div class="clear"></div>
      <div class="rt_tit mart" v-if="yinxiang && yinxiang.length">
        <strong>印象标签</strong>
      </div>
      <ul class="yxpj_li" v-if="yinxiang && yinxiang.length">
        <li v-for="(i,idx) in yinxiang">
          <div class="item" @click="updateYinxiang(i,idx)" :class="i.id?'on':''">{{i.name}}（{{i.value}}）</div>
        </li>
      </ul>
      <div class="clear "></div>
      <div class="rt_tit mart" v-if="content.SUMMARY">
        <strong>简介</strong>
      </div>
      <div class="wz" v-if="content.SUMMARY">
        <p style="text-indent: 2em;">
          {{content.SUMMARY}}
        </p>
      </div>
    </div>
    <div class="clear h20"></div>
    <!--  -->
    <div class="clear ctbg2" style="height: 12px;"  v-if="zhoubianData && zhoubianData.length>0"></div>
    <div class="main">
      <div class="rt_tit mart" v-if="zhoubianData && zhoubianData.length>0">
        <strong>周边{{tag1}}</strong>
      </div>
      <div class="clear"></div>
      <div class="list_xc">
        <div class="s-result_item" v-for="(i,idx) in zhoubianData">
          <!-- 点击详情 -->
          <div class="s_result_item-info" @click="searchInfo(i)">
            <div>{{i.attributes.NAME}}</div>
            <div v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
            <div v-if="i.attributes.juli">距离：{{i.attributes.juli}}km</div>
            <div v-if="i.attributes.DEFINING_TAG" class="item-tag-list">
              <span v-for="ii in (i.attributes.DEFINING_TAG).split(',')" class="item-tag">{{ii}}</span>
            </div>
          </div>
          <!-- 导航 -->
          <!-- 暂时隐藏 -->
          <div class="s_result_item-icon" v-show="false">
            <img src="@/images/i-daohang.png" @click="openLocation(i.attributes.CENTERX,i.attributes.CENTERY,i.attributes.NAME,i.attributes.ADDRESS,'')" alt="">
          </div>
        </div>
      </div>
      <div class="clear"></div>
      <div class="clear ctbg2" style="height: 12px;" v-if="zhoubianData2 && zhoubianData2.length>0"></div>
      <div class="rt_tit mart" v-if="zhoubianData2 && zhoubianData2.length>0">
        <strong>周边{{tag2}}</strong>
      </div>
      <div class="clear"></div>
      <div class="list_xc">
        <div class="s-result_item" v-for="(i,idx) in zhoubianData2">
          <!-- 点击详情 -->
          <div class="s_result_item-info" @click="searchInfo(i)">
            <div>{{i.attributes.NAME}}</div>
            <div v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
            <div v-if="i.attributes.juli">距离：{{i.attributes.juli}}km</div>
            <div v-if="i.attributes.DEFINING_TAG" class="item-tag-list">
              <span v-for="ii in (i.attributes.DEFINING_TAG).split(',')" class="item-tag">{{ii}}</span>
            </div>
          </div>
          <!-- 导航 -->
          <!-- 暂时隐藏 -->
          <div class="s_result_item-icon" v-show="false">
            <img src="@/images/i-daohang.png" @click="openLocation(i.attributes.CENTERX,i.attributes.CENTERY,i.attributes.NAME,i.attributes.ADDRESS,'')" alt="">
          </div>
        </div>
      </div>
      <div class="clear"></div>
		<div class="rt_tit mart" v-if="(zhoubianData && zhoubianData.length>0) || (zhoubianData2 && zhoubianData2.length>0)">
      <!-- 暂时隐藏 -->
			<a class="more" @click="$emit('zhoubian')" v-show="false">更多周边&gt;</a>
		</div>
      <div class="clear h20"></div>

    </div>

    <div class="clear ctbg2" style="height: 12px;" v-if="zhoubianData2 && zhoubianData2.length>0"></div>

  </div>
</template>

<script>
  import Swiper from 'swiper';
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import {Previewer} from 'vux';
  export default {
    props: ['conData','view','map','fields','detail'],
    components:{
      Previewer
    },
    data: function () {
      return {
        content: {
          id: 0
        },
        tag1:'餐饮',
        tag2:'景点',
        fcodeData:[],
        zhoubianData:[],
        zhoubianData2:[],
        yinxiang:[]
      }
    },
    computed: {
      topImg(){
        let imgurl = '';///images/jplx_top_pc01.jpg
        if (this.content.imgList && this.content.imgList.length) {
          console.log(123123);
          this.content.imgList.forEach(function (img) {
          	if(!img.hidetop){
              const i = img;
              imgurl = i.ServerUrl + '/' + (i.Location ||  i.SmallLocation) + '/' + i.Name;
              return imgurl;
          	}
          });
        }
        return imgurl;
      },
      infoKeyVal(){
        let arr = [];
        if(this.detail && this.fields){
          let fields = this.fields;
          let details = this.detail.split(',');
          const info = this.content;
          details.forEach(function (item) {
            for(let key in info){
              if(item==key){
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
            }
          })
        }
        return arr;
      }
    },
    methods: {
      async init(){
        const self = this;

        //周边查询
        self.queryZhoubian();

        //印象标签
        const res = await Util.ajax.post('/fapi/needlogin/yinxiang/guidcode?guid='+this.content.FEATUREGUID);
        if(res.data && res.data.length){
          this.yinxiang.forEach(function (y) {
            res.data.forEach(function (item) {
              if(y.name==item.yinxiang){
                y.value = item.count
              }
            });
          });
        }
        //用户的
        const response = await Util.ajax.post('/fapi/needlogin/yinxiang/codelist?guid='+this.content.FEATUREGUID);
        if(response.data && response.data.length){
          this.yinxiang.forEach(function (y) {
            response.data.forEach(function (item) {
              if(y.name==item.yinxiang){
                self.$set(y,'id',item.id);
              }
            });
          });
        }
      },
      //周边详细点击
      searchInfo(i){
        //console.log(i);
        this.$emit('searchInfo',i);
      },
      //周边查询
      queryZhoubian(){
        const self = this;
        esriLoader.loadModules([
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/geometry/Polyline",
          "esri/geometry/geometryEngine",
          'esri/geometry/Circle',
          'esri/geometry/Point'
        ]).then(([QueryTask,Query,Polyline,geometryEngine,Circle,Point]) => {
          var poiurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0";
          var layerurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/3";
          var layerurl2 = "https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/4";
			var prefix = '';
          if(self.content.option){
          	if(self.content.zhoubianurl1){
          		layerurl = self.content.zhoubianurl1
            }
            if(self.content.zhoubianname1){
              self.tag1 = self.content.zhoubianname1
            }
            if(self.content.zhoubianurl2){
              layerurl2 = self.content.zhoubianurl2
            }
            if(self.content.zhoubianname2){
              self.tag2 = self.content.zhoubianname2
            }
          }
          var queryTask = new QueryTask({
            url: layerurl
          });
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.start = 0;//开始
          query.num = 2;//多少
          //2公里
          var geo = new Circle({
            "center":new Point({
              "x" : self.content.CENTERX,
              "y" : self.content.CENTERY,
              "spatialReference" : self.map.spatialReference
            }),
            "radius": 2000
          });
          query.geometry = geo;

          query.where = " TAG LIKE '%"+self.tag1+"%' AND NAME IS NOT NULL AND NAME!='"+(self.content.name || self.content.NAME)+"' AND FEATUREGUID!='"+self.content.featureguid+"'";
          // When resolved, returns features and graphics that satisfy the query.
          query.orderByFields = ["HOTSPOT DESC"];
          queryTask.execute(query).then(function(results){
            //console.log(results);
            if(results.features && results.features.length){
              results.features.forEach(function (poi) {
                var arr;
                //距离
                if(poi.attributes.CENTERX && poi.attributes.CENTERY){
                  arr = [poi.attributes.CENTERX,poi.attributes.CENTERY]
                }else{
                  poi.attributes.CENTERX = poi.geometry.x;
                  poi.attributes.CENTERY = poi.geometry.y;
                  arr = [poi.geometry.x,poi.geometry.y]
                }
                var po = new Polyline({
                  paths: [[self.content.CENTERX,self.content.CENTERY],arr],
                  spatialReference: {
                    wkid: 4326
                  }
                });
                self.$set(poi.attributes,'juli',(geometryEngine.geodesicLength(po, "meters")/1000).toFixed(2));
              })
              self.$set(self.$data,'zhoubianData',results.features);
            }
          });
          var queryTask2 = new QueryTask({
            url: layerurl2
          });
          if(layerurl2=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/4'){
			  prefix = 'tdt.DBO.观光旅游_ZT.'
		  }
			query.where = prefix+"TAG LIKE '%"+self.tag2+"%' AND "+prefix+"NAME IS NOT NULL AND "+prefix+"NAME!='"+(self.content.name || self.content.NAME)+"' AND "+prefix+"FEATUREGUID!='"+self.content.featureguid+"'";
			// When resolved, returns features and graphics that satisfy the query.
			query.orderByFields = [prefix+"HOTSPOT DESC"];
          queryTask2.execute(query).then(function(results){
            if(results.features && results.features.length){
              results.features.forEach(function (poi) {
                var arr;
				  poi.attributes = JSON.parse(JSON.stringify(poi.attributes).replace(/tdt\.DBO\..*?\./gi,''));
                //距离
                if(poi.attributes.CENTERX && poi.attributes.CENTERY){
                  arr = [poi.attributes.CENTERX,poi.attributes.CENTERY]
                }else{
                  poi.attributes.CENTERX = poi.geometry.x;
                  poi.attributes.CENTERY = poi.geometry.y;
                  arr = [poi.geometry.x,poi.geometry.y]
                }
                var po = new Polyline({
                  paths: [[self.content.CENTERX,self.content.CENTERY],arr],
                  spatialReference: {
                    wkid: 4326
                  }
                });
                self.$set(poi.attributes,'juli',(geometryEngine.geodesicLength(po, "meters")/1000).toFixed(2));
              })
              self.$set(self.$data,'zhoubianData2',results.features);
            }
          });
        });
      },
      updateYinxiang(i,idx){
        const self = this;
        self.$vux.loading.show();
        if(i.id){
          Util.ajax.post('/fapi/needlogin/yinxiang/delCode?id='+i.id).then(function (res) {
            self.$vux.loading.hide();
            if(res.data.code==100){
              i.id = null;
              i.value=i.value-1;
            }else{
              self.$vux.alert.show(res.data.msg);
            }
          });
        }else{
          let obj = {
            yinxiang:i.name,
            guid:this.content.FEATUREGUID
          };
          Util.ajax.post('/fapi/needlogin/yinxiang/addCode',obj).then(function (res) {
            self.$vux.loading.hide();
            if(res.data.id){
              i.id = res.data.id;
              i.value+=1;
            }else{
              self.$vux.alert.show(res.data.msg);
            }
          });
        }
      },
      previewImage(url, idx){
        this.$refs.previewer.show(idx);
      	/*const wx = this.$wechat;
        wx.ready(function(){
        	//alert(url);
          wx.previewImage({
            current: encodeURI(url), // 当前显示图片的http链接
            //urls: (list && list.length > 0) ? list : [url] // 需要预览的图片http链接列表
          })
        });*/
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
            scale:18,
            infoUrl: url // 在查看位置界面底部显示的超链接,可点击跳转
          });
        })
      },
      goback(){
        this.$emit('closePop');
      }
    },
    //加载完成
    mounted(){
      const self = this;
      if (this.conData) {
        if(this.conData.imgList){
          this.conData.imgList.forEach(function (item) {
            item.src = item.ServerUrl+'/'+(item.Location || item.SmallLocation)+'/'+item.Name;
            item.src2 = item.ServerUrl+'/'+(item.SmallLocation || item.Location)+'/'+item.Name;
          });
        }
        this.$set(this.$data, 'content', this.conData);
        if(this.content.option && this.content.option.yinxiang){
          this.content.option.yinxiang.split(',').forEach(function (item) {
            self.yinxiang.push({
              name:item,
              value:0
            })
          });
        }
      }

      this.$nextTick(function () {
        var swiper = new Swiper('.swiper-container',{
          autoplay: 3000,
          slidesPerView: 2,
          spaceBetween: 0
        });
      });

      console.log(this.content);
      /*var state = {
        title: "",
        url: location.href
      };
      window.history.pushState(state, "", location.href);*/

      window.addEventListener("popstate", function(e){
        pushHistory();
      }, false);
      function pushHistory() {
        self.goback();
      }
      this.init();
    }
  }
</script>
