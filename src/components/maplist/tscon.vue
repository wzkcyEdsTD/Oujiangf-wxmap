<template>
    <div>
      <x-header slot="header">{{content.title}}</x-header>
      <!-- :href="'/'+content.pic" -->
      <div v-if="content.pic  && !content.video" style="text-align: center;
    font-weight: bold;
    color: #666;
    margin-top: 10px;">点击图片可放大</div>

      <a @click="previewImage()" v-if="content.pic && !content.video" style="display: block;"><img :src="content.pic" style="width:100%;" alt=""></a>
      <video :src="content.video" v-if="content.video" webkit-playsinline playsinline
             style="width: 100%;margin-top:10px;" controls="controls" :poster="content.pic"></video>
      <div style="margin:10px;">{{content.info}}</div>
    </div>
</template>

<script>
  import Util from '@/libs/util';
  import {XHeader} from 'vux';
  export default {
  	components:{
      XHeader
    },
    data () {
      return {
        content:{}
      }
    },
    methods:{
      init(){
        const self = this;
        Util.ajax.post('/fapi/public/maplist/tesecon/'+self.content.id).then(function (response) {
          if(response.data.code=='100'){
            self.content = response.data.content;
            if(!self.content.video){
              if(!Util.isIOS()){
                const wx = self.$wechat;
                Util.ajax.post("/pubApi/auth/jsapk?url=" + encodeURIComponent(location.href)).then(function (data) {
                  wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: Util.wxconfig.appid, // 必填，公众号的唯一标识
                    timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                    signature: data.data.signature,// 必填，签名
                    jsApiList: ['getLocation','openLocation','previewImage'] // 必填，需要使用的JS接口列表
                  });
                });
              }
            }
          }
        });
      },
      previewImage(){
        const wx = this.$wechat;
        const self = this;
        wx.ready(function(){
          wx.previewImage({
            current: "http://"+location.host+"/"+self.content.pic, // 当前显示图片的http链接
            urls: ["http://"+location.host+"/"+self.content.pic] // 需要预览的图片http链接列表
          });
        });
      }
    },
    mounted () {
      let id = this.$route.params.id;
      if(id && parseInt(id)>0){
        this.content.id = id;
      }else{
        id = this.$route.query.id;
        if(id && parseInt(id)>0){
          this.content.id = id;
        }
      }
      this.init();
    }
  }
</script>
