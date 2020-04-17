<style lang="less" scoped>
  @import "../home/home.less";
</style>

<template>
  <div class="t-meizhou">
    <!-- 搜索 -->
    <div class="tmap-search3">
      <div class="searchicon">
        <img src="@/img/search_icon.png">
      </div>
      <div class="tmap-search-wrap" style="display: flex;flex:1;">
        <!-- 搜索 -->
        <div class="tmap-search-input">
          <input id="searchKey" type="text" ref="searchInput" placeholder="请输入关键字" v-model="searchMap.key"
                 @keyup.enter="searchpoi(true, searchMap.url)">
          <img src="@/images/clear.png" v-if="searchMap.key.length" @click="()=>{
            searchMap.key='';
            $refs.searchInput.focus();
          }" class="clearimg" alt="">
        </div>
      </div>
      <!-- 搜索按钮 -->
      <div @click="searchpoi(true, searchMap.url)" class="search-btn" style="background: #26a2ff">搜索</div>
    </div>

    <!--<div class="header2_right" style="position:relative;border-bottom:1px solid #eee;">
      <div class="header_search" style="left:0;width:100%;">
        <div class="man">
          <input type="text" v-model="searchMap.key" class="text" @keyup.enter="searchpoi(true)" placeholder="请输入关键字查询">
          <input class="btn" value="" @click="searchpoi(true)">
        </div>
      </div>
    </div>-->

    <!-- 同组按钮 -->
    <tab v-if="searchMap.tongzuList && searchMap.tongzuList.length>0 && tabLoad" bar-active-color="#26a2ff"
         active-color="#26a2ff">
      <tab-item v-for="i in searchMap.tongzuList" :selected="i.name==searchMap.tag"
                @click.native="changeTagName(i.name),searchpoi(true,i.serviceurl?i.serviceurl:searchMap.url,i.tag,searchMap.tongzuList,i.iszhuanti,i.iszhoubian)"
                style="flex: none;padding: 0 10px;width:auto;min-width: 20%;"
                :style="{'min-width':searchMap.tongzuList.length<5?(100/searchMap.tongzuList.length)+'%':'20%'}">
        {{i.name}}
      </tab-item>
    </tab>
    <!-- 筛选列表 -->
    <div class="shaixuan"
         v-if="false && searchMap.url!='https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/4'">
      <div :class="searchMap.shaixuan.on2?'':'on'" @click="julipaixu">
        <img src="@/img/ico_lm.png" v-if="searchMap.shaixuan.on2">
        <img src="@/img/ico_lm_ov.png" v-else alt="">热门
      </div>
      <div :class="searchMap.shaixuan.on2?'on':''" @click="julipaixu"><img src="@/img/ico_jl.png"
                                                                           v-if="!searchMap.shaixuan.on2">
        <img src="@/img/ico_jl_ov.png" v-else alt="">距离
      </div>
      <!--<template v-if="searchMap.shaixuan.option">
        <template v-for="(i,idx) in searchMap.shaixuan.option">
          <div v-if="i.name=='区域'" :class="searchMap.areaName?'on':''"  @click="searchMap.areaShow=true">
            <img v-if="searchMap.areaName" src="@/img/ico_qy_ov.png" alt=""><img v-else src="@/img/ico_qy.png" alt="">
            <template v-if="searchMap.areaName">{{searchMap.areaName}}</template>
            <template v-else>区域<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
          </div>
          <div v-else-if="i.name=='月份' && searchMap.tongzuList && searchMap.tongzuList.length" :class="searchMap.monthName?'on':''"  @click="searchMap.monthShow=true">
            <img v-if="searchMap.monthName" src="@/img/ico_sj_ov.png" alt=""><img v-else src="@/img/ico_sj.png" alt="">
            <template v-if="searchMap.monthName">{{searchMap.monthName}}</template>
            <template v-else>月份<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
          </div>
          <div v-else-if="i.name=='价格' && searchMap.tag=='农家乐' && searchMap.tongzuList && searchMap.tongzuList.length" :class="searchMap.priceName?'on':''"  @click="searchMap.priceShow=true">
            <template v-if="searchMap.priceName">{{searchMap.priceName}}</template>
            <template v-else>价格<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
          </div>
          <div v-else-if="i.name=='价格' && searchMap.tongzuList && searchMap.tongzuList.length" :class="searchMap.priceName2?'on':''"  @click="searchMap.priceShow2=true">
            <template v-if="searchMap.priceName2">{{searchMap.priceName2}}</template>
            <template v-else>价格<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
          </div>
        </template>
      </template>-->
    </div>
    <!-- 搜索列表 -->
    <div class="tmap-search-result" style="height:calc(100% - 128px);overflow:auto;">
      <template v-for="(i,idx) in searchMap.page.data">
        <!--<template v-if="searchMap.url=='https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/4'">
          <div class="s-result_item" >
             点击详情
            <div class="s_result_item-info" @click="searchInfo(i,true)">
              <div style="line-height:40px;">{{i.attributes.NAME}}</div>
            </div>
            展开
            <div class="s_result_item-icon" @click="showPoiline(i)" style="text-indent:1em;">
              <img src="@/img/arrow_down.png" style="height:6px;width:auto;" alt="">
            </div>
          </div>
          展开列表
          <div class="s-result_item" v-if="i.list && i.show" v-for="(ii,idx2) in i.list" style="min-height:26px;">
            <div class="s_result_item-info" @click="searchInfo(ii,false)">
              <div style="line-height: 26px;color:#666;">{{ii.pname}}</div>
            </div>
            <div class="s_result_item-icon">
              <img src="@/images/icon-map.png" @click="searchInfo(ii,true)" style="width:26px;">
            </div>
          </div>
        </template>-->
        <!-- 点 -->
        <div class="s-result_item" @click="searchInfo(i,true)">
          <!-- 点击详情 -->
          <div class='s_result_item-pic'>
            <img v-if="i.attributes['PHOTONAME']"
                 :src="i.attributes['ServerUrl']+'/'+i.attributes['SMALLLOCATION'] +'/'+i.attributes['PHOTONAME']" alt="">
            <img v-else src="@/images/nopic.jpg" alt="">
          </div>
          <!--           <div class="s_result_item-info" @click="searchInfo(i,false)">
                      <div>{{i.attributes.NAME}}</div>
                      <div v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
                      <div v-if="i.attributes.juli">距您：{{i.attributes.juli}}km</div>
                      <div v-if="i.attributes.DEFINING_TAG && (!/美丽乡村|乡村景点|农业园|农家乐|民宿|土特产|精品线路/.test(searchMap.tag))"
                           class="item-tag-list"> -->
          <!-- v-if="tagidx<3" -->
          <!--               <span v-for="(ii,tagidx) in (i.attributes.DEFINING_TAG).split(',')"  class="item-tag">{{ii}}</span>
                      </div>
                    </div> -->
          <div class="s_result_item-info">
            <div>{{i.attributes.NAME}}</div>
            <div v-if="i.attributes.ADDRESS">地址：{{i.attributes.ADDRESS}}</div>
            <div v-if="i.attributes.juli">距您：{{i.attributes.juli}}km</div>
            <div v-if="i.attributes.TAG && (!/美丽乡村|乡村景点|农业园|农家乐|民宿|土特产|精品线路/.test(searchMap.tag))"
                 class="item-tag-list">
              <!-- v-if="tagidx<3" -->
              <span v-for="(ii,tagidx) in (i.attributes.TAG).split(',')" class="item-tag"
                    style="color: #26a2ff;border-color: #26a2ff;">{{ii}}</span>
            </div>
          </div>
          <!-- 地图 -->
          <div class="s_result_item-icon">
            <img src="@/images/icon-map-blue.png"
                 @click="searchInfo(i,true)" alt="">
          </div>
        </div>
      </template>
      <!-- 更多 -->
      <div class="bottom-btn" style="text-align: center;background: #26a2ff !important;" v-if="searchMap.page.loadmore"
           @click="searchpoi(false,searchMap.url,searchMap.tag,searchMap.tongzuList)">更多
      </div>
      <div style="text-align: center;color:#666;margin-top:10px;" v-else>没有更多了</div>
    </div>

    <!--    &lt;!&ndash; actionsheet &ndash;&gt;
        <actionsheet v-model="areaShow" @on-click-menu="clickArea"
                     :menus="areaData">
        </actionsheet>
        &lt;!&ndash; 类型 &ndash;&gt;
        <actionsheet v-model="typeShow" @on-click-menu="clickType"
                     :menus="typeData">
        </actionsheet>
        &lt;!&ndash; 年份 &ndash;&gt;
        <actionsheet v-model="yearShow" @on-click-menu="clickYear"
                     :menus="yearData">
        </actionsheet>-->

    <!-- 筛选 -->
    <!--<actionsheet v-model="searchMap.areaShow" @on-click-menu="clickArea"
                 :menus="['全部','鹿城区','龙湾区','瓯海区','洞头区','瑞安市','乐清市','永嘉县','平阳县','苍南县','文成县','泰顺县']">
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
                 {'label':'1800以上','value':'PRICE_number>1800'}]">-->
    </actionsheet>
  </div>
</template>

<script>
    let tagName = '';
    import Util from '@/libs/util';
    import {dojoConfig, ESRI_URL} from '@/components/libs/tianditu/config';
    import esriLoader from 'esri-loader';
    import {Actionsheet, Tab, TabItem} from 'vux';
    //import NongyeData from '@/datas/nongye.json';
    import {nongyeConfig} from '@/config/tdt';

    export default {
        components: {
            Actionsheet, Tab, TabItem
        },
        data() {
            return {
                isActived: false,//是否激活
                scrollTop: 0,
                mapLocation: {},
                page: {
                    key: "",
                    nowPage: 1,
                    pageSize: 20,
                    bean: {
                        state: 1,
                        area: "",
                        maptype: "",
                        year: null
                    },
                    sort: ""
                },
                hasNext: true,
                datas: [],
                areaShow: false,
                areaVal: "",
                areaData: [],
                typeShow: false,
                typeData: [],
                typeVal: "",
                yearShow: false,
                yearVal: "",
                searchMap: {
                    count: 0,
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
                    shaixuan: {
                        option: [],//配置
                        on1: true,
                        on2: false,
                        on3: false,
                        on4: false,
                        on5: false,
                        on6: false,
                        list1: [],//区域
                        list2: [],//类型
                        list3: [],//月份
                        list4: []//价格
                    },
                    show: false,//面板显示
                    itemList: [],//几大块
                    tongzuList: [],//同组
                    //筛选相关
                    areaShow: false,
                    areaName: "",
                    monthShow: false,
                    monthName: "",
                    priceShow: false,
                    priceName: "",
                    priceValue: "",
                    priceShow2: false,
                    priceName2: "",
                    priceValue2: ""
                },
                poiline: [],
                tabLoad: false
            }
        },
        methods: {
            changeTagName(name) {
                tagName = name;
            },
            init(list) {
                const self = this;
                //传参数
                //alert(JSON.stringify(self.$route.query));
                if (self.$route.query && self.$route.query.tab) {
                    const tab = JSON.parse(self.$route.query.tab);
                    if (self.$route.query.list) {
                        list = JSON.parse(self.$route.query.list);
                        self.$set(self.searchMap, 'tongzuList', list);
                    }
                    tagName = tab.name; // 初始化tagname值
                    self.searchpoi(true, tab.serviceurl, tab.name, list || []);
                } else if (self.$route.query && self.$route.query.searchkey) {
                    self.searchMap.key = self.$route.query.searchkey;
                    self.searchpoi(true);
                }
            },
            async searchInfo(obj, loadmap) {
                console.log(obj);
                //localStorage.setItem("ncontent",JSON.stringify(obj));
                //this.$router.push({name:"ncontent",query:{url:this.searchMap.url,guid:obj.attributes.FEATUREGUID,juli:obj.attributes.juli}});
                const self = this;
                if (!obj.attributes) {
                    const arr = await esriLoader.loadModules([
                        "esri/tasks/QueryTask",
                        "esri/tasks/support/Query"
                    ]);
                    const QueryTask = arr[0];
                    const Query = arr[1];
                    var querytask = new QueryTask({
                        url: "https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6"
                    });
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                    query.where = "tdt.DBO.农业旅游.FEATUREGUID='" + obj.pguid + "'";
                    let results = await querytask.execute(query);
                    if (results.features) {
                        nongyeConfig.replace(results.features[0]);
                        results.features[0].attributes.CENTERX = results.features[0].geometry.x;
                        results.features[0].attributes.CENTERY = results.features[0].geometry.y;
                        //self.$set(obj,'attributes',results.features[0].attributes);
                        obj = results.features[0]
                    }
                }
                if (!loadmap) {
                    if (obj.attributes.ADDRESS) {
                        this.$vux.loading.show();
                        Util.ajax.post('/pubApi/wzmap/poiimg?guid=' + obj.attributes.FEATUREGUID).then(function (res) {
                            self.$vux.loading.hide();
                            if (res.data && res.data.length) {
                                self.$set(obj.attributes, 'imgList', res.data);
                            }
                            localStorage.setItem('infoItem', JSON.stringify(obj));
                            self.$router.push({
                                name: "nongyeMap",
                                query: {guid: obj.attributes.FEATUREGUID, loadmap: loadmap ? 'true' : 'false'}
                            });
                        });
                    } else {
                        self.$vux.alert.show('没有更多详细了,点击右侧地图图标定位到地图');
                    }
                } else {
                    localStorage.setItem('infoItem', JSON.stringify(obj));
                    self.$router.push({
                        name: "nongyeMap", query: {
                            guid: obj.attributes.FEATUREGUID,
                            loadmap: loadmap ? 'true' : 'false',
                            tagName: tagName
                        }
                    });
                }
            },
            //搜索
            async searchpoi(flush, url, tag, list, iszhuanti, iszhoubian) {
                console.log(flush)
                console.log(url)
                console.log(tag)
                console.log(list)
                if (!this.searchMap.key && !tag && tag != '') {//
                    this.$vux.toast.text('请输入关键词');
                    return;
                }
                const self = this;
                let key = this.searchMap.key;
                this.$set(this.searchMap, 'tempKey', key);

                if (flush) {
                    this.searchMap.page.start = 0;
                    this.searchMap.page.pageNum = 1;
                    this.searchMap.page.data = [];
                    this.searchMap.shaixuan.on2 = false;
                    //地址
                    /*var state = {
                      title: "",
                      url: "/#/nlist?tag="+JSON.stringify(tag)+"&list="+JSON.stringify(list)
                    };
                    window.history.pushState(state, "", "/#/nlist?tag="+JSON.stringify(tag)+"&list="+JSON.stringify(list));*/
                } else {
                    this.searchMap.page.pageNum++;
                    this.searchMap.page.start = this.searchMap.page.start + this.searchMap.page.pageSize;
                }
                self.$vux.loading.show('搜索中');
                const arr = await esriLoader.loadModules([
                    "esri/tasks/QueryTask",
                    "esri/tasks/support/Query",
                    "esri/geometry/Polyline",
                    "esri/geometry/geometryEngine"
                    //'esri/geometry/Circle',
                    //'esri/geometry/Point'
                ]);
                let QueryTask = arr[0];
                let Query = arr[1];
                let Polyline = arr[2];
                let geometryEngine = arr[3];
                /*let Circle = arr[4];
                let Point = arr[5];*/
                var defaulturl = 'https://services.wzmap.gov.cn/server/rest/services/TDT/POI/MapServer/0';
                var layerurl = "https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6";
                var layerurl2 = "https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6";
                var searchIdx = 6;
                var sname = '';
                if (url) {
                    layerurl = url;
                    self.searchMap.url = url;
                } else {
                    self.searchMap.url = '';
                }
                //searchIdx = parseInt(layerurl.replace(/.*\//gi,''));
                //sname = nongyeConfig.nameConfig[searchIdx];
                //var prefix = "tdt.DBO."+sname+".";
                var prefix = '';
                /*if(sname==''){
                  prefix = "";
                }*/
                var queryTask = new QueryTask({
                    url: layerurl
                });
                //const view = self.$refs.map.$data.view;
                var query = new Query();
                query.returnGeometry = true;
                query.outFields = nongyeConfig['*'];//FEATUREGUID,CENTERX,CENTERY,NAME,ADDRESS,TAG
                query.start = self.searchMap.page.start;//开始
                query.num = self.searchMap.page.pageSize;//多少
                query.where = prefix + "NAME LIKE '%" + key + "%' ";//
                /*if(layerurl=='https://services.wzmap.gov.cn/server/rest/services/NONGYELVY/NONGYELV/MapServer/6'){
                  query.where = " NAME LIKE '%"+key+"%' ";//
                }*/
                //标签
                if (tag != self.searchMap.tag) {
                    self.searchMap.areaName = "";
                    self.searchMap.monthName = "";
                    self.searchMap.priceName = "";
                    self.searchMap.priceValue = "";
                    self.searchMap.priceName2 = "";
                    self.searchMap.priceValue2 = "";
                }
                if (tag) {
                    self.searchMap.tag = tag;
                    //面点
                    /*if(!/.*?(8)$/.test(layerurl)){
                      query.where = prefix+"TAG LIKE '%"+tag+"%' AND "+prefix+"NAME is not null ";
                    }else{
                      query.where = prefix+"NAME is not null";
                    }
                    self.searchMap.tag = tag;
                    //条件
                    if(self.searchMap.areaName){
                      query.where+=" AND "+prefix+"AREA='"+self.searchMap.areaName+"' "
                    }
                    if(self.searchMap.monthName){
                      query.where+=" AND "+prefix+"MONTH like '%"+self.searchMap.monthName+"%' "
                    }
                    //tdt.DBO."+sname+".
                    if(self.searchMap.priceValue){
                      query.where+=" AND "+self.searchMap.priceValue.replace(/PRICE_number/gi,'tdt.DBO.'+sname+'.PRICE_number')
                    }*/
                    //筛选
                    let sfound = false;
                    /*NongyeData.forEach(function (shaixuan) {
                      if(new RegExp(".*?"+tag).test(shaixuan.name)){
                        self.$set(self.searchMap.shaixuan,'option',shaixuan.shaixuan);
                        sfound = true;
                      }
                    });*/
                    if (!sfound) {
                        self.$set(self.searchMap.shaixuan, 'option', []);
                    }
                } else {
                    self.searchMap.tag = '';
                    /*if(self.searchMap.areaName){
                      query.where+=" AND "+prefix+"AREA='"+self.searchMap.areaName+"' "
                    }*/
                }
                //同组
                if (list) {
                    self.$set(self.searchMap, 'tongzuList', list)
                } else {
                    if (tag) {
                        Util.ajax.post('/fapi/public/option/zttongzu?name=' + tag).then(function (response) {
                            self.$set(self.searchMap, 'tongzuList', response.data || []);
                        });
                    } else {
                        self.$set(self.searchMap, 'tongzuList', []);
                    }
                }
                //query.orderByFields = [prefix+"HOTSPOT DESC"];
                query.groupByFieldsForStatistics = [prefix + "NAME"];
                // query.where="1=1";
                query.outFields = ['*'];
                query.orderByFields = ['HOTSPOT DESC']; // 地图列表加入热点排序
                if (url === 'https://grcxf.wzcredit.gov.cn/arcgis/rest/services/XYDT/MapServer/1') {
                    query.where = "1=1 and YYQK = '已运营'";
                }
                /*if(sname!='农业旅游'){
                   query.groupByFieldsForStatistics = [ "tdt.DBO."+sname+".NAME" ];
                 }else{
                   query.orderByFields = ['HOTSPOT DESC'];
                 }*/

                // When resolved, returns features and graphics that satisfy the query.
                let results = await queryTask.execute(query);
                //如果农业查不到，从POI中查
                /*if(results.features && results.features.length==0 && layerurl==layerurl2){
                  console.log('poi查询');
                  queryTask.url = defaulturl;
                  results = await queryTask.execute(query);
                }*/
                console.log(results.features);
                if (results.features && results.features.length == self.searchMap.page.pageSize) {
                    self.searchMap.page.loadmore = true;
                } else {
                    self.searchMap.page.loadmore = false;
                }
                flush && self.$set(self.searchMap.page, 'data', []);
                results.features.forEach(function (poi) {
                    nongyeConfig.replace(poi);
                    var arr;
                    //距离
                    if (poi.attributes.CENTERX && poi.attributes.CENTERY) {
                        arr = [poi.attributes.CENTERX, poi.attributes.CENTERY]
                    } else {
                        poi.attributes.CENTERX = poi.geometry.x;
                        poi.attributes.CENTERY = poi.geometry.y;
                        arr = [poi.geometry.x, poi.geometry.y]
                    }
                    try {
                        if (arr[0] && arr[1] && self.mapLocation.lng && self.mapLocation.lat) {
                            var po = new Polyline({
                                paths: [[self.mapLocation.lng, self.mapLocation.lat], arr],
                                spatialReference: {wkid: 4326}
                            });
                            self.$set(poi.attributes, 'juli', (geometryEngine.geodesicLength(po, "meters") / 1000).toFixed(2));
                        }
                    } catch (e) {

                    }
                    self.searchMap.page.data.push(poi);
                    //按距离排
                    if (self.searchMap.shaixuan.on2) {
                        self.searchMap.shaixuan.on2 = false;//距离排序
                        console.log('按距离排序');
                        self.julipaixu();
                    }

                });
                //显示多少条记录
                if (flush) {
                    query.start = null;
                    query.num = null;
                    query.orderByFields = [''];
                    queryTask.executeForCount(query).then(function (results) {
                        console.log(results);
                        self.$set(self.searchMap, 'count', results);
                    });
                }
                self.$vux.loading.hide();
            },
            //导航
            openLocation(lng, lat, name, address, url) {
                if (!lng || !lat) {
                    this.$vux.toast.text('未找到对应的地址');
                    return;
                }
                const wx = this.$wechat;
                const self = this;
                wx.ready(function () {
                    wx.openLocation({
                        latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                        longitude: lng, // 经度，浮点数，范围为180 ~ -180。
                        name: name, // 位置名
                        address: address, // 地址详情说明
                        infoUrl: url // 在查看位置界面底部显示的超链接,可点击跳转
                    });
                })
            },
            //筛选
            /*clickArea(key,item){
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
            },*/
            //距离排序
            julipaixu() {
                if (this.searchMap.shaixuan.on2) {
                    this.searchMap.shaixuan.on2 = false;
                    this.$set(this.searchMap.page, 'data', this.searchMap.tempData);
                } else {
                    this.searchMap.shaixuan.on2 = true;
                    this.$set(this.searchMap, 'tempData', JSON.parse(JSON.stringify(this.searchMap.page.data)));
                    this.searchMap.page.data.sort(function (a, b) {
                        return a.attributes.juli - b.attributes.juli;//距离由近到远
                    })
                }
            },
            //
            dingwei(callback) {
                const self = this;
                const wx = this.$wechat;
                self.$vux.loading.show('定位中');
                wx.ready(function () {
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            self.$set(self.$data, 'mapLocation', {lng, lat});
                            console.log(this.mapLocation);
                            /*if(callback){
                              callback();
                            }*/
                        },
                        complete: function () {
                            self.$vux.loading.hide();
                            if (callback) {
                                callback();
                            }
                        }
                    });
                });
            },
            //
            showPoiline(i) {
                this.$set(i, 'show', !i.show);
                if (!i.list) {
                    this.$set(i, 'list', []);
                    this.poiline.forEach(function (data) {
                        if (data.lguid == i.attributes.FEATUREGUID) {
                            i.list.push(data);
                        }
                    });
                }
            }
        },
        activated() {
            const self = this;
            if (this.$route.meta.needFlush) {
                self.dingwei(function () {
                    self.searchMap.key = '';
                    self.$set(self.searchMap, 'tongzuList', []);
                    self.tabLoad = true;
                    self.init();
                });
            } else {
                document.getElementsByTagName('body')[0].scrollTop = this.scrollTop;
                document.getElementsByTagName('html')[0].scrollTop = this.scrollTop;
            }
        },
        deactivated() {
            this.tabLoad = false;
            this.$set(this.$data, 'scrollTop', document.getElementsByTagName('body')[0].scrollTop
                || document.getElementsByTagName('html')[0].scrollTop);
        },
        async mounted() {
            this.tabLoad = true;
            this.isActived = true;
            const self = this;
            self.$vux.loading.show('加载脚本中');
            try {
                await esriLoader.loadScript({ // 加载js
                    url: "http://" + ESRI_URL + '/init.js',
                    dojoConfig: dojoConfig
                });
            } catch (e) {
                console.log(e);
            }
            self.$vux.loading.hide();


            // this.dingwei(function () {
            self.init();
            // });

            //JSAPK
            if (!Util.isIOS()) {
                const wx = this.$wechat;
                Util.ajax.post("/pubApi/auth/jsapk?url=" + encodeURIComponent(location.href)).then(function (data) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: Util.wxconfig.appid, // 必填，公众号的唯一标识
                        timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                        signature: data.data.signature,// 必填，签名
                        jsApiList: ['getLocation', 'openLocation', 'previewImage'
                            , 'onMenuShareAppMessage', 'onMenuShareTimeline'
                            , 'updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
                    });
                });
            }

            // const tab = 'tab={"serviceurl":"http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/1","tag":"","name":"借阅"}&list=[{"serviceurl":"http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/1","tag":"","name":"借阅"},{"serviceurl":"http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/2","tag":"","name":"停车"},{"serviceurl":"http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/3","tag":"","name":"旅游"}]'
            //面点关系
            /* Util.ajax.post('/fapi/public/nongye/option/poiline').then(function(res){
               self.$set(self.$data,'poiline',res.data || []);
             });*/

        }
    }
</script>
