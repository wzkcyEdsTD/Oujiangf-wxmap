<style lang="less" scoped>
  .zhuanti-list{
    display: flex;
    height:100%;width:100%;
    overflow: hidden;
    box-sizing: border-box;
    padding-top:36px;
  }
</style>

<template>
  <div style="position: relative; height:100%;width:100%;">
    <img src="@/images/close.png" @click="closePop" style="width:20px;position:absolute;top:10px;right:10px;" alt="">
    <div class="zhuanti-list">
      <!-- 左侧 -->
      <div class="z-left" style="width:100px;background:#f3f3f3;height: 100%;overflow: auto;border-top:1px solid #ddd;" >
        <div v-for="(i,idx) in dataList" v-if="i.state!=0"
             style="padding:10px 0;text-align: center;border-bottom:1px solid #ddd;"
             :style="{'background':i.id==dataOn.id?'#fff':''}"
             @click="dataOn=i;rightData=i.children;">
          {{i.name}}
        </div>
      </div>
      <!-- 右侧 -->
      <div class="z-right" style="flex:1;border-top:1px solid #ddd;height:100%;overflow: auto;">
        <div v-for="i in rightData" v-if="i.state!=0"
             style="padding: 10px;border-bottom:1px solid #eee;" @click="zhuantiDetail(i)">{{i.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  export default {
    data(){
      return {
        dataList:[],
        dataOn:{},
        rightData:[]
      }
    },
    methods:{
      init(){
        const self = this;
        Util.ajax.post('/fapi/public/option/zt').then(function (response) {
          if(response.data && response.data.length){
            const d = Util.jsonToTree(response.data);
            self.$set(self.$data,'dataList',d);
            let found = false;
            d.forEach(function (item) {
              if(item.state!=0 && !found){
              	found = true;
                self.$set(self.$data,'dataOn',item);
                self.$set(self.$data,'rightData',item.children);
              	return;
              }
            });
          }
        });
      },
      closePop(){
        this.$emit('closePop');
      },
      zhuantiDetail(i){
        //console.log(i);
        this.rightData.forEach(function (data) {
          data.iszhuanti = true;
        });
        this.$emit('zhuantiDetail',i,this.rightData);
      }
    },
    mounted(){
      /*const self = this;
      Util.title('专题列表');
      var state = {
        title: "title",
        url: location.href
      };
      window.history.pushState(state, "title", location.href);
      window.addEventListener("popstate", function (e) {
        pushHistory();
      }, false);
      function pushHistory() {
        self.closePop();
      }*/
      this.init();
    }
  }
</script>
