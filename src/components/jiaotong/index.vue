<style lang="less" scoped>
  @import "index.less";
</style>

<template>
  <div class="jiaotong-idx">
    <div class="top-tab">
      <div :class="topidx==0?'on':''" @click="topidx=0">公交</div>
      <div :class="topidx==1?'on':''"  @click="topidx=1">市域铁路</div>
    </div>
    <template v-if="topidx==0">
      <!-- 查询 -->
      <div class="tmap-search2" style="margin-top:0;">
        <div style="width:30px;">
          <img src="@/img/search_icon.png" style="display: block;margin-top: 6px;margin-left: 8px;" >
        </div>
        <div class="tmap-search-wrap" style="display: flex;flex:1;">
          <!-- 搜索 -->
          <div class="tmap-search-input">
            <!-- @keyup.enter="searchkey" -->
            <input id="searchKey" type="text" ref="searchInput" placeholder="请输入公交线路/站点名称" v-model="key">
            <img src="@/images/clear.png" v-if="key.length" @click="()=>{
            key='';
            $refs.searchInput.focus();
          }" class="clearimg" style="" alt="">
          </div>
        </div>
        <!-- 搜索按钮 -->
        <div @click="()=>{}" class="search-btn" >搜索</div>
      </div>
      <!--<div class="header2_right">
        <div class="header_search">
          <div class="man">
            <input type="text" v-model="key" class="text" @keyup.enter="searchkey" placeholder="请输入公交线路/站点名称">
            <input class="btn" value="" @click="searchkey">
          </div>
        </div>
      </div>-->
      <!-- 最近的3个站点 -->
      <div class="ctbg2">
        <div class="map_tit" style="padding:10px;">
          <img src="@/img/ico_map_tit.png" style="vertical-align: text-bottom"/>
          距您最近的站点：<!--<a v-for="(i,idx) in zuijinData" v-if="idx<3" @click="key=i.attributes.NAME"
                       style="text-decoration:underline;margin-right:8px;" class="zuijin">{{i.attributes.NAME}}</a>-->
        </div>
      </div>
      <!-- 查询结果 -->
      <div class="result-list">
        <div v-for="(i,idx) in result" class="result-item">
          <!-- 线路 -->
          <div v-if="i.linename">
            <!-- 线路详细 -->
            <div v-if="xianlu.rtndt && xianlu.rtndt[0].lineid==i.lineid" style="
              position: fixed;
              z-index: 999;
              background: #fff;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              padding: 10px;
              box-sizing: border-box;
              overflow: auto;">
              <div class="item-xiangxi">
                <div @click="qingchu(i)">{{i.linename}}</div>
                <div style="flex:1;">
                  <div>{{xianlu.rtnstationdt[0].stationname}} - {{xianlu.rtnstationdt[xianlu.rtnstationdt.length-1].stationname}}</div>
                  <div>首班{{(i.downstart==xianlu.rtnstationdt[0].stationname)?i.downtime1:i.uptime1}}&nbsp;&nbsp;
                    末班{{(i.downend==xianlu.rtnstationdt[xianlu.rtnstationdt.length-1].stationname)?i.downtime2:i.uptime2}}</div>
                </div>
                <!-- 切换 -->
                <div>
                  <img @click="qiehuan(i)" src="@/img/qiehuan.png" alt="">
                </div>
              </div>
              <flow orientation="vertical"
                    :style="{'height':(xianlu.rtnstationdt.length*36)+'px'}" style="font-size: 14px;">
                <template v-for="(i2,idx2) in xianlu.rtnstationdt">
                  <!-- is-done -->
                  <flow-state :state="idx2==0?('起'):((idx2+1)==xianlu.rtnstationdt.length?'终':(idx2+1))"
                              :is-done="i2.state?true:false">
                    <div slot="title" style="width:100%">
                      <span style="margin-right:10px;">{{i2.stationname}}</span>
                      <img src="@/images/bus.png" v-if="i2.state==1" alt="" style="vertical-align: text-bottom;display:inline-block;">
                      <img src="@/images/busin.png" v-if="i2.state==2" alt="" style="vertical-align: text-bottom;display:inline-block;">
                    </div>
                  </flow-state>
                  <flow-line is-done v-if="(idx2+1)<xianlu.rtnstationdt.length"></flow-line>
                </template>
              </flow>
              <!-- 说明固定底部 -->
              <div style="height:100px"></div>
              <div style="display:flex;position: fixed;bottom:40px;left:0;width:100%;background:#eee;height:40px;line-height:40px;z-index:999;">
                <div style="flex:1;text-align:center;" ><img src="@/images/bus.png" alt="" style="vertical-align: text-bottom;margin-left:5px;">开往</div>
                <div style="flex:1;text-align:center;" ><img src="@/images/busin.png" alt="" style="vertical-align: text-bottom;margin-left:5px;">到站</div>
              </div>
              <!-- 返回按钮 -->
              <div class="return-btn" @click="qingchu(i)">返回列表页</div>
            </div>
            <!-- 线路简 -->
            <div @click="xianluXiangxi(i,idx)" v-else>
              <div class="item-tit">{{i.linename}}</div>
              <div class="item-info">
                <div>
                  <div>开往:<span class="on">{{i.downend}}</span></div>
                  <div><span class="shou">首</span>{{i.downtime1}} <span class="mo">末</span>{{i.downtime2}}</div>
                </div>
                <div class="mt10">
                  <div>开往:<span class="on">{{i.upend}}</span></div>
                  <div><span class="shou">首</span>{{i.uptime1}} <span class="mo">末</span>{{i.uptime2}}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 站点 -->
          <div v-else >
            <!-- @click="searchZhan(i.lineinfo)" -->
            <div class="item-tit">{{i.stationname}}</div>
            <div class="item-info2">
              <template v-if="i.lineinfo">
                <span v-for="i2 in i.lineinfo.split(',')" v-if="!/.*\?/.test(i2)" @click="searchZhan2(i2)">{{/.*\?/.test(i2)?'':i2}}</span>
              </template>
            </div>
          </div>
          <!--  -->
        </div>
      </div>
    </template>
    <template v-else>
      <div class="result-list">
        <div class="result-item" @click="shiyutielu('S1')">
          <div class="item-tit">市域铁路S1线</div>
          <!--<div class="item-info2"></div>-->
        </div>
        <div class="result-item" @click="shiyutielu('S2')">
          <div class="item-tit">市域铁路S2线</div>
          <!--<div class="item-info2"></div>-->
        </div>
      </div>
    </template>

  </div>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import {dojoConfig,ESRI_URL} from '@/components/libs/tianditu/config';
  import { Flow, FlowState, FlowLine } from 'vux'
  export default {
    components: {
    	Flow, FlowState, FlowLine
    },
    data(){
      return{
      	key:"",
        topidx:0,
      	url:"/fapi/public/jiaotong/",
        xianluData:[],
        zhandianData:[],
        result:[],
        zuijinData:[],//最近的3个
        autoUpdate:null,
        historyData:[],//历史数据
        xianlu:{}//线路详细
      }
    },
    watch:{
    	key(val,oldVal){
    		if(val){
    			let state = false;
    			if(/.*?\|/.test(val)){
    				state = true;
          }
    			this.searchkey(state);
        }else{
          this.$set(this.$data,'result',this.zuijinData);
        }
      }
    },
    methods: {
    	shiyutielu(name){
    		if(name=='S2'){
          //location.href = 'http://tdt.wzmap.gov.cn/#/mzmap?mid=78';
    			this.$router.push({name:'mzmap',query:{mid:'78'}});
        }else if(name=='S1'){
          this.$router.push({name:'mzmap',query:{mid:'65'}});
    			//location.href = 'http://tdt.wzmap.gov.cn/#/mzmap?mid=65';
          //this.$router.push({name:'smap',query:{line:'S2'}})
        }
      },
    	async init(){
    		try {
          await esriLoader.loadScript({ // 加载js
            url: "http://" + ESRI_URL + '/init.js',
            dojoConfig: dojoConfig
          });
        }catch (e){
    			console.log(e);
        }

    		const self = this;
    		self.$vux.loading.show('加载中');
    		const xianluData = await Util.ajax.post(self.url+'xianlu');
    		self.xianluData = xianluData.data.rtndt;
    		const zhandianDaa = await Util.ajax.post(self.url+'zhandian');
        self.zhandianDaa = zhandianDaa.data.rtndt;
        self.$vux.loading.hide();

        //最近的3个站点
        const wx = self.$wechat;
        wx.ready(function(){
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              esriLoader.loadModules([
                'esri/tasks/support/Query',
                'esri/tasks/QueryTask',
                'esri/geometry/Circle',
                'esri/geometry/Point',
                "esri/geometry/Polyline",
                "esri/geometry/geometryEngine"
              ]).then(([Query,QueryTask,Circle,Point,Polyline,geometryEngine]) => {
                var queryTask = new QueryTask({
                  url: "https://services.wzmap.gov.cn/server/rest/services/JIOATONG/GONGJIAOZD/MapServer/0"
                });
                var query = new Query();
                query.returnGeometry = true;
                query.outFields = ["*"];
                //query.start = 0;//开始
                //query.num = 1;//多少
                query.geometry = new Circle(new Point({
                  "x" : lng,
                  "y" : lat,
                  "spatialReference" : {
                    wkid: 4326
                  }
                }), { "radius": 1000 });
                queryTask.execute(query).then(function(results){
                  //console.log(results.features);
                  if(results.features.length>0){
                    results.features.forEach(function(poi){
                    	try{
                    		if(/.*?(上行|下行).*/.test(poi.attributes.NAME)){
                          self.$set(poi.attributes,'juli',1000);
                        }else{
                          var po = new Polyline({
                            paths: [[lng,lat],[poi.geometry.x,poi.geometry.y]],
                            spatialReference: {
                              wkid: 4326
                            }
                          });
                          self.$set(poi.attributes,'juli',(geometryEngine.geodesicLength(po, "meters")).toFixed(2));
                        }
                      }catch(e){
                    		console.log(e);
                        self.$set(poi.attributes,'juli',1000);
                      }
                    });
                    //距离排序
                    let arr = results.features.sort(function(a,b){
                    	return a.attributes.juli - b.attributes.juli;
                    });
                    self.$set(self.$data,'zuijinData',arr);
                    //
                    //let key = '(';
                    let res = [];
                    arr.forEach(function (item,idx) {
                    	if(idx<3){
                        //key+='|'+item.attributes.NAME;
                        const resArr = self.searchkey2(item.attributes.NAME) || [];
                        //{'stationname':item.attributes.NAME}
                        res = [...res,...resArr];
                    	}
                    });
                    //key+=').*';
                    console.log(res);
                    self.$set(self.$data,'result',res);
                    self.$set(self.$data,'zuijinData',res);
                    //self.key = key.replace('|','');
                  }else{
                  	self.$vux.toast.text('您附近没有公交站点');
                  }
                });
              });

            }
          });
        });

    	},
      //线路详细
      xianluXiangxi(i,idx){
    		const self = this;
    		self.$vux.loading.show();
    		Util.ajax.post(self.url+'xiangxi/'+i.lineid).then(function (response) {
          self.$vux.loading.hide();
          let arr = [];
    			response.data.rtnstationdt.forEach(function (item) {
    				if(item.updown==0){
    					self.$set(item,'state',0);
            	arr.push(item);
            }
          });
    			let data = response.data;
    			self.$set(data,'rtnstationdt',arr);
    			self.$set(data,'updown',0);
          self.$set(self.$data,'xianlu',data);
          if(self.autoUpdate){
          	clearInterval(self.autoUpdate);
          }
          self.shishi(i);
          self.autoUpdate = setInterval(function () {
              self.shishi(i);
          },5000);
        });
      },
      //实时数据
      shishi(i){
        const self = this;
        Util.ajax.post(self.url+'shishi/'+i.lineno1).then(function (response) {
          if(response.data && response.data.rtndt){
          	const data = response.data.rtndt[0].bus;
            self.xianlu.rtnstationdt.forEach(function (item,idx) {
              let found = false
            	data.forEach(function (d) {
                //{fx: "1", zd: "18", zt: "1", dist: "0"}
                if(parseInt(d.zd)==(idx+1) && d.fx==self.xianlu.updown){
              		found=true;
              		item.state = d.zt==1?2:1;
              		return;
                }
              });
              if(!found){
              	item.state=0;
              }
            });
          }
        });
      },
      //清除
      qingchu(i){
      	clearInterval(this.autoUpdate);
      	this.$set(this.$data,'xianlu',{});
      },
      //线路切换
      qiehuan(i){
      	const self = this;
      	if(self.xianlu.updown==0){
          self.xianlu.updown=1;
          self.xianlu.rtnstationdt.sort(function (a,b) {
            return b.sno-a.sno;
          });

        }else{
          self.xianlu.updown=0;
          self.xianlu.rtnstationdt.sort(function (a,b) {
            return a.sno-b.sno;
          });
        }
        self.shishi(i);
      },
      searchZhan(name){
      	clearInterval(this.autoUpdate);
      	if(name){
      		let str = "";
      		name.split(",").forEach(function (n) {
            str = str+"|"+n;
          });
      		this.key = str.replace("|","");
        }
      },
      searchZhan2(name){
        clearInterval(this.autoUpdate);
        if(name){
          //this.key = name;
			this.searchkey(true,name);
        }
      },
      //查询
      searchkey(state,key){
    		if(!this.key && !key){
    			this.$vux.toast.text('请输入关键词查询');
    			return;
        }
        let _key = key || this.key;
    		const self = this;
        let reg = new RegExp(".*?("+_key+")");
    		if(state){
    		  reg = new RegExp("^("+_key+")$");
        }
    		let result = [];
    		this.xianluData.forEach(function (item) {
          if(reg.test(item.linename)){
            result.push(item);
          }
          reg.lastIndex=0;
        });
    		this.zhandianDaa.forEach(function (item) {
          if(reg.test(item.stationname)){
          	result.push(item)
          }
          reg.lastIndex=0;
        });
    		self.$set(self.$data,'result',result);
      },
      //查询
      searchkey2(key){
        if(!key){
          this.$vux.toast.text('请输入关键词查询');
          return;
        }
        const self = this;
        let reg = new RegExp(".*?("+key+")");
        let result = [];
        this.xianluData.forEach(function (item) {
          if(reg.test(item.linename)){
            result.push(item);
          }
          reg.lastIndex=0;
        });
        this.zhandianDaa.forEach(function (item) {
          if(reg.test(item.stationname)){
            result.push(item)
          }
          reg.lastIndex=0;
        })
        return result.length?result:null;
      }
    },
    async mounted(){
      //
      const self = this;
      const wx = this.$wechat;
      const response = await Util.checkLog();
      if(response.data.code!=100){
        Util.login();
      }
      if(!Util.isIOS()){
        Util.ajax.post("/pubApi/auth/jsapk?url=" + encodeURIComponent(location.href)).then(function (data) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: Util.wxconfig.appid, // 必填，公众号的唯一标识
            timestamp: data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
            signature: data.data.signature,// 必填，签名
            jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
          });
        });
      }
      //
      this.init();
    }
  }
</script>
