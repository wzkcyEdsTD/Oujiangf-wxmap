<style scoped lang="less">
  @import "index.less";
</style>

<template>


  <div id="jiaoyuList">
    <!--头部开始-->
    <div class="clear ctbg2" style="height: 12px;"></div>
    <div class="header2_right">
      <div class="header_search">
        <div class="man">
          <form action="/outer/dynamic/catalog/7852" method="get">
            <input type="text" name="q" class="text" placeholder="请输入关键字">
            <input type="submit" class="btn" value="">
          </form>
        </div>
      </div>
    </div>
    <!--头部-->
    <div class="clear ctbg2" style="height: 12px;"></div>

    <div class="main">
      <div class="list_mu">
        <a class="m">幼儿园</a>
        <a class="m ov">小学</a>
        <a class="m">初中</a>
        <a class="m">高中</a>
        <a class="m">大学</a>
      </div>
      <div class="list_mu_sub">
        <ul>
          <li class="ov"><div class="m"><i></i>热门</div></li>
          <li><div class="m"><i></i>距离</div></li>
          <li><div class="m"><i></i>区域</div></li>
        </ul>
      </div>
      <div class="clear h20"></div>
      <div class="list_xc">
        <ul>
          <li v-for="i in 62">
            <div class="pc"><img src="@/img/pic_zbcy.jpg" class="ims" alt=""/></div>
            <div class="info">
              <div class="mp"><img src="@/img/map_ico.png" alt=""/></div>
              <div class="t">鹿城区光明小学</div>
              <div class="w">
                据您：1.5km<br />
                地址：鹿城区百里西路154号（象门街）
              </div>
              <div class="m">
                <a>市直属</a>
                <a>艺术教育</a>
                <a>百年名校</a>
                <a>外教资源</a>
              </div>
              <div class="clear"></div>
            </div>
          </li>
        </ul>
      </div>

      <div class="clear h20"></div>

    </div>


    <div class="clearfloat h60"></div>

  </div>
</template>

<script>
  import Swiper from 'swiper';
  /*import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import Tianditu from '@/components/libs/tianditu/main';
  import MapUtil from '@/components/libs/tianditu/util';*/
  export default {
    data:function(){
      return {
         asce:{}
      }
    },
    methods:{
      init:function(){
          this.asce;
      }
    },
    //加载完成
    mounted:function(){

      var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });

    }
  }
</script>
