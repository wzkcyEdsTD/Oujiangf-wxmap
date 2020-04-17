<style lang="less" scoped>
  .t-personal{
      padding: 0 10px;
      .t-personal-info{
        margin-top:20px;
        margin-bottom:15px;
        text-align: center;
        font-size:14px;font-weight:bold;
        img{width:38%;}
      }
    .t-personal-tit{
      overflow:hidden;
      background: url("../../images/p-1.png") no-repeat left center;
      background-size:auto 80%;
      div{text-indent:1.5em;font-weight: bold;float:left;}
      a{color:#666;float: right;font-size: 12px;line-height: 22px;}
      &.t-personal-tit_collect{background: url("../../images/p-2.png") no-repeat left center;background-size:auto 80%;}
      &.t-personal-tit_shangbao{background: url("../../images/p-3.png") no-repeat left center;background-size:auto 60%;}
    }
    /*收藏列表*/
    .t-personal-clist{
      margin-top:15px;margin-bottom:25px;
      .t-personal-clist_item{
        display:flex;
        .clist_item-img{width:20%;margin-left:5px;}
        .clist_item-info{font-size: 12px;margin:0 10px;flex:1;}
        .clist_item-del{img{width:16px;vertical-align: middle;}}
      }
    }
    /*地址列表*/
    .t-personal-alist{
      margin:20px 0 25px 0;
      color:#333;
      text-indent:20px;
      .alist-btn{
        display: block;
        background: url(../../images/i-addr.png) no-repeat 5px center;background-size:auto 70%;
      }
    }
    /*上报列表*/
    .t-personal-slist{
      margin-top:20px;margin-left:6px;
      .slist-item{
        background: url("../../images/i-dot.png") no-repeat left center;
        text-indent: 12px;color:#666;
      }
    }
  }
</style>

<template>
  <div class="t-personal">
    <div class="t-personal-info">
      <img v-if="wxuser" :src="wxuser.headpic" alt="">
      <img v-else src="@/images/h2.jpg" alt="">
      <div v-if="wxuser">{{wxuser.nickname}}</div>
    </div>
    <!-- 我的收藏 -->
    <div class="t-personal-tit">
      <div>我的收藏列表</div>
      <a @click="$emit('collectMore')">更多</a><!--  -->
    </div>
    <!-- 收藏列表 -->
    <div class="t-personal-clist">
        <div class="t-personal-clist_item mt10" v-for="(i,idx) in collectData" >
          <!--<div class="clist_item-img"><img src="@/images/pic1.jpg" alt=""></div>-->
          <div class="clist_item-info" @click="collectDetail(i)">{{i.title}}</div>
          <div class="clist_item-del"><img @click="delCollect(i.id,idx)" src="@/images/i-del.png" alt=""></div>
        </div>
    </div>
    <!-- 我的常用地址 -->
    <div class="t-personal-tit t-personal-tit_collect">
      <div>我的常用地址</div>
      <a @click="addrList">更多</a>
    </div>
    <!-- 地址列表 -->
    <div class="t-personal-alist">
      <a class="alist-btn" @click="setAddr">点击设置</a>
      <div class="t-personal-clist">
        <div class="t-personal-clist_item mt10" v-for="(i,idx) in addrData" >
          <div class="clist_item-info" @click="collectDetail(i)">{{i.title}}</div>
          <div class="clist_item-del"><img @click="delAddr(i.id,idx)" src="@/images/i-del.png" alt=""></div>
        </div>
      </div>
      <!--<div class="t-personal-slist">
        <div class="slist-item" v-for="i in addrData" @click="collectDetail(i)">{{i.title}}</div>
      </div>-->
    </div>
    <!-- 我的上报 -->
    <div class="t-personal-tit t-personal-tit_shangbao">
      <div>我的上报列表</div>
      <a @click="shangbaoList">更多</a>
    </div>
    <!-- 上报列表 -->
    <!--<div class="t-personal-slist">
      <div class="slist-item" v-for="i in shangbaoData" @click="collectDetail(i)">{{i.title}}</div>
    </div>-->
    <div class="t-personal-clist">
      <div class="t-personal-clist_item mt10" v-for="(i,idx) in shangbaoData" >
        <div class="clist_item-info" @click="collectDetail(i)">{{i.title}}</div>
        <div class="clist_item-del"><img @click="delShangbao(i.id,idx)" src="@/images/i-del.png" alt=""></div>
      </div>
    </div>
<!--    &lt;!&ndash; pop &ndash;&gt;
    <popup v-model="popshow" >
      <p-addr v-if="popshow" @closePop="popshow=false" ></p-addr>
    </popup>-->

  </div>
</template>

<script>
  import Util from '@/libs/util';
  //import PAddr from '@/components/personal/addr/form';
  //import {Popup} from 'vux';
  export default {
  	data(){
  	  return {
        collectPop:{
        	show:false
        },
        popshow:false,
        collectData:[],
        addrData:[],
        shangbaoData:[]
      }
    },
    computed:{
  		wxuser(){
  			return this.$store.getters.wxuser;
      }
    },
    methods:{
      collect(){
      	const self = this;
      	self.$vux.loading.show();
        Util.ajax.post('/fapi/needlogin/collect/list').then(function (response) {
          self.$vux.loading.hide();
          self.$set(self.$data,'collectData',response.data || []);
        });
      },
      collectDetail(collect){
      	this.$emit('collectDetail',collect);
      },
      delCollect(id,idx){
        const self = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '您确定要删除吗？',
          onConfirm () {
            Util.ajax.post('/fapi/needlogin/collect/del?ids='+id).then(function (response) {
              if(response.data.code==100){
                self.$vux.toast.text('删除成功');
                self.collect();
              }else{
                alert(response.data.msg);
              }
            });
          }
        });
      },
      delAddr(id,idx){
        const self = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '您确定要删除吗？',
          onConfirm () {
            Util.ajax.post('/fapi/needlogin/addr/del?ids='+id).then(function (response) {
              if(response.data.code==100){
                self.$vux.toast.text('删除成功');
                self.addr();
              }else{
                alert(response.data.msg);
              }
            });
          }
        });
      },
      delShangbao(id,idx){
        const self = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '您确定要删除吗？',
          onConfirm () {
            Util.ajax.post('/fapi/needlogin/report/del?ids='+id).then(function (response) {
              if(response.data.code==100){
                self.$vux.toast.text('删除成功');
                self.shangbao();
              }else{
                alert(response.data.msg);
              }
            });
          }
        });
      },
      shangbao(){
        const self = this;
        Util.ajax.post('/fapi/needlogin/report/info').then(function (response) {
            self.$set(self.$data,'shangbaoData',response.data || []);
        });
      },
      addr(){
        const self = this;
        Util.ajax.post('/fapi/needlogin/addr/info').then(function (response) {
            self.$set(self.$data,'addrData',response.data || []);
        });
      },
      setAddr(){
        this.$emit('setAddr');
      },
      shangbaoList(){
      	this.$emit('shangbaoMore');
      },
      addrList(){
      	this.$emit('addrList');
      }
    },
    mounted(){
      this.collect();
      this.shangbao();
      this.addr();
    }
  }
</script>
