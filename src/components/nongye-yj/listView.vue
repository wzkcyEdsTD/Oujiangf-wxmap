<style scoped lang="less">
  @import "../jiaoyu/index.less";
  .tourline-item{
    .tourline-circle{
      border:1px solid @theme-color;
      height:18px;
      width:18px;
      border-radius:50%;
      float: left;
      margin: 2px 5px 0 0;
    }
    .tourline-tit{
      color:@theme-color;
      font-size: 14px;
      line-height: 23px;
    }
    .tourline-con{
      padding-left: 18px;
      border-left: 1px solid @theme-color;
      margin-left: 10px;
      color:#666;
      padding-top:10px;
    }
    .tourline-tag{
      overflow:hidden;
      div{
        float: left;
        line-height: 22px;
        text-align: center;
        padding: 0 5px;
        border: 1px solid @theme-color;
        margin-right: 2%;
        color: @theme-color;
        font-size: 10px;
        margin-bottom: 2px;
      }
    }
    .tourline-summary{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    img{width:33%;height:75px;box-sizing: border-box;padding: 0 5px;}
  }
</style>
<template>

  <div id="jiaoyuListView">
    <!--头部开始-->
    <div class="top_chome">
      <div class="ihome" @click="$router.push({name:'nongye'})"></div>
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
        <div class="rt_tit mart" v-if="content.option">
          <strong>基本信息</strong>
        </div>
        <div class="wz" v-if="content.option">
          <!-- PRICE(门票价格)、MONTH（最佳季节）、SUMMARY（简介） -->
          <template v-for="i in content.option.zhanshi.split('、')">
            <template v-if="content[i.replace(/(\(|（).*/,'')] && i.replace(/(\(|（).*/,'')!='SUMMARY'">
              <template v-if="i.replace(/(\(|（).*/,'')=='PHONE'"><a class="on" style="text-decoration: underline;" :href="'tel:'+content[i.replace(/(\(|（).*/,'')]">{{i.replace(/.*?(\(|（)/,'').replace(/）|\)/,'')}}:{{content[i.replace(/(\(|（).*/,'')]}}</a></template>
              <template v-else>{{i.replace(/.*?(\(|（)/,'').replace(/）|\)/,'')}}:{{content[i.replace(/(\(|（).*/,'')]}}</template>
              <br/>
            </template>
          </template>
        </div>
        <div class="rt_tit mart" v-if="content.imgList && content.imgList.length">
          <strong>图库</strong>
          <a  @click="$emit('guidUpload')" class="pmore">上传图片</a>
        </div>
      </div>
      <previewer ref="previewer" :list="content.imgList"></previewer>
      <div class="swiper-container" id="swiper2" v-if="content.imgList && content.imgList.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide"  v-for="(i,idx) in content.imgList"
               @click="previewImage(i.ServerUrl+'/'+(i.Location || i.SmallLocation)+'/'+i.Name,idx)">
            <div style="height:100px;"
                 :style="{'background':'url(\''+i.ServerUrl+'/'+(i.SmallLocation || i.Location)+'/'+i.Name+'\') no-repeat center'
                 ,'background-size':'100%'}"></div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
      <div class="rt_tit mart" v-if="yinxiang">
        <strong>印象标签</strong>
      </div>
      <ul class="yxpj_li" v-if="yinxiang">
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
    <!-- 推荐线路 -->
    <div class="rt_tit mart" v-if="tourline && tourline.length" style="margin:0 10px;margin-bottom:10px;">
      <strong>旅游线路</strong>
    </div>
    <!--  -->
    <div class="tourline-item" v-for="(i,idx) in tourline" style="margin:0 10px;">
      <div class="tourline-tit" @click="tourlineClick(i)">
        <div class="tourline-circle"></div>{{i.attributes.NAME}}<img style="height:auto;width:23px;vertical-align: text-bottom;"
                                                                     src="@/images/xl1.jpg">
      </div>
      <div class="tourline-con" style="overflow: hidden;">
        <div class="tourline-img">
          <img :src="img.ServerUrl+'/'+img.SmallLocation+'/'+img.Name" v-if="imgidx<3" v-for="(img,imgidx) in i.imgList" alt="">
        </div>
        <div class="tourline-tag" v-if="i.attributes.DEFINING_TAG">
          <div v-for="tag in i.attributes.DEFINING_TAG.split(',')">{{tag}}</div>
        </div>
        <div class="tourline-summary" v-if="i.attributes.SUMMARY" :style="{'-webkit-line-clamp':i.show?300:3}">
          {{i.attributes.SUMMARY}}
        </div>
        <div style="float: right;margin: 5px;font-weight: bold;" @click="i.show=true" v-show="!i.show">
          展开<img src="@/images/xl2.jpg" style="height:auto;width:25px;">
        </div>
      </div>
    </div>
    <!--  -->
    <div class="clear h20"></div>
    <!--  -->
    <div class="clear ctbg2" v-if="zhoubianData && zhoubianData.length>0" style="height: 12px;"></div>
    <div class="main">
      <div class="rt_tit mart" v-if="zhoubianData && zhoubianData.length>0">
        <strong>周边{{tag1}}</strong>
        <!--<a class="more" @click="$emit('zhoubian')">更多&gt;</a>-->
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
        <!--<a class="more" @click="$emit('zhoubian')">更多&gt;</a>-->
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
    props: ['conData','view','map'],
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
        juli: [],
        fcodeData:[],
        zhoubianData:[],
        zhoubianData2:[],
        yinxiang:[],
        tourline:[]
      }
    },
    computed: {
      topImg(){
        let imgurl = '';///images/jplx_top_pc01.jpg
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
        /*esriLoader.loadModules([
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

        });*/
      },
      async init(){
        const self = this;

        //周边查询
        self.queryZhoubian();

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

        //旅游线路
        let tourname = this.content.NAME;
        if(tourname=='古韵楠溪游精品路线'){
          tourname = '下日川村';
        }else if(tourname=='耕读文化游精品路线'){
        	tourname = '渔田村';
        }
        Util.ajax.post("/fapi/public/nongye/option/tourline?name="+tourname).then(function (response) {
          if(response.data && response.data.length){
            esriLoader.loadModules([
              "esri/tasks/QueryTask",
              "esri/tasks/support/Query"
            ]).then(([QueryTask,Query]) => {
              var queryTask = new QueryTask({
                url: 'https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6'
              });
              var query = new Query();
              let sqlwhere = " ";
              query.outFields = ["*"];
              response.data.forEach(function (item) {
                sqlwhere+=" OR tdt.DBO.农业旅游.FEATUREGUID='"+item.guid+"' ";
                self.$set(item,'show',false);
              });
              query.where = sqlwhere.replace('OR','');
              queryTask.execute(query).then(function(results){
                console.log(results);
                if(results.features && results.features.length){
                  results.features.forEach(function (item) {
					  item.attributes = JSON.parse(JSON.stringify(item.attributes)
					  .replace(/tdt\.DBO\.农业旅游\./gi,''));
                    response.data.forEach(function (data) {
                      if(item.attributes.FEATUREGUID==data.guid){
                      	self.$set(data,'attributes',item.attributes);
                        Util.ajax.post('/pubApi/wzmap/poiimg?guid='+item.attributes.FEATUREGUID).then(function (res) {
                          if(res.data && res.data.length) {
                            self.$set(data, 'imgList', res.data);
                          }
                        });
                      }
                    });
                  });
                  console.log(response.data);
                  self.$set(self.$data,'tourline',response.data || [])
                }
              });
            });
          }
        });
      },
      //周边详细点击
      searchInfo(i){
        //console.log(i);
        this.$emit('searchInfo',i);
      },
      //周边查询
      async queryZhoubian(){
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
            //3公里
            var geo = new Circle({
            	"center":new Point({
                "x" : self.content.CENTERX,
                "y" : self.content.CENTERY,
                "spatialReference" : self.map.spatialReference
              }),
              "radius": 2000
            });
            query.geometry = geo;

            query.where = " TAG LIKE '%"+self.tag1+"%' AND NAME IS NOT NULL AND FEATUREGUID!='"+self.content.featureguid+"'";
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
          query.where = "TAG LIKE '%"+self.tag2+"%' AND NAME IS NOT NULL AND FEATUREGUID!='"+self.content.featureguid+"'";
          queryTask2.execute(query).then(function(results){
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
      previewImage(url,idx){
        this.$refs.previewer.show(idx);
      	/*this.$wechat.previewImage({
          current: url, // 当前显示图片的http链接
          urls: (list && list.length > 0) ? list : [url] // 需要预览的图片http链接列表
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
      },
      tourlineClick(obj){
        //localStorage.setItem('infoItem',JSON.stringify(obj));
        console.log(obj);
        this.$emit('guidFound',obj);
        this.$router.push({name:"nongyeMap",query:{guid:obj.attributes.FEATUREGUID,loadmap:'true'}});
      }
    },
    //加载完成
    mounted(){
      const self = this;
      if (this.conData) {
        if(this.conData.imgList){
          this.conData.imgList.forEach(function (item) {
            item.src = item.ServerUrl+'/'+(item.Location || item.SmallLocation)+'/'+item.Name;
          });
        }
        this.$set(this.$data, 'content', this.conData);
        if(this.conData.option && this.conData.option.yinxiang){
          this.content.option.yinxiang.split(',').forEach(function (item) {
            self.yinxiang.push({
              name:item,
              value:0
            })
          });
        }
      }

      const wx = this.$wechat;
      wx.ready(function () {
        wx.onMenuShareAppMessage({
          title: self.content.NAME, // 分享标题
          desc: '', // 分享描述
          link: "http://tdt.wzmap.gov.cn/#/nmap?guid="+self.content.FEATUREGUID+"&loadmap=false", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl:self.topImg
        });
        wx.onMenuShareTimeline({
          title: self.content.NAME, // 分享标题
          link: "http://tdt.wzmap.gov.cn/#/nmap?guid="+self.content.FEATUREGUID+"&loadmap=false", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.topImg // 分享图标
        });
      });

      this.$nextTick(function () {
        var swiper = new Swiper('.swiper-container',{
          autoplay: 3000,
          slidesPerView: 2,
          spaceBetween: 0
        });
      });

      //
      //console.log(this.content);
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

      //
      this.init();
    }
  }
</script>
