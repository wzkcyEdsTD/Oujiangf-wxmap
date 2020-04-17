<style lang="less" scoped>

</style>

<!--詳情-->
<template>
    <div class="info-pop-con">
      <div class="info-pop_tit">{{info.NAME}}</div>
      <div class="info-pop_info">
        <div>距离：{{info.juli}}千米</div>
        <div v-if="info.ADDRESS">地址：{{info.ADDRESS}}</div>
      </div>
      <div class="info-pop_btn">
        <div><img src="@/images/tem-1.png" alt=""><template v-if="simple">详 细</template><template v-else>进入地图</template></div>
        <div><img src="@/images/tem-2.png" alt="">全 景</div>
        <div><img src="@/images/tem-3.png" alt="">上传照片</div>
      </div>
      <!-- 照片 -->
      <div class="info-pop_img" v-if="!simple">

      </div>
      <div class="info-pop_btn2">
        <div><img src="@/images/tem-5.png" alt="">周边</div>
        <div><img src="@/images/tem-4.png" alt="" >纠错</div>
        <div>
          <img src="@/images/shoucang1.png" v-if="collect.guid" alt="" @click="shoucang">
          <img src="@/images/shoucang.png" v-else alt="" @click="shoucang">
          收藏
        </div>
        <div><img src="@/images/tem-8.png">评论</div>
        <div><img src="@/images/tem-7.png" @click="openLocation(info.CENTERX,info.CENTERY,info.NAME,info.ADDRESS,'')">导航</div>
      </div>
      <!-- 内容 -->
      <div class="info-pop_con" v-if="!simple">
        {{info.SUMMARY}}
      </div>
    </div>
</template>

<script>
  import Util from '@/libs/util';
  export default {
  	props:['info','simple','guid'],
    data(){
  		return {
  			propData:{
  				info:{},
          simple:true,
          guid:""
        },
        collect:{},
        ajaxUrl:{
  				collect:"/fapi/needlogin/collect/"
        }
      }
    },
    methods:{
      init(){
      	const self = this;
        Util.ajax.post(this.ajaxUrl.collect+"guid?guid="+this.guid).then(function (response) {
          if(response.data.code=100){
            self.$set(self.$data,'collect',response.data.collect);
          }else{
            self.$vux.toast.text(response.data.msg);
          }
        });
      },
      shoucang(){
      	const self = this;
      	if(this.collect){
      		Util.ajax.post(this.ajaxUrl.collect+"del?ids="+this.collect.id).then(function (response) {
            if(response.data.code==100){
            	self.$set(self.$data,'collect',{});
              self.$vux.toast.text("取消收藏成功");
            }else{
              self.$vux.toast.text(response.data.msg);
            }
          });
        }else{
      		this.collect = {
            guid:this.propData.guid,
            lng:this.propData.info.CENTERX,
            lat:this.propData.info.CENTERY,
            title:this.propData.info.NAME,
            addr:this.propData.info.ADDRESS
          }
          Util.ajax.post(this.ajaxUrl.collect+"add",this.collect).then(function (response) {
            if(response.data.code==100){
              self.$vux.toast.text("收藏成功");
            }else{
              self.$vux.toast.text(response.data.msg);
            }
          });
        }
      }
    },
    mounted(){
      if(this.info){
        this.$set(this.propData,'info',this.info);
        this.$set(this.propData,'guid',this.info.featureguid);
        this.$set(this.propData,'simple',this.simple?true:false);
        this.init();
      }else if(this.guid){
        this.$set(this.propData,'guid',this.guid);
        this.init();
      }
    }
  }
</script>
