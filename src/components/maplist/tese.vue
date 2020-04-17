<style lang="less" scoped>
  .t-maplist{
      overflow:hidden;margin-top:20px;font-size:12px;
    .t-mapitem{
      width:33%;float:left;box-sizing:border-box;padding:0 10px;
      .t-mapitem_img{
        height:80px;width: 100%;
      }
      .t-mapitem_tit{
        margin-top:10px;
        color:#666;text-align: center;
      }
    }
  }
</style>

<template>
  <div style="position: relative;height:100%;overflow:scroll;padding-top:44px;">
    <tab v-if="tabList" slot="header" style="position:fixed;top:0;width:100%;z-index:9;background:#fff;">
      <tab-item @on-item-click="handler(i,idx)"
                v-for="(i,idx) in tabList"
                :selected="mapList.bean.maptype==i.code">{{i.name}}</tab-item>
    </tab>

    <!-- 筛选列表 -->
    <template v-if="mapList.bean.maptype=='SHIJING'">
      <div class="shaixuan" style="width:100%;background: #f3f3f3;font-size: 13px;">
        <div :class="mapList.bean.hotspot?'on':''" @click="sortClick">
          <img v-if="mapList.bean.hotspot" src="@/img/ico_lm_ov.png" alt=""><img v-else src="@/img/ico_lm.png" alt="">热门</div>
        <div :class="mapList.bean.area?'on':''" @click="areaShow=true">
          <img v-if="areaVal" src="@/img/ico_qy_ov.png" alt=""><img v-else src="@/img/ico_qy.png" alt="">
          <template v-if="areaVal">{{areaVal}}</template>
          <template v-else>区域<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
        </div>
        <!-- 类别 -->
        <div :class="mapList.bean.type?'on':''" @click="typeShow=true">
          <img v-if="typeVal" src="@/img/ico_lx_ov.png" alt="">
          <img v-else src="@/img/ico_lx.png" alt="">
          <template v-if="typeVal">{{typeVal}}</template>
          <template v-else>类别<img src="@/img/arrow_down.png" style="height: 6px;vertical-align: middle;margin-left: 5px;" alt=""></template>
        </div>
      </div>
    </template>
    <div class="t-maplist">
      <template v-for="(i,idx) in mapList.data">
        <div class="t-mapitem" style="margin-bottom: 10px" @click="detail(i,idx)">
          <div class="t-mapitem_img" :style="{background:'url('+i.spic+') no-repeat center','background-size':'100% 100%'}"></div>
          <div class="t-mapitem_tit">{{i.title}}</div>
          <!-- <template v-if="i.bianzhi">（{{i.bianzhi}}）</template> -->
        </div>
        <div v-if="(idx+1)%3==0" style="height:1px;width: 100%;overflow: hidden;"></div>
      </template>
    </div>

    <popup v-model="popshow" position="right" width="100%" height="100%">
      <iframe v-if="popshow && popurl" :src="popurl" frameborder="0"
              style="width:100%;height:calc(100% - 45px);display:block;"></iframe>
      <div class="bottom-btn" @click="popshow=false">关闭</div>
    </popup>

    <!-- actionsheet -->
    <div v-transfer-dom>
      <actionsheet v-model="areaShow" @on-click-menu="clickArea"
                   :menus="areaData">
      </actionsheet>
    </div>
    <!-- 类型 -->
    <div v-transfer-dom>
      <actionsheet v-model="typeShow" @on-click-menu="clickType"
                   :menus=typeData >
      </actionsheet>
    </div>

  </div>
</template>

<script>
  import Util from '@/libs/util';
  import {Tab,TabItem,Popup,Actionsheet} from 'vux';
  export default {
    components:{
      Tab,TabItem,Popup,Actionsheet
    },
    data(){
      return {
        id:"",
        typeShow:false,
        typeData:[],
        typeVal:'',
        popshow:false,
        popurl:'',
        data:[],
        mapList:{
          bean:{
            maptype:""
          },
          idx:0,
          data:[]
        },
        tabList:[],
        areaData:[],
        areaShow:false,
        areaVal:''
      }
    },
    methods:{
      clickType(key,item){
        this.typeVal = item.label;
        this.mapList.data = [];
        this.mapList.bean.type = item.label=='全部'?'':item.label;
        this.init();
      },
      init(){
        const self = this;
        //标准地图
        Util.ajax.post('/fapi/public/maplist/tese',this.mapList.bean).then(function (response) {
          if(response.data && response.data.length && response.data.length>0){
            self.$set(self.mapList,'data',response.data);
          }
        });
      },
      detail(i,idx){
      	console.log(location.host);
      	if(i.link && i.link!=''){
      		if(/\/#\/.*/.test(i.link)){
            location.href = i.link;
          }else{
      		  this.popshow = true;
      		  this.popurl = i.link;
          }
        }else{
          this.$router.push({name:'tscon',query:{'id':i.id}});
        }
      },
      handler(i,idx){
      	/*if(i.name=='室内地图'){
      		alert('室内地图正在建设中');
      		return;
        }*/
      	this.mapList.bean.area = '';
      	this.mapList.bean.type = '';
      	this.$set(this.$data,'typeVal','');
      	this.$set(this.$data,'areaVal','');
      	this.mapList.bean.hotspot = 0;
        this.mapList.bean.maptype = i.code;
        this.$set(this.mapList,'data',[]);
        this.init();
      },
      sortClick(){
        this.mapList.bean.hotspot=(this.mapList.bean.hotspot?0:1);
        this.mapList.data = [];
        this.init();
      },
      clickArea(key,item){
        /*if(item.label=='全部'){
          this.areaVal = '';
        }else{

        }*/
        this.areaVal = item.label;
        this.mapList.data = [];
        this.mapList.bean.area = item.label=='全部'?'':item.label;
        this.init();
      }
    },
    mounted(){
      Util.checkLog().then(function (response) {
        if(response.data.code!=100){
          Util.login();
        }
      });
      const self = this;
      //获取tab
      Util.dic('TESE').then(function (response) {
        if(response.data.list){
          self.$set(self.$data,'tabList',response.data.list);
          if(self.$route.query && self.$route.query.maptype){
            self.mapList.bean.maptype = self.$route.query.maptype;
          }else{
            self.mapList.bean.maptype = response.data.list[0].code
          }
          self.init();
        }
      });
      this.typeData = [
        {label:'全部',value:''},
        {label:'景区景点',value:'景区景点'},
        {label:'精品民宿农家乐',value:'精品民宿农家乐'},
        {label:'城市公园',value:'城市公园'},
        {label:'乡村示范带工程',value:'乡村示范带工程'},
        {label:'其他全景',value:'其他全景'},
      ];
      //区域
      Util.dic('AREA').then(function (response) {
        if(response.data){
          let arr = [{label:'全部',value:''}];
          response.data.list.forEach(function (item) {
          	if(item.name!='温州市' && item.name!='温州市区' && item.name!='全市域'){
              arr.push({
                label:item.name,
                value:item.code
              })
            }
          });
          self.$set(self.$data,'areaData',arr);
        }
      });
    }
  }
</script>
