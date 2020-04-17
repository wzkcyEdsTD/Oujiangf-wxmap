<style scoped lang="less">
  @import "index.less";
</style>
<template>

  <div id="jiaoyuListView">
    <!--头部开始-->
    <div class="top_chome">
      <div class="ihome" @click="$router.push({name:'jiaoyu'})"></div>
      <div class="icloes" @click="goback"></div>
    </div>
    <!--头部-->
    <div class="xczt_banner">
      <img :src="topImg" v-if="topImg" class="ims">
      <div v-else style="height:50px;"></div>
    </div>
    <div class="main">
      <div class="rt_tit">
        <span class="fl">
          <b>{{content.NAME}}</b>
          <div class="tit"><template v-if="content.juli">距您：{{content.juli}}KM</template>    <template v-if="content.ADDRESS">地址：{{content.ADDRESS}}</template></div>
        </span>
        <div class="bt_mp" @click="goback">进入地图</div>
      </div>
      <div class="clear"></div>
      <div class="map_mu" v-if="content.DEFINING_TAG">
        <a v-for="i in content.DEFINING_TAG.split(',')">{{i}}</a>
      </div>
      <div class="clear h20"></div>
      <div class="map_btn">
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
        <div class="rt_tit mart">
          <strong>基本信息</strong>
        </div>
		  <div class="wz" v-if="content.option" style="padding-left:10px;">
			  <template v-for="i in content.option.zhanshi.split('、')">
				  <template v-if="content[i.replace(/(\(|（).*/,'')] && i.replace(/(\(|（).*/,'')!='SUMMARY'">
					  <template v-if="i.replace(/(\(|（).*/,'')=='PHONE'"><a class="on" style="text-decoration: underline;" :href="'tel:'+content[i.replace(/(\(|（).*/,'')]">{{i.replace(/.*?(\(|（)/,'').replace(/）|\)/,'')}}:{{content[i.replace(/(\(|（).*/,'')]}}</a></template>
					  <template v-else>{{i.replace(/.*?(\(|（)/,'').replace(/）|\)/,'')}}:{{content[i.replace(/(\(|（).*/,'')]}}</template>
					  <br/>
				  </template>
			  </template>
		  </div>
        <div class="wz" v-else style="padding-left:10px;">
          <template v-if="content.PHONE"><a class="on" style="text-decoration: underline;" :href="'tel:'+content.PHONE">电话：{{content.PHONE}}</a><br/></template>
          <template v-if="content.BXXZ">性质：{{content.BXXZ}}<br/></template>
          <template v-if="content.SPECIAL">特色：{{content.SPECIAL}}<br/></template>
          <template v-if="content.HONOR">荣誉：{{content.HONOR}}</template>
        </div>
        <div class="rt_tit mart" v-if="content.imgList && content.imgList.length">
          <strong>图库</strong>
          <a  @click="$emit('guidUpload')" class="pmore">上传图片</a>
        </div>
      </div>
      <!-- 预览 -->
      <previewer ref="previewer" :list="content.imgList"></previewer>
      <div class="swiper-container" id="swiper2" v-if="content.imgList && content.imgList.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide"  v-for="(i,idx) in content.imgList"
               @click="previewImage(i.ServerUrl+'/'+(i.Location || i.SmallLocation)+'/'+i.Name,idx)">
            <div style="height:100px;"
                 :style="{'background':'url(\''+i.ServerUrl+'/'+(i.SmallLocation || i.Location)+'/'+i.Name+'\') no-repeat center 100%','background-size':'100%'}"></div>
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
        <strong>印象评价</strong>
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
    <!-- 距离 -->
    <div class="bg_zydm">
      <img src="@/images/jiaoyu-bg.jpg" class="ims"/>
      <div class="zydm-item">
        <div>{{content.NAME}}</div>
        <div>
          <template v-for="(i,idx) in juli">距离<span>{{i.name}}</span>{{i.value}}KM
            <template v-if="(idx+1)<juli.length">，</template><template v-else>。</template></template>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="main" v-if="content.SJFW">
      <div class="rt_tit mart">
        <strong>施教范围</strong>
      </div>
      <div class="clear" style="height: 11px;"></div>
      <div class="wz">
        <p style="text-indent: 2em;">
          {{content.SJFW}}
        </p>
      </div>
    </div>
    <div class="clear h20"></div>
    <!-- 地图 -->
    <div v-if="xqfw.load && content.xuequfanwei">
      <img :src="'/照片学区/'+content.xuequfanwei.pic" alt="" style="width:100%;">
      <!--<img src="@/img/map_sjfw_pc.jpg" class="ims"/>-->
      <!--<tianditu style="height:180px;" mapid="xqfwmap" ref="xqfwmap" @mapload="mapload"
                layerurl="https://services.wzmap.gov.cn/server/rest/services/Hosted/JYB/VectorTileServer"></tianditu>-->
    </div>
    <!--  -->
    <div class="main">
      <div class="rt_tit mart" v-if="content.XQF">
        <strong>范围内小区</strong>
      </div>
      <div class="clear" style="height: 11px;"></div>
      <div class="wz" v-if="content.XQF">
        {{content.XQF}}
      </div>
      <div class="rt_tit mart" v-if="content.BMXZ">
        <strong>报名须知</strong>
      </div>
      <div class="clear" style="height: 11px;"></div>
      <div class="wz" v-if="content.BMXZ">
        {{content.BMXZ}}
      </div>
      <div class="clear h20" style="border-top: 1px #dcdcdc solid;"></div>
    </div>
    <div class="clear ctbg2" style="height: 12px;" v-if="zhoubianData && zhoubianData.length>0"></div>
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
          <div class="s_result_item-icon">
            <img src="@/images/i-daohang.png" @click="openLocation(i.attributes.CENTERX,i.attributes.CENTERY,i.attributes.NAME,i.attributes.ADDRESS,'')" alt="">
          </div>
        </div>
      </div>
      <div class="clear"></div>
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
          <div class="s_result_item-icon">
            <img src="@/images/i-daohang.png" @click="openLocation(i.attributes.CENTERX,i.attributes.CENTERY,i.attributes.NAME,i.attributes.ADDRESS,'')" alt="">
          </div>
        </div>
      </div>
      <div class="clear"></div>
		<div class="rt_tit mart" v-if="(zhoubianData && zhoubianData.length>0) || (zhoubianData2 && zhoubianData2.length>0)">
			<a class="more" @click="$emit('zhoubian')">更多周边&gt;</a>
		</div>
      <!--<div class="rt_tit mart">
        <strong>周边快查</strong>
        <a class="more">更多&gt;</a>
      </div>
      <div class="clear"></div>
      <ul class="list_zbkc">
        <li>
          <div class="item">停车场</div>
        </li>
        <li>
          <div class="item">图书馆</div>
        </li>
        <li>
          <div class="item">科技馆</div>
        </li>
        <li>
          <div class="item">肯德基</div>
        </li>
        <li>
          <div class="item">餐厅</div>
        </li>
        <li>
          <div class="item">书店</div>
        </li>
        <li>
          <div class="item">宾馆</div>
        </li>
        <li>
          <div class="item">其他</div>
        </li>
      </ul>-->
      <div class="clear h20"></div>

    </div>
    <div class="clear ctbg2" style="height: 12px;" v-if="zhoubianData2 && zhoubianData2.length>0"></div>

  </div>
</template>

<script>
  import Swiper from 'swiper';
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import Tianditu from '@/components/libs/tianditu/main';
  import {Previewer} from 'vux';
  export default {
    props: ['conData','view','map'],
    components: {
      Tianditu,Previewer
    },
    data: function () {
      return {
        content: {
          id: 0
        },
        tag1:'培训机构',
        tag2:'城市书房',
        xqfw:{
        	load:false
        },//学区范围
        juli: [],
        fcodeData:[],
        zhoubianData:[],
        zhoubianData2:[],
        yinxiang:[/*
          {
            name:'装修较新',
            value:0
          },
          {
            name:'课程较快',
            value:0
          },
          {
            name:'环境优雅',
            value:0
          },
          {
            name:'教材较新',
            value:0
          },
          {
            name:'干净整洁',
            value:0
          },
          {
            name:'老师负责',
            value:0
          }
        */],
      }
    },
    computed: {
      topImg(){
        let imgurl = '';
        if (this.content.imgList && this.content.imgList.length) {
          this.content.imgList.forEach(function (img) {
            if(!img.hidetop){
              const i = img;
              imgurl = i.ServerUrl + '/' + (i.Location ||  i.SmallLocation) + '/' + i.Name;
              return;
            }
          });
        }
        return imgurl;
      }
    },
    methods: {
    	mapload(map){
    		const self = this;
        esriLoader.loadModules([
          'esri/tasks/support/Query',
          'esri/tasks/QueryTask',
          'esri/layers/FeatureLayer'
        ]).then(([Query,QueryTask,FeatureLayer]) => {
          var xuequLayer = new FeatureLayer(self.xqfw.url,{
            outFields: ["*"],
            id:'xuequfanwei',
            definitionExpression: "FEAGUID_POING='"+self.content.FEATUREGUID+"'",
          });
          map.add(xuequLayer);
          const view = self.$refs.xqfwmap.$data.view;
          //view.extent = xuequLayer.fullExtent;

          var queryTask = new QueryTask({
            url: self.xqfw.url
          });
          var query = new Query();
          query.returnGeometry = true;
          query.outFields = ["*"];
          query.start = 0;//开始
          query.num = 1;//多少
          query.where = " FEAGUID_POING='"+self.content.FEATUREGUID+"' ";
          queryTask.execute(query).then(function(results){
            console.log(results.features);
            if(results.features.length>0){
              view.extent = results.features[0].geometry.extent;
            }
          });

        });
      },
      async init(){
        const self = this;
        esriLoader.loadModules([
          "esri/geometry/Polyline",
          "esri/geometry/geometryEngine"
        ]).then(([Polyline,geometryEngine]) => {
        	var arr = [
            {
            	name:"温州南站",
              lng:120.58089900000,
              lat:27.96968399950
            },
            {
              name:"温州市行政中心",
              lng:120.69528099200,
              lat:27.99709599500
            },
            {
              name:"五马街",
              lng:120.65716467800,
              lat:28.01660719310
            }
          ]
          arr.forEach(function (item) {
            var po = new Polyline({
              paths: [[item.lng,item.lat],[self.content.CENTERX,self.content.CENTERY]],
              spatialReference: self.map.spatialReference
            });
            //console.log(item);
            self.juli.push({
              name:item.name,
              value:(geometryEngine.geodesicLength(po, "meters")/1000).toFixed(2)
            })
          });
        });

        //学区范围
        let url = "";
        if(new RegExp(".*?中学").test(self.content.TAG)){
          url = "https://services.wzmap.gov.cn/server/rest/services/JIAOYUZY/XUEQUFW/MapServer/1";
        }else if (new RegExp(".*?小学").test(self.content.TAG)){
          url = "https://services.wzmap.gov.cn/server/rest/services/JIAOYUZY/XUEQUFW/MapServer/0";
        }
        if(url){
        	self.xqfw.url = url;
        	self.xqfw.load = true;
        }else{
        	self.xqfw.load = false;
        }

        //周边查询
        self.queryZhoubian();


        //印象标签
        if(this.yinxiang.length==0){
          const r = await Util.ajax.post('/fapi/public/option/fcode?fcode='+this.content.FCODE);
          if(r){
            this.$set(this.content,'option',r.data.fcode);
            this.content.option.yinxiang.split(',').forEach(function (item) {
              self.yinxiang.push({
                name:item,
                value:0
              })
            });
          }
        }
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
            var layerurl = "https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7";
            var layerurl2 = "https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/5";
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
		  	if(layerurl=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
		  		prefix = 'tdt.DBO.教育.';
			}
            query.where = prefix+"TAG LIKE '%"+self.tag1+"%' AND "+prefix+"NAME IS NOT NULL AND "+prefix+"FEATUREGUID!='"+self.content.featureguid+"'";
            // When resolved, returns features and graphics that satisfy the query.
            query.orderByFields = [prefix+"HOTSPOT DESC"];
            queryTask.execute(query).then(function(results){
            	//console.log(results);
              if(results.features && results.features.length){
                results.features.forEach(function (poi) {
					poi.attributes = JSON.parse(JSON.stringify(poi.attributes).replace(/tdt\.DBO\..*?\./gi,''));
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
                });
                self.$set(self.$data,'zhoubianData',results.features);
              }
            });
          var queryTask2 = new QueryTask({
            url: layerurl2
          });
		  if(layerurl2=='https://services.wzmap.gov.cn/server/rest/services/TDT/ZhuanTiSJ/MapServer/7'){
			  prefix = 'tdt.DBO.教育.';
		  }else{
		  	prefix = '';
		  }
		  query.orderByFields = [prefix+"HOTSPOT DESC"];
          query.where = prefix+"TAG LIKE '%"+self.tag2+"%' AND "+prefix+"NAME IS NOT NULL AND "+prefix+"FEATUREGUID!='"+self.content.featureguid+"'";
          queryTask2.execute(query).then(function(results){
            if(results.features && results.features.length){
              results.features.forEach(function (poi) {
				  poi.attributes = JSON.parse(JSON.stringify(poi.attributes).replace(/tdt\.DBO\..*?\./gi,''));
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
      	/*url = 'http://wxsc.izkl.site/upload/20181218/c20c30e432284e9ca20f29b6c947d90c.jpg';
      	this.$wechat.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url] // 需要预览的图片http链接列表
        })*/
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
      if (this.conData) {
      	if(this.conData.imgList){
      		this.conData.imgList.forEach(function (item) {
            item.src = item.ServerUrl+'/'+(item.Location || item.SmallLocation)+'/'+item.Name;
          });
        }
        this.$set(this.$data, 'content', this.conData);
      }
      console.log(this.content);
      /*const cid = this.$route.query.cid;
       if(cid){
       this.content.id = cid;
       this.init();
       }*/
      this.$nextTick(function () {
        var swiper = new Swiper('.swiper-container',{
          autoplay: 3000,
          slidesPerView: 2,
          spaceBetween: 0
        });
      });

      const self = this;
      const wx = this.$wechat;
      wx.ready(function () {
        wx.onMenuShareAppMessage({
          title: self.content.NAME, // 分享标题
          desc: '', // 分享描述
          link: "http://tdt.wzmap.gov.cn/#/jmap?guid="+self.content.FEATUREGUID+"&loadmap=false", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl:self.topImg
        });
        wx.onMenuShareTimeline({
          title: self.content.NAME, // 分享标题
          link: "http://tdt.wzmap.gov.cn/#/jmap?guid="+self.content.FEATUREGUID+"&loadmap=false", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.topImg // 分享图标
        });
      });

      if(this.changeurl){
        var state = {
          title: "",
          url: location.href
        };
        window.history.pushState(state, "", location.href);
        window.addEventListener("popstate", function (e) {
          pushHistory();
        }, false);
        function pushHistory() {
          self.goback();
        }
      }else{
        Util.title(this.conData.NAME);
      }

      this.init();
    }
  }
</script>
