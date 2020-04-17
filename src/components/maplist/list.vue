<style lang="less">
  .t-maplist{
    overflow:hidden;margin-top:20px;font-size:12px;
    .t-mapitem{
      width:50%;float:left;box-sizing:border-box;padding:0 10px;
      .t-mapitem_img{
        height:120px;width: 100%;
      }
      .t-mapitem_tit{
        color:#666;text-align: center;
      }
    }
  }
</style>

<template>
  <view-box body-padding-top="44px">
    <tab v-if="tabList" slot="header" style="position:absolute;top:0;width:100%;z-index:9;background:#fff;">
      <tab-item @on-item-click="handler(i,idx)"
                v-for="(i,idx) in tabList"
                :selected="mapList.bean.maptype==i.code">{{i.name}}</tab-item>
    </tab>
    <div class="t-maplist">
      <template v-for="(i,idx) in mapList.data">
        <div class="t-mapitem" style="margin-bottom: 10px" @click="detail(i,idx)">
          <div class="t-mapitem_img" :style="{background:'url('+i.spic+') no-repeat center','background-size':'100% 100%'}"></div>
          <div class="t-mapitem_tit">{{i.title}}</div>
        </div>
        <div v-if="(idx+1)%2==0" style="height:1px;width: 100%;overflow: hidden;"></div>
      </template>
    </div>
    <!--<a @click="detail(i,idx)"
       v-for="(i,idx) in data" style="margin:10px;display: block;font-size: 14px;">{{i}}</a>-->
  </view-box>
</template>

<script>
  import Util from '@/libs/util';
  import {Tab,TabItem,ViewBox} from 'vux';
  export default {
  	components:{
      Tab,TabItem,ViewBox
    },
  	data(){
  		return {
  			id:"",
        data:['01.温州市地图4k','02_温州市区地图4k'
          ,'03.鹿城区地图','04.龙湾区地图4K_s','05.瓯海区地图4K','06.洞头区地图'
          ,'07.瑞安市地图4K_s','08.乐清市地图'
          ,'09.永嘉县地图','10.平阳县地图s','11.苍南县地图s','12.文成县地图'
          ,'13.泰顺县地图4K_s','14.温州市地形地貌图','15.温州市地表覆盖地图'
          ,'16.温州市水系流域图','17-温州市城市建成区范围图','18.生态环保工作地图'
          ,'19.温州市乡村振兴地图','20.温州市区“大建大美”工作地图'
          ,'21.温州市域综合交通规划图','22.温州中心城区用地规划图'],
        mapList:{
  				bean:{
  					maptype:"ZWYT"
          },
          data:[]
        },
        tabList:[]
      }
    },
    methods:{
  		init(){
  			const self = this;
  			//标准地图
  			Util.ajax.post('/fapi/public/maplist/biaozhun',this.mapList.bean).then(function (response) {
          if(response.data && response.data.length && response.data.length>0){
          	self.$set(self.mapList,'data',response.data);
          }
        });
      },
  		detail(i,idx){
        this.$router.push({name:'standardDetail',query:{'id':i.id,'pic':i.pic,'title':i.title,'maptype':i.maptype}});
      },
      handler(i,idx){
        this.mapList.bean.maptype = i.code;
        this.$set(this.mapList,'data',[]);
        this.init();
  		}
    },
  	mounted(){
  		const self = this;
  		//获取tab
      Util.dic('BIAOZHUN').then(function (response) {
        if(response.data.list){
        	self.$set(self.$data,'tabList',response.data.list);
          if(self.$route.query && self.$route.query.maptype){
            self.mapList.bean.maptype = self.$route.query.maptype;
          }
          self.init();
        }
      });
    }
  }
</script>
