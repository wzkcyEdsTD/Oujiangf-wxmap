<style lang="less" scoped>
  .muluon{
    color:@theme-color;
    img{border:2px solid @theme-color;box-sizing: border-box;}
  }
</style>

<template>
  <div>
    <x-header @on-click-back="listBack">{{title}}</x-header>

    <a @click="previewImage" :alt="title" :title="title" style="display:block;"><img :src="pic" alt=""></a>

    <div @click="popshow=true" style="position:fixed;bottom:0;left:0;width:100%;z-index: 1;line-height:36px;
        height:36px;background: #f3f3f3;font-weight: bold;text-align: center;color:#666;">
      <img src="@/images/mulu.png" alt="" style="height:22px;vertical-align: text-bottom;">
      目录
    </div>

    <!-- pop -->
    <popup v-model="popshow"  position="left" height="100%" width="60%">
      <div style="margin-bottom:10px;box-sizing: border-box;padding: 10px;width: 100%;text-align: center"
           v-for="i in catalog" :class="i.id==id?'muluon':''" @click="popClick(i)">
        <img :src="i.spic" alt="">
        <div>{{i.title}}</div>
      </div>
    </popup>


  </div>
</template>

<script>
  import Util from '@/libs/util';
  import {Popup,XHeader} from 'vux';
  export default {
  	components:{
  		Popup,XHeader
    },
    data(){
      return {
        id:0,
        pic:"",
        title:'',
        popshow:false,
        catalog:[]
      }
    },
    methods:{
      previewImage(){
        const wx = this.$wechat;
        const self = this;
      	wx.ready(function(){
          wx.previewImage({
            current: "http://"+location.host+"/"+self.pic, // 当前显示图片的http链接
            urls: ["http://"+location.host+"/"+self.pic] // 需要预览的图片http链接列表
          });
        });
      },
      popClick(i){
        this.pic=i.pic;
        this.title=i.title;
        this.popshow=false;
        this.id=i.id;
        Util.title(i.title);
      },
      listBack(){
      	this.$router.push({name:'standard'});
      }
    },
    async mounted(){
    	//<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
      const id = this.$route.query.id;
      const self = this;
      if(id){
        this.id = id;
      	self.$vux.loading.show();
        Util.ajax.post('/fapi/public/maplist/biaozhuncon/'+id).then(function (response) {
          self.$vux.loading.hide();
          if(response.data && response.data.code==100){
            self.$set(self.$data,'pic',response.data.content.pic);
            self.$set(self.$data,'title',response.data.content.title);
            Util.title(self.title);
            //
            Util.ajax.post('/fapi/public/maplist/biaozhun',{maptype:self.$route.query.maptype,state:response.data.content.state}).then(function (response) {
              self.$set(self.$data,'catalog',response.data || []);
            });
          }else{
          	self.$vux.alert.show(response.data.msg);
          }
        });
      }else{
        this.pic = this.$route.query.pic;
        const title = this.$route.query.title;
        this.title = title;
        Util.title(title);
        //
        Util.ajax.post('/fapi/public/maplist/biaozhun',{maptype:this.$route.query.maptype}).then(function (response) {
          self.$set(self.$data,'catalog',response.data || []);
        });
      }
      //
      if(!Util.isIOS()){
        const wx = this.$wechat;
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
</script>
