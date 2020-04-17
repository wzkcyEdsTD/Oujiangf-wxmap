<template>
  <div class="news-list">
    <!--头部-->
    <x-header slot="header">{{wxscNews.title}}</x-header>
    <div class="news-content">
      <div class="news-title"><h3>{{wxscNews.title}}</h3></div>
      <div class="news-info">{{wxscNews.showtime|formatDate}}</div>
      <div class="news-detail" v-html="wxscNews.tcontent"></div>
    </div>
  </div>
</template>

<script>
  import {XHeader} from 'vux';
  import Util from '@/libs/util';
  export default {
    components:{
      XHeader
    },
    data () {
      return {
        wxscNews:{
          id:null,
          title:"",
          content:""
        }
      }
    },
    filters:{
      formatDate(val){
        if(val){
          return new Date(val).Format('yyyy-MM-dd');
        }else{
          return '';
        }
      }
    },
    methods:{
      init(){
        const self = this;
        Util.ajax.post('/fapi/public/meizhou/content/'+self.wxscNews.id,).then(function (response) {
          self.wxscNews = response.data || {};
        });
      }
    },
    mounted () {
      let id = this.$route.params.id;
      if(id && parseInt(id)>0){
        this.wxscNews.id = id;
      }else{
        id = this.$route.query.id;
        if(id && parseInt(id)>0){
          this.wxscNews.id = id;
        }
      }
      this.init();
    }
  }
</script>

<style lang="less">
  @import "../../news/NewsContent.less";
</style>
