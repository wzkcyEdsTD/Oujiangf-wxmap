<template>
  <!--底部-->
    <!--<div style="height:53px;"></div>-->
  <tabbar v-cloak style="height:53px;">
    <tabbar-item  link="/" :selected="tabbarchecked==1?true:false">
      <template slot="icon">
        <img v-if="tabbarchecked==1" src="@/images/tabbar1-on.png"  alt="" class="weui-tabbar__icon">
        <img v-else src="@/images/tabbar1.png" alt="" class="weui-tabbar__icon">
      </template>
      <span slot="label">首页</span>
    </tabbar-item>
    <tabbar-item  link="/map/map" :selected="tabbarchecked==2?true:false">
      <template slot="icon">
        <img v-if="tabbarchecked==3" src="@/images/tabbar7-on.png"  alt="" class="weui-tabbar__icon">
        <img v-else src="@/images/tabbar7.png" alt="" class="weui-tabbar__icon">
      </template>
      <span slot="label">活动列表</span>
    </tabbar-item>
  </tabbar>
</template>

<script>
  import {Tabbar,TabbarItem} from 'vux';
  export default {
    name: 'pubTabbar',
    components:{
      Tabbar,TabbarItem
    },
    props:['tabbarchecked'],
    methods:{
      gomap(){
      	location.href='/map.html';
      }
    }
  }
</script>
