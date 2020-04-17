<style lang="less" scoped>
  *{margin: 0;padding: 0;}
  html,body{
    width:100%;
    height:100%;
    background-color:#85d1df;
    overflow-x: scroll !important;
    overflow-y: scroll !important;
  }
  #zoom-box{
    position: absolute;
    transform:scale(0.7,0.7);
    transform-origin: 0px 0px;
  }
  .handMap{
    width: 1100px;
    height: 1338px;
    overflow: hidden;
    margin: 0 auto;
    background:url(../../images/handMap1110.jpg) 0 0 no-repeat;
    background-size:cover;
    position: relative;
    z-index: 1;
  }
  .handMap>a{
    position: absolute;
    display: block;
    width: 70px;height: 36px;
    border-radius:4px;
    background-color: rgba(0,0,0,0);
  }
  .handMap-copy{
    width:100%;height:40px;padding: 10px 0;
    position:fixed;left:0;right:0;bottom:0;
    z-index:5;text-align: center;
    background-color:rgba(0,0,0,0.2);
    color:#fff;font-size: 14px;
    line-height: 20px;
  }
  .handMap-home,.handMap-music{
    position:fixed;
    right: 10px;top: 10px;
    width: 30px;height:30px;
    border-radius: 15px;
    z-index: 999;
  }
  .handMap-home{
    background: url(../../images/handMap-home.png) center center no-repeat rgba(0,0,0,.3);
    background-size: 25px 25px;
  }
  .handMap-music{
    background: url(../../images/handMap-music.png) center center no-repeat rgba(0,0,0,.3);
    background-size: 25px 25px;top: 50px;
  }
  .handMap-music.play{
    animation: 8s linear 0s normal none infinite handMap-rotate;
    -webkit-animation:8s linear 0s normal none infinite handMap-rotate;
  }
  @-webkit-keyframes handMap-rotate{
    from{-webkit-transform:rotate(0deg)}
    to{-webkit-transform:rotate(360deg)}
  }
  @-ms-keyframes rotate{
    from{-ms-transform:rotate(0deg)}
    to{-ms-transform:rotate(360deg)}
  }
</style>

<template>
  <div style="overflow: scroll">
    <div id="zoom-box">
      <div class="handMap">
        <div class="handMap">
          <a @click="ditu('134ebae06a2a4e55a715dbc0c6bbb567')" style="width:103px;height:34px;top: 328px;left: 602px;" title="黄南林坑"></a>
          <a @click="ditu('c4600ad0e74946d2842b1b1cee68490a')" style="width: 103px;height: 34px;top: 391px;left: 221px;" title="罗垟"></a>
          <a @click="ditu('6cc75fb69dcc4082afaecc3f4e1e277e')"
             style="width: 68px;height: 33px;top: 559px;left: 565px;" title="苍坡"></a>
          <a @click="ditu('74f0cb198b0e4b928baf1e10aab2bc04')"
             style="width:114px;height:79px;top: 718px;left: 791px;" title="龙湾潭"></a>
          <a @click="ditu('32a13250c3464277aaed9784acdb9742')"
             style="width:92px;height:35px;top: 716px;left: 379px;" title="水云"></a>
          <a @click="ditu('bb2edec7782449509667a4e34fbb3e97')"
             style="width: 84px;height: 33px;top: 758px;left:638px;" title="下日川"></a>
          <a @click="ditu('2f2b88eea4d24d809facd634d07765ed')"
             style="width: 67px;height: 33px;top: 849px;left: 739px;" title="花坦"></a>
          <a @click="ditu('6e70bac86ddb4d4584835c7db53b7194')"
             style="width:90px;height:44px;top: 1090px;left: 622px;" title="龙下"></a>
          <a @click="ditu('01474180a283446180cb067399769557')"
             style="width:70px;height:33px;top: 600px;left: 752px;" title="鹤盛"></a>
          <a @click="ditu('00673e93a657464697f2a88e80a2c5b9')"
             style="width:66px;height:33px;top: 808px;left: 791px;" title="廊下"></a>
          <a @click="ditu('ab8bec98b15c45c3896f2c8f525f9827')"
             style="width:82px;height:39px;top: 991px;left: 415px;" title="坦头"></a>
          <a @click="ditu('6b67497d2a3143208c6bf05dc67cd33f')"
             style="width:126px;height:81px;top: 765px;left: 226px;" title="茗岙"></a>
          <a @click="ditu('d8e0645aa49442e8b5529297fc1cb649')"
             style="width:62px;height:32px;top: 675px;left: 625px;" title="岩头"></a>
          <a @click="ditu('b6625f1512d64c5798d8dcdbbd7dd187')"
             style="width:123px;height:117px;top: 374px;left: 571px;" title="岩坦楠溪古韵"></a>
          <a @click="ditu('7878d7a2b7244f7e9a6d5fe926ed9771')"
             style="width: 128px;height: 89px;top: 797px;left: 590px;" title="耕读文化游"></a>
          <a @click="ditu('30e11b145b384e4ea704f876e7f258b5')"
             style="width:135px;height:74px;top: 596px;left: 585px;" title="古韵楠溪游"></a>
          <a @click="ditu('3615c090124a44ff9770cfa929ac5109')"
             style="width: 91px;height: 41px;top: 427px;left: 333px;" title="岩龙"></a>
          <a @click="ditu('9749351a09f34078ac8075ede6aa3648')"
             style="width: 83px;height: 38px;top: 401px;left: 456px;" title="深龙"></a>
          <a @click="ditu('f16fb5e154dc4fe29bf44e605ddea88e')"
             style="width: 117px;height: 77px;top: 334px;left: 705px;" title="四海山"></a>
          <a @click="ditu('4750427f91c8413abc59f487f43ebdfb')"
             style="width: 68px;height: 34px;top: 635px;left: 726px;" title="蓬溪"></a>
          <a @click="ditu('fb3c699531254829a6a405b4ef3d06a3')"
             style="width: 72px;height: 31px;top: 620px;left: 899px;" title="岩上"></a>
          <a @click="ditu('1537d0e832534bd295eaf1ae35304bf6')"
             style="width:104px;height:81px;top: 635px;left: 794px;" title="石桅岩"></a>
          <a @click="ditu('bbc36abfb44e4787abe95e5f2fb32fe5')"
             style="width:68px;height:34px;top: 688px;left: 708px;" title="枫林"></a>
          <a @click="ditu('d17e4df32de640df9224ac452f0835b4')"
             style="width: 68px;height: 33px;top: 708px;left: 602px;" title="芙蓉"></a>
          <a @click="ditu('a2e6eb15e3f64a0cbd18d3770dc11c48')"
             style="width: 87px;height: 33px;top: 684px;left:471px;" title="大元下"></a>
          <a @click="ditu('65d91a8716b8449498f4236648285978')"
             style="width:69px;height:38px;top:779px;left:441px;" title="大若岩"></a>
          <a @click="ditu('73cf9ad447194df5908289e72de649bd')"
             style="width: 76px;height: 31px;top: 746px;left: 514px;" title="埭头"></a>
          <a @click="ditu('7e8aadf9ce9843fa897dc526e655e6c3')"
             style="width:70px;height:32px;top: 826px;left: 517px;" title="豫樟"></a>
          <a @click="ditu('0cb40f4b5b554f50af133c941236c016')"
             style="width:70px;height:31px;top: 894px;left: 623px;" title="渔田"></a>
          <a @click="ditu('0eea80ee888e46dbb0808863abc67cdb')"
             style="width:66px;height:33px;top:933px;left:659px;" title="沙头"></a>
        </div>
      </div>
    </div>
    <div class="handMap-copy">温州市农业农村局<br>温州市勘察测绘研究院</div>
    <a href="/#/nongye" class="handMap-home"></a>
    <a class="handMap-music play" id="musicBtn" @click="MusicPlay()"></a>
    <audio src="/audio/music.mp3" autoplay="autoplay" loop="loop" id="music"></audio>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  export default {
    data(){
      return {
        isMuiscPlay:true,
        audio:null,
        musicBtn:null,
        musicIcon:null
      }
    },
    methods:{
      MusicPlay(){
        if(this.isMuiscPlay){
          this.audio.pause();
          this.isMuiscPlay=false;
          this.musicBtn.style.animationPlayState="paused"
        }else{
          this.audio.play();
          this.isMuiscPlay=true;
          this.musicBtn.style.animationPlayState="running"
        }
      },
      ditu(guid){
      	localStorage.removeItem("infoItem");
        this.$router.push({name:"nongyeMap",query:{guid:guid,loadmap:'true'}})
      }
    },
    mounted(){
      const self = this;
      self.audio=document.querySelector("#music");
      self.musicBtn=document.querySelector('#musicBtn')
      self.musicIcon=document.querySelector('#musicBtn')
      self.musicBtn.style.animationPlayState="true"
      document.addEventListener("WeixinJSBridgeReady",function(){
        self.isMuiscPlay=true;
        self.audio.play();
      },false);

    }
  }
</script>
