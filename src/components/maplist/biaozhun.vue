<style lang="less" scoped>
  .t-maplist{
      overflow:hidden;margin-top:20px;font-size:12px;
    .t-mapitem{
      width:50%;float:left;box-sizing:border-box;padding:0 10px;
      .t-mapitem_img{
        height:120px;width: 100%;
      }
      .t-mapitem_tit{
        color:#666;
      }
    }
  }
</style>

<template>
  <view-box body-padding-top="44px">
    <tab v-if="tabList" slot="header" style="position:absolute;top:0;width:100%;z-index:9;background: #fff;">
      <tab-item @on-item-click="handler(i,idx)"
                v-for="(i,idx) in tabList"
                :selected="mapList.bean.maptype==i.code">{{i.name}}</tab-item>
    </tab>
    <div class="t-maplist">
      <template v-for="(i,idx) in mapList.data">
        <div class="t-mapitem" style="margin-bottom: 10px" @click="detail(i,idx)">
          <div class="t-mapitem_img" :style="{'background':'url() no-repeat center center 100% 100%'}"></div>
          <div class="t-mapitem_tit">标题</div>
        </div>
        <div v-if="(idx+1)%2==0" style="height:1px;width: 100%;overflow: hidden;"></div>
      </template>
    </div>
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
        Util.ajax.post('/fapi/public/maplist/biaozhun').then(function (response) {
          if(response.data && response.data.length && response.data.length>0){
            self.$set(self.mapList,'data',response.data);
          }
        });
      },
      detail(i,idx){
        this.$router.push({name:'standardDetail',query:{'id':(idx+1)}});
      },
      handler(i,idx){
        this.mapList.bean.maptype = i.code;
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
        }
      });
    }
  }
</script>
