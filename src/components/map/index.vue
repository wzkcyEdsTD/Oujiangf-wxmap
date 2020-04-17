<style lang="less" scoped>
  .tmap-show {
    color: #333;
    font-size: 12px;

    .tmap-show-tit {
      background: #f7f7f7;
      color: #7a7a7a;
      padding: 5px 10px;
      font-size: 14px;

      a {
        float: right;
        color: @theme-color
      }
    }

    .tmap-show-con {
      padding: 10px;
      overflow: hidden;
      text-align: center;

      > div {
        width: 33%;
        float: left;
        margin-bottom: 10px;
      }

      &.dituqiehuan {
        > div {
          padding: 0 5px;
          box-sizing: border-box;
          margin-bottom: 0;

          &.on img {
            border: 2px solid @theme-color
          }
        }

        img {
          box-sizing: border-box;
          border-radius: 5px;
        }
      }

      &.zhutiditu {
        img {
          width: 50%;
        }
      }

      .on {
        color: @theme-color;
      }
    }
  }

  .zhutiditu {
    .on {
      color: @theme-color;

      img {
        box-sizing: border-box;
        border: 2px solid @theme-color;
        border-radius: 50%;
      }
    }
  }
</style>

<template>
  <div class="tmap-show">
    <div class="tmap-show-con dituqiehuan">
      <div :class="ditutype==1?'on':''" @click="changeditu(1)">
        <img src="@/images/z1.png" alt="">
        <div>矢量图</div>
      </div>
      <div :class="ditutype==2?'on':''" @click="changeditu(2)">
        <img src="@/images/z2.png" alt="">
        <div>影像图</div>
      </div>
      <div :class="ditutype==3?'on':''" @click="changeditu(3)">
        <img src="@/images/z3.png" alt="">
        <div>2.5维图</div>
      </div>
    </div>
    <!-- <div class="tmap-show-tit">专题数据</div> -->
    <!-- 信用停车项目跳转到信用地图此处的字样需要修改 (原版是上一行) -->
    <div class="tmap-show-tit">应用场景分布</div>
    <div class="tmap-show-con zhutiditu" id="zhuantiData">
      <div v-for="(item,index) in list" :class="ditutype==item.index?'on':''" @click="zhuantiDetail(item,index)">
        <img :src="item.pic" alt="" style="width: 50px">
        <div>{{item.tag}}</div>
      </div>
    </div>

    <!--    <div class="tmap-show-tit">主题地图</div>
        <div class="tmap-show-con zhutiditu">
          <div :class="ditutype==4?'on':''" @click="changezhuanti(4,'简约版')">
            <img src="@/images/z4.png" alt="">
            <div>简约风</div>
          </div>
          <div :class="ditutype==5?'on':''" @click="changezhuanti(5,'大数据')">
            <img src="@/images/z5.png" alt="">
            <div>大数据</div>
          </div>
          <div :class="ditutype==6?'on':''" @click="changezhuanti(6,'行政区划')">
            <img src="@/images/z6.png" alt="">
            <div>行政区划</div>
          </div>
          &lt;!&ndash;&ndash;&gt;
          <div style="height:1px;width:100%;overflow:hidden;margin:0;"></div>
          <div :class="ditutype==7?'on':''" @click="changezhuanti(7,'园林绿化')">
            <img src="@/images/z7.png" alt="">
            <div>园林绿化</div>
          </div>
          <div :class="ditutype==8?'on':''" @click="changezhuanti(8,'农业旅游')">
            <img src="@/images/z8.png" alt="">
            <div>休闲旅游</div>
          </div>
        <div :class="ditutype==17?'on':''" @click="changezhuanti(17,'建成区')">
          <img src="@/images/z9.png" alt="">
          <div>建成区</div>
        </div>
          &lt;!&ndash;<div :class="ditutype==16?'on':''" @click="changezhuanti(16,'3D')">
            <img src="@/images/z4.png" alt="">
            <div>3D俯视</div>
          </div>&ndash;&gt;
        </div>
        <div class="tmap-show-tit">历史变迁</div>
        <div class="tmap-show-con">
          <div :class="ditutype==9?'on':''" @click="hisChange(9,60)">60年代</div>
          <div :class="ditutype==10?'on':''" @click="hisChange(10,70)">70年代</div>
          <div :class="ditutype==11?'on':''" @click="hisChange(11,2000)">2000年</div>
          <div :class="ditutype==12?'on':''" @click="hisChange(12,2005)">2005年</div>
          <div :class="ditutype==13?'on':''" @click="hisChange(13,2012)">2012年</div>
          <div :class="ditutype==14?'on':''" @click="hisChange(14,2014)">2014年</div>
          <div :class="ditutype==15?'on':''" @click="hisChange(15,2017)">2017年</div>
          <div :class="ditutype==16?'on':''" @click="hisChange(16,2018)">2018年</div>
        </div>
        <div class="tmap-show-tit">专题数据 <a @click="zhuantiMore">更多</a></div>
        <div class="tmap-show-con" id="zhuantiData">
          <div v-for="(i,idx2) in zhuantiData" :class="zhuantiIdx==idx2?'on':''" @click="zhuantiDetail(i,idx2)">{{i.name}}</div>
        </div>-->
  </div>
</template>

<script>
    import Util from '@/libs/util';

    export default {
        props: [],
        data() {
            return {
                ditutype: 1,//地图
                zhuantiData: [],
                dituload: false,
                zhuantiIdx: -1,
                list: [
                    //https://ojf.wzmap.gov.cn:6443/arcgis/rest/services/XYDT/XYDT/MapServer/0
                    {
                        index: 4,
                        tag: '借阅',
                        serviceurl: 'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/1',
                        pic: require('@/images/1.png')
                    },
                    // {index:5,tag:'医疗',serviceurl:'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/0',pic:require('@/images/2.png')},
                    {index: 5, tag: '医疗', serviceurl: '暂无', pic: require('@/images/2.png')},
                    {
                        index: 6,
                        tag: '停车',
                        serviceurl: 'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/2',
                        pic: require('@/images/3.png')
                    },
                    {index: 7, tag: '租房', serviceurl: '暂无', pic: require('@/images/4.png')},
                    {index: 8, tag: '健身', serviceurl: '暂无', pic: require('@/images/5.png')},
                    {
                        index: 9,
                        tag: '旅游',
                        serviceurl: 'http://117.149.227.46:6080/arcgis/rest/services/XYDT/XYDT/MapServer/3',
                        pic: require('@/images/6.png')
                    },
                    {index: 10, tag: '出行', serviceurl: '暂无', pic: require('@/images/7.png')},
                    {index: 11, tag: '更多', serviceurl: '暂无', pic: require('@/images/8.png')},

                ]
            }
        },
        methods: {
            clearZt() {
                this.zhuantiIdx = -1;
            },
            changeditu(type) {
                if (this.dituload) {
                    this.$vux.toast.text('请不要频繁切换地图，等待3秒后重试');
                    return;
                }
                $("#xingzhengquhua").remove();
                const self = this;
                this.dituload = true;
                this.ditutype = type;
                this.$emit('dituChange', type);
                setTimeout(function () {
                    self.dituload = false;
                }, 3500)
            },
            changezhuanti(type, value) {
                if (this.dituload) {
                    this.$vux.toast.text('请不要频繁切换地图，等待3秒后重试');
                    return;
                }
                const self = this;
                this.dituload = true;
                this.ditutype = type;
                this.$emit('zhuantiDetail', value);
                setTimeout(function () {
                    self.dituload = false;
                }, 3500)
            },
            hisChange(type, value) {
                if (this.dituload) {
                    this.$vux.toast.text('请不要频繁切换地图，等待3秒后重试');
                    return;
                }
                $("#xingzhengquhua").remove();
                const self = this;
                this.dituload = true;
                this.ditutype = type;
                this.$emit('hisChange', value);
                setTimeout(function () {
                    self.dituload = false;
                }, 3500)
            },
            init() {
                //专题数据
                const self = this;
                Util.ajax.post('/fapi/public/option/ztlb').then(function (response) {
                    console.log(response)
                    if (response.data) {
                        response.data.forEach(function (item) {
                            self.$set(item, 'iszhuanti', true);
                        });
                        self.$set(self.$data, 'zhuantiData', response.data);
                    }
                });
            },
            zhuantiDetail(i, idx) {
                console.log(i)
                console.log(idx)
                this.zhuantiIdx = idx;
                if(i.tag !== '停车'){
                    this.zhuantiData.tag = '1=1'
                }
                console.log(i, this.zhuantiData)
                this.$emit('zhuantiDetail', i, this.zhuantiData);
            },
            zhuantiMore() {
                this.$emit('zhuantiMore');
            }
        },
        mounted() {
            this.init();
        }
    }
</script>
