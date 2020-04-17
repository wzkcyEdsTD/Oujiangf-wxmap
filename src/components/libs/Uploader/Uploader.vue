<template>
  <div>
    <!--Gallery预览-->
    <div class="weui-gallery" v-if="gallery.show">
      <span @click="gallery.show=false" class="weui-gallery__img" :style="'background-image:url('+gallery.pic.dataurl+')'"></span>
      <!-- path -->
      <div class="weui-gallery__opr">
        <a href="javascript:" class="weui-gallery__del" @click="deleteP(0)">
          <i class="weui-icon-delete weui-icon_gallery-delete"></i>
        </a>
      </div>
    </div>

    <div class="weui-cell" style="background: #fff">
      <div class="weui-cell__bd">
        <div class="weui-uploader">
          <div class="weui-uploader__bd">
            <ul class="weui-uploader__files" style="float:left">
              <!-- 图片列表 -->
              <template v-if="imgList.length">
                <!-- 点击预览 -->
                <li @click="galleryShow(item,idx)"
                    class="weui-uploader__file" v-for="(item,idx) in imgList"
                    :style="'background-image:url('+item.dataurl+')'" >
                  <img src="@/images/close.png" @click="deleteP(item.id)"
                       style="position:absolute;width:12px;height:12px;right:-6px;top:-6px;">
                </li><!-- path -->
              </template>
            </ul>
            <div class="weui-uploader__input-box">
              <input id="uploaderInput" class="weui-uploader__input" name="images1" type="file" accept="image/*"
                     @change="update" @click="check">
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Util from '@/libs/util';
  //import {} from 'vux';
  export default {
  	name:"Uploader",
    props:['maxUpload'],
    data(){
  		return {
  			imgList:[],
        gallery:{
  				show:false,
          pic:{},
          idx:0
        }
      }
    },
    methods:{
    	check(e){
        if(this.maxUpload && this.maxUpload>0){
          if(this.imgList.length>=this.maxUpload){
            this.$vux.alert.show('您只能上传'+this.maxUpload+'张图片');
            e.preventDefault();
            return false;
          }
        }
      },
      update(e){
      	const self = this;
      	let url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
        let file = e.target.files[0];
        let param = new FormData();
        param.append('file',file);
        let config = {
          headers:{'Content-Type':'multipart/form-data','wxscToken':this.$store.getters.wxscToken}
        }; //添加请求头
        this.$vux.loading.show('图片上传中');
        Util.ajax.post('/fapi/needlogin/upload/uploadImg',param,config)
        .then(response=>{
        	self.$vux.loading.hide();
        	if(response.data.code==100){
        		self.$set(response.data.pic,'dataurl',url.createObjectURL(file));
            self.imgList.push(response.data.pic);
            self.$emit('uploadSuccess',self.imgList);
          }else{
        		self.$vux.alert.show(response.data.msg);
          }
        })
      },
      //预览
      galleryShow(item,idx){
      	this.gallery.show=true;
      	this.gallery.pic=item;
      	this.gallery.idx=idx;
      },
      //删除图片
      deleteP(i){
      	const self = this;
      	console.log(i);
      	let id = self.gallery.pic.id;
      	if(i){
      		id = i;
        }
        self.$vux.loading.show('删除图片中');
        Util.ajax.post('/fapi/needlogin/upload/delPic?picId='+id).then(function (response) {
          self.$vux.loading.hide();
          if(response.data.code==100){
            self.imgList.splice(self.gallery.idx,1);
            self.gallery.show=false;
            self.gallery.pic={};
            self.gallery.idx=0;
          }else{
            self.$vux.alert.show(response.data.msg);
          }
        });
      },
      //清空
      clearImgList(){
      	this.$set(this.$data,'imgList',[]);
      },
      getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");  // 可选其他值 image/jpeg
        return dataURL;
      }
    },
    mounted(){

    }
  }
</script>

<style lang="less" scoped>
  .weui-cell{
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .weui-uploader__bd {
    margin-bottom: -4px;
    margin-right: -9px;
    overflow: visible;
  }
  .weui-uploader__files {
    list-style: none;
  }
  .weui-uploader__file {
    float: left;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 49px;
    height: 49px;
    background: no-repeat 50%;
    background-size: cover;
    position: relative;
  }
  .weui-uploader__input-box {
    float: left;
    position: relative;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 47px;
    height: 47px;
    border: 1px solid #d9d9d9;
  }
  .weui-uploader__input-box:before {
    width: 2px;
    height: 39.5px;
  }
  .weui-uploader__input-box:after, .weui-uploader__input-box:before {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    background-color: #d9d9d9;
  }
  .weui-uploader__input-box:after {
    width: 39.5px;
    height: 2px;
  }
  .weui-uploader__input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  .weui-gallery {
    position: fixed;
    display: block;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    z-index: 1000;
    width:100%;
    height:100%;
  }
  .weui-gallery__img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 60px;
    left: 0;
    background: 50% no-repeat;
    background-size: contain;
  }
  .weui-gallery__opr {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #0d0d0d;
    color: #fff;
    line-height: 60px;
    text-align: center;
  }
  .weui-gallery__del {
    display: block;
  }
</style>
