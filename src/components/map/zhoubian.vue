<style lang="less" scoped>
  .t-zhoubian{
    height:100%;overflow:auto;position:relative;
    .t-zhoubian-item{
      padding: 10px;margin-top:5px;border-bottom:1px solid #eee;
      .item-title{
        font-size: 16px;margin-bottom:10px;
        img{margin-right:5px;vertical-align: middle;width:30px;}
      }
      .item-list{
        overflow: hidden;
        > a{
            width:33%;float:left;display: block;border-left:1px solid #eee;box-sizing: border-box;
            padding-left:8px;margin-bottom: 10px;color:#333;font-size: 12px;
        }
      }
    }
  }
</style>

<template>
  <div class="t-zhoubian">
    <img src="@/images/close.png" @click="closePop" style="width:20px;position:fixed;top:10px;right:10px;" alt="">
    <!-- 顶部推荐 -->
    <div style="overflow:hidden;margin-top:45px;">
      <template v-for="(i,idx) in ssflList">
        <div style="width:25%;float:left;font-size: 12px;text-align: center;box-sizing: border-box;margin-top:15px;"
             @click="zhoubianDetail(i,ssflList)" >
          <img :src="i.pic" width="30" alt="" style="display: block;margin:0 auto;border:1px solid #ddd;border-radius: 50%;">
          <div>{{i.name}}</div>
        </div>
        <div v-if="(idx+1)%4==0" style="height:1px;width:100%;float: left;"></div>
      </template>
    </div>
    <!-- 列表 -->
    <div class="t-zhoubian-item" v-for="(i,idx) in dataList">
      <div class="item-title" @click="zhoubianDetail(i,[i,...i.children])">
        <img v-if="i.icon" :src="i.icon" alt="">
        <img v-else src="@/images/zb1.jpg" alt="">
        {{i.name}}
      </div>
      <div class="item-list">
        <template v-for="(ii,iidx) in i.children">
          <a @click="zhoubianDetail(ii,i.children)">{{ii.name}}</a>
          <div v-if="(iidx+1)%3==0" style="height: 1px;overflow: hidden;width:100%;"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  export default {
      data(){
      	return {
          dataList:[],
          ssflList:[]
        }
      },
      methods:{
        init(){
          const self = this;
          Util.ajax.post('/fapi/public/option/zt').then(function (response) {
            if(response.data && response.data.length){
            	const d = Util.jsonToTree(response.data);
              self.$set(self.$data,'dataList',d);
            }
          });
          Util.ajax.post('/fapi/public/option/ssfl').then(function (response) {
            if(response.data){
            	console.log(response.data);
            	self.$set(self.$data,'ssflList',response.data);
            }
          });
        },
        goback(){
          this.$emit('closePop');
        },
        zhoubianDetail(ii,list){
        	list.forEach(function (item) {
            item.iszhoubian=true;
          });
          this.$emit('zhoubianDetail',ii,list);
        },
        closePop(){
          this.$emit('closePop');
        }
      },
      mounted(){
        const self = this;
        /*Util.title('周边列表');
        var state = {
          title: "title",
          url: location.href
        };
        window.history.pushState(state, "title", location.href);
        window.addEventListener("popstate", function (e) {
          pushHistory();
        }, false);
        function pushHistory() {
          self.goback();
        }*/
        this.init();
      }
  }
</script>
