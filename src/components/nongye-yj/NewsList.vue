<style lang="less">
  .newidx {
    .vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-img{background-size:100% 100%;}
    .weui-grid:before{
      border-right:1px solid #aaa;
    }
    .weui-grid:after{
      border-bottom:1px solid #aaa;
    }
  }
</style>

<template>
  <view-box ref="viewBox" body-padding-top="0px" class="newidx">
    <!--列表-->
    <div class="news-list" style="margin-top:15px;">
      <div class="news-item" style="display: flex;background: #fff;padding:8px;border-bottom: 1px solid #ddd"
           v-for="i in datas" @click="toNewsCon(i)">
        <div><img :src="i.pic" alt="" width="90"></div>
        <div style="flex:3;padding-left:10px;">
          <div>{{i.title}}</div>
          <div style="color:#666;font-size: 12px;margin:5px 0;">{{i.summary}}</div>
          <div style="color:#666;font-size: 12px;">{{i.showtime|dateFormat}}</div>
        </div>
      </div>
    </div>
    <!--  -->
    <!-- 加载更多 -->
    <div v-if="hasNext" class="bottom-btn mt10" @click="loadMore">加载更多</div>
    <div v-else style="text-align:center;margin-top:10px;color:#666;">没有更多了~</div>
  </view-box>
</template>

<script>
  import {ViewBox} from 'vux';
  import pubTabbar from '@/components/libs/pubTabbar/pubTabbar.vue';
  import Util from '@/libs/util';
  export default {
    components:{
      ViewBox
    },
    data (){
      return {
        //首页幻灯片
        swiperList:[],
        //首页公告
        noticeList:[],
        //分类按钮
        catalogList:[],
        //加载状态
        idxLoad:{
          load1:false,
          load2:false,
          load3:false
        },
        page:{
          nowPage:1,
          pageSize:10,
          bean:{
            columnid:8
          }
        },
        datas:[],
        hasNext:true,
        searchKey:"",
        group:{
          show1:true,
          show2:false,
          show3:false,
          show4:false
        }
      }
    },
    filters:{
      substr (str){
        return str.substr(0,20);
      }
    },
    methods:{
      init(){
        // 显示
        const self = this;
        this.$vux.loading.show();
        Util.ajax.post("/fapi/public/news/list",self.page).then(function (response) {
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
      toNewsCon (i) {
      	if(i.link){
      		location.href = i.link;
        }else{
          this.$router.push({name:"NewsContent",query:{id:i.id}});
        }
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
      this.init();
    }
  }
</script>
