<style lang="less" scoped>
  .t-meizhou{
    background: #f3f3f3;
    height: 100%;
    overflow:auto;
    box-sizing: border-box;
    padding-top:77px;/*94px*/
    -webkit-overflow-scrolling:touch;
  }
</style>

<template>
  <div class="t-meizhou">
    <!-- 搜索 -->
    <div class="header2_right" style="position:fixed;top:0;z-index:1;">
		<div class="tmap-search3" >
			<div class="searchicon">
				<img src="@/img/search_icon.png">
			</div>
			<div class="tmap-search-wrap" style="display: flex;flex:1;">
				<!-- 搜索 -->
				<div class="tmap-search-input">
					<input id="searchKey" type="text" ref="searchInput" placeholder="请输入关键字"
						   v-model="page.key" @keyup.enter="searchkey" >
					<img src="@/images/clear.png" v-if="searchkey.length"
						 @click="()=>{searchMap.key='';$refs.searchInput.focus();}" class="clearimg" >
				</div>
			</div>
			<!-- 搜索按钮 -->
			<div @click="searchkey" class="search-btn" >搜索</div>
		</div>
    </div>

    <!-- 筛选列表 -->
    <div class="shaixuan" style="position: fixed;width:100%;top:34px;z-index: 1;background: #f3f3f3;">
      <div :class="page.bean.year?'on':''" @click="yearShow=true">
        <img v-if="page.bean.year" src="@/img/ico_sj_ov.png" alt=""><img v-else src="@/img/ico_sj.png" alt="">
        <template v-if="page.bean.year">{{page.bean.year}}</template>
        <template v-else>时间<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
      </div>
      <div :class="page.sort?'on':''" @click="sortClick">
       <img v-if="page.sort" src="@/img/ico_lm_ov.png" alt=""><img v-else src="@/img/ico_lm.png" alt="">热门</div>
      <div :class="page.bean.maptype?'on':''" @click="typeShow=true">
        <img v-if="typeVal" src="@/img/ico_lx_ov.png" alt="">
        <img v-else src="@/img/ico_lx.png" alt="">
        <template v-if="typeVal">{{typeVal}}</template>
        <template v-else>类别<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
      </div>
    </div>
    <!-- 搜索列表 -->
    <div class="tmap-search-result" style="overflow:auto;background: #fff;-webkit-overflow-scrolling: touch;">
      <div class="s-result_item" v-for="(i,idx) in datas" style="align-items: center;">
        <!-- 图片 -->
        <div v-if="i.pic" @click="detail(i)"><img :src="i.pic" width="80" style="margin-left:10px;"></div>
        <!--<div v-else @click="detail(i)"><img src="@/images/no-pic2.jpg" width="80" style="margin-left:10px;"></div>-->
        <!-- 点击详情 -->
        <div class="s_result_item-info" @click="detail(i)">
          <div>{{i.title}}</div>
          <div v-if="i.summary" style="font-size:10px;color:#666;">{{i.summary}}</div>
          <div style="font-size: 12px;">时间：{{i.showtime|dateFormat}}<br/>阅读量：{{i.reading}}</div>
          <div v-if="i.tag" class="item-tag-list">
            <span v-for="ii in (i.tag).split('；')" class="item-tag">{{ii}}</span>
          </div>
        </div>
        <!-- 导航 -->
        <div class="s_result_item-icon" >
          <img src="@/images/icon-map.png" @click="ditu(i)" style="width: 40px;" alt="">
        </div>
      </div>
    </div>


    <!-- 加载更多 -->
    <div v-if="hasNext" class="bottom-btn mt10" @click="loadMore">加载更多</div>
    <div v-else style="text-align:center;margin-top:10px;color:#666;">没有更多了~</div>

    <!-- actionsheet -->
    <actionsheet v-model="areaShow" @on-click-menu="clickArea"
                 :menus="areaData">
    </actionsheet>
    <!-- 类型 -->
    <actionsheet v-model="typeShow" @on-click-menu="clickType"
                 :menus="typeData">
    </actionsheet>
    <!-- 年份 -->
    <actionsheet v-model="yearShow" @on-click-menu="clickYear"
                 :menus="yearData">
    </actionsheet>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import {Actionsheet} from 'vux';
  export default {
    components:{
      Actionsheet
    },
    data(){
    	return {
        page:{
          key:"",
          nowPage:1,
          pageSize:20,
          bean:{
            state:1,
            area:"DT",
            maptype:"",
            year:null
          },
          sort:""
        },
        hasNext:true,
        datas:[],
        areaShow:false,
        areaVal:"",
        areaData:[],
        typeShow:false,
        typeData:[],
        typeVal:"",
        yearShow:false,
        yearVal:""
      }
    },
    computed:{
      yearData(){
      	let year = new Date().getFullYear();
      	let arr = ['全部'];
      	for(let i=0;i<5;i++){
      		arr.push(year-i);
        }
        return arr;
      }
    },
    methods:{
    	init(){
    		const self = this;
        self.$vux.loading.show();
    		Util.ajax.post('/fapi/public/meizhou/list',this.page).then(function (response) {
          self.$vux.loading.hide();
          const list = response.data.datas;
          if(list && list.length>0){
            list.forEach(function (item) {
              self.datas.push(item);
            });
            self.checkNext();
          }else{
            self.hasNext = false;
          }
        });
      },
      detail(i){
    		//更新阅读量
        Util.ajax.post('/fapi/public/meizhou/read/'+i.id).then(function (response) {});
        if(i.link){
        	location.href = i.link.replace(/#.*/,'&scene=4#wechat_redirect');
        }else{
          this.$router.push({name:'mcontent',query:{id:i.id}});
        }
      },
      ditu(i){
        this.$router.push({name:'mzmap-dt',query:{mid:i.id,title:i.title,mlevel:i.mlevel,lng:i.lng,lat:i.lat}});
      },
      clickArea(key,item){
        if(item.label=='全部'){
          this.areaVal = '';
        }else{
          this.areaVal = item.label;
        }
        this.page.nowPage = 1;
        this.datas = [];
        this.page.bean.area = key;
        this.init();
      },
      clickType(key,item){
        if(item.label=='全部'){
          this.typeVal = '';
        }else{
          this.typeVal = item.label;
        }
        this.page.nowPage = 1;
        this.datas = [];
        this.page.bean.maptype = key;
        this.init();
      },
      clickYear(key,item){
        if(item=='全部'){
          this.page.bean.year = '';
        }else{
          this.page.bean.year = item;
        }
        this.page.nowPage = 1;
        this.datas = [];
        this.init();
      },
      sortClick(){
        this.page.sort=(this.page.sort=='reading'?'':'reading');
        this.page.nowPage = 1;
        this.datas = [];
        this.init();
      },
      searchkey(){
        /*if(!this.page.key){
          this.$vux.toast.text('请输入关键字');
          return;
        }*/
        this.page.nowPage = 1;
        this.datas = [];
        this.init();
      },
      //检查下一页
      checkNext:function () {
        if(this.datas.length>0 && (this.datas.length % this.page.pageSize)==0){
          this.hasNext=true;
        }else{
          this.hasNext=false;
        }
      },
      //加载更多
      loadMore:function () {
        this.page.nowPage++;
        this.init();
      }
    },
    mounted(){
      const self = this;
      Util.checkLog().then(function (response) {
        if(response.data.code!=100){
          Util.login();
        }
      });

      let arr = [{label:'全部',value:''}];
      [
        {"code":"WZ","dicId":3,"id":9,"name":"温州市","sort":12},
        {"code":"WZSQ","dicId":3,"id":9,"name":"温州市区","sort":12},
		{"code":"DT","dicId":3,"id":19,"name":"洞头区","sort":2},
        {"code":"YQ","dicId":3,"id":14,"name":"乐清市","sort":7},
        {"code":"YJ","dicId":3,"id":15,"name":"永嘉县","sort":6}
      ].forEach(function (item) {
        arr.push({
          label:item.name,
          value:item.code
        })
      });
      self.$set(self.$data,'areaData',arr);
      /*Util.dic('AREA').then(function (response) {
        if(response.data){

        }
      });*/
      Util.dic('MEIZHOUYITU').then(function (response) {
        if(response.data){
          let arr = [{label:'全部',value:''}];
          response.data.list.forEach(function (item) {
            arr.push({
              label:item.name,
              value:item.code
            })
          });
          self.$set(self.$data,'typeData',arr);
        }
      });

    	this.init();
    }
  }
</script>
