<!-- 收藏列表 -->
<style lang="less" scoped>
  .collect-list{
    padding-bottom:50px;
    padding-top:40px;
  .collect-top{
    line-height: 40px;
    border-bottom: 1px solid #eee;
  a{margin-right:10px;font-size: 16px;}
  }
  .collect-list_item{
    padding: 10px 0;
    margin:0 10px;
    border-bottom:1px solid #eee;
    display: flex;
  .collcet-item_img{width:20%;vertical-align: middle;}
  .collect-item_icon{position: relative;width:32px;}
  }
  .collect-item_info{
  >div:nth-child(1){
     font-weight: bold;
   }
  >div:nth-child(2){
     color:#666;
   }
  >div:nth-child(3){
     color:#666;
   }
  }
  .collect-bottom{
    position:fixed;
    bottom:0;
    width:100%;
    line-height: 50px;
    font-size:16px;
    box-sizing: border-box;
    padding: 0 10px;
  }
  }
</style>

<template>
  <div class="collect-list" >
    <x-header :left-options="{'preventGoBack':true}" @on-click-back="goback" style="position: fixed;top: 0;width: 100%;"><!-- :left-options="{'preventGoBack':true}" -->
      <a slot="right" @click="del" v-if="isedit">删除</a>
    </x-header>
    <div class="collect-list_item" v-for="(i,idx) in list">
      <div class="collect-item_icon">
        <check-icon v-model="i.check" @click.native="changeCheck(i)" style="position: absolute;top:50%;margin-top:-12px;"></check-icon>
      </div>
      <div class="collcet-item_img" v-if="i.pic">
        <img :src="i.pic"  alt="">
      </div>
      <div class="collect-item_info">
        <div>{{i.title}}</div>
      </div>
    </div>
    <div class="collect-bottom">
      <check-icon style="float: left;" v-model="checkall" @click.native="docheckall" v-if="isedit">全选</check-icon>
      <div style="float: right">
        <a @click="isedit=false" v-if="isedit">完成</a>
        <a v-else @click="isedit=true">编辑</a>
      </div>

    </div>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import {CheckIcon,XHeader} from 'vux';
  export default {
    components:{
      CheckIcon,XHeader
    },
    data(){
      return {
        url:"/fapi/needlogin/addr/",
        list:[],
        checkList:[],
        isedit:false,
        checkall:false
      }
    },
    methods:{
      init(){
        const self = this;
        Util.ajax.post(this.url+"all").then(function (response) {
          if(response.data && response.data.length && response.data.length>0)
            self.$set(self.$data,'list',response.data)
        })
      },
      del(){
        var delIds = "";
        let delList = [];
        const self = this;
        self.list.forEach(function (item) {
          if(item.check){
            delIds=delIds+","+item.id;
            delList.push(item);
          }
        });
        if(delList.length==0){
          this.$vux.toast.text('请至少选择一项');
          return;
        }
        Util.ajax.post(this.url+"del?ids="+delIds.replace(',','')).then(function (response) {
          if(response.data.code==100){
            self.init();
          }else{
            self.$vux.toast.text(response.data.msg);
          }
        });
      },
      docheckall(){
        this.checkall = !this.checkall;
        const self = this;
        this.list.forEach(function (item) {
          self.$set(item,'check',self.checkall?true:false);
        });
      },
      changeCheck(i){
        console.log(i);
        this.$set(i,'check',i.check?false:true);
      },
      goback(){
        this.$emit('closePop');
      }
    },
    mounted(){
      this.init();
      const self = this;
      Util.title('我的常用地址');
      var state = {
        title: "title",
        url: "#"
      };
      window.history.pushState(state, "title", "#");
      window.addEventListener("popstate", function (e) {
        pushHistory();
      }, false);
      function pushHistory() {
        self.goback();
        /*var state = {
         title: "title",
         url: "#"
         };
         window.history.pushState(state, "title", "#");*/
      }

    }
  }
</script>
