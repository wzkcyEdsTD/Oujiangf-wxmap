<style scoped lang="less">
  @import "content.less";
</style>

<template>
  <div id="jiaoyuListView">
    <!--头部开始-->
    <div class="top_chome">
      <div class="ihome"></div>
      <div class="icloes"></div>
    </div>
    <!--头部-->
    <div class="xczt_banner">
      <img src="@/img/jplx_top_pc01.jpg" class="ims">
    </div>
    <div class="main">
      <div class="rt_tit">
        <span class="fl">
          <b>古韵楠溪精品路线</b>
          <div class="tit">距您：18.07KM    地址：永嘉县岩头镇下日川村</div>
        </span>
        <div class="bt_mp">进入地图</div>
      </div>
      <div class="clear"></div>
      <div class="map_mu">
        <a href="">风景优美</a>
        <a href="">吟诗作对</a>
        <a href="">适合放松</a>
        <a href="">适合情侣</a>
      </div>
      <div class="clear h20"></div>
      <div class="map_btn">
        <a href="">周边</a>
        <a href="">收藏</a>
        <a href="">纠错</a>
        <a href="">导航</a>
        <a href="">全景</a>
        <a href="">传图</a>
      </div>
      <div class="clear"></div>
      <a name="twjj11" id="twjj11"></a>
      <div class="about">
        <div class="rt_tit mart">
          <strong>基本信息</strong>
        </div>
        <div class="wz">
          电话：0577-88888888<br />
          性质：<br />
          特色：<br />
        </div>
        <div class="rt_tit mart">
          <strong>图库</strong>
          <a class="pmore">上传图片</a>
        </div>
      </div>
      <ul class="item-pic">
        <li><img src="@/img/jplx_top_pc01.jpg"></li>
        <li><img src="@/img/jplx_top_pc01.jpg"></li>
      </ul>
      <div class="clear"></div>
      <div class="rt_tit mart">
        <strong>印象评价</strong>
      </div>
      <ul class="yxpj_li">
        <li><div class="item">装修较新（20）</div></li>
        <li><div class="item">环境优雅（10）</div></li>
        <li><div class="item">干净整洁（55）</div></li>
        <li><div class="item">干净整洁（66）</div></li>
      </ul>
      <div class="clear "></div>
      <div class="rt_tit mart">
        <strong>简介</strong>
      </div>
      <div class="wz">
        <p style="text-indent: 2em;">
          简介数据
        </p>
      </div>
      <div class="clear h20"></div>
    </div>
    <div class="clear ctbg2" style="height: 12px;"></div>
    <div class="main">
      <div class="rt_tit mart">
        <strong>周边餐饮</strong>
        <a class="more">更多&gt;</a>
      </div>
      <div class="clear"></div>
      <div class="list_xc">
        <ul>
          <li v-for="i in 2">
            <div class="pc"><img src="@/img/pic_zbcy.jpg" class="ims" alt=""/></div>
            <div class="info">
              <div class="mp"><img src="@/images/i-daohang.png" width="26" alt=""/></div>
              <div class="t">美食</div>
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
      <div class="clear"></div>
      <div class="rt_tit mart">
        <strong>周边城市书房</strong>
        <a class="more">更多&gt;</a>
      </div>
      <div class="clear"></div>
      <div class="list_xc">
        <ul>
          <li v-for="i in 2">
            <div class="pc"><img src="@/img/pic_zbcy.jpg" class="ims" alt=""/></div>
            <div class="info">
              <div class="mp"><img src="@/images/i-daohang.png" width="26" alt=""/></div>
              <div class="t">城市书房</div>
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
      <div class="clear"></div>
      <div class="rt_tit mart">
        <strong>周边快查</strong>
        <a class="more">更多&gt;</a>
      </div>
      <div class="clear"></div>
      <ul class="list_zbkc">
        <li><div class="item">停车场</div></li>
        <li><div class="item">图书馆</div></li>
        <li><div class="item">科技馆</div></li>
        <li><div class="item">肯德基</div></li>
        <li><div class="item">餐厅</div></li>
        <li><div class="item">书店</div></li>
        <li><div class="item">宾馆</div></li>
        <li><div class="item">其他</div></li>
      </ul>
      <div class="clear h20"></div>

    </div>
    <div class="clear ctbg2" style="height: 12px;"></div>

  </div>
</template>

<script>
  import Util from '@/libs/util';
  import esriLoader from 'esri-loader';
  import {ViewBox} from 'vux';
  export default {
    components:{
      ViewBox
    },
    data:function(){
      return {
        content:{
          id:0
        },
        juli:[]
      }
    },
    methods:{
      init(){
        const self = this;
        /*Util.ajax.post('').then(function (response) {

         });*/
      }
    },
    //加载完成
    mounted(){
      const cid = this.$route.query.cid;
      if(cid){
        this.content.id = cid;
        this.init();
      }
    }
  }
</script>
