<!--发送验证码按钮组件-->
<template>
  <div class="weui-vcode-btn" @click='sendcode'>{{msg}}</div>
  <!--<x-button type="primary" mini @click.native='sendcode'>{{msg}}</x-button>-->
</template>

<script>
  import Util from '@/libs/util';
  export default {
    data:function () {
      return {
        second:120,
        msg:"发送验证码",
        timeout:undefined,
        state:true
      }
    },
    props:['phone','sendurl'],
    methods:{
      sendcode () {
        //测试填写
      	/*this.devT();
      	return;*/

        const self = this;
        if(this.state){
        	if(this.checkPhone()){
            Util.ajax.post(this.sendurl+"?phone="+this.phone).then(function (response) {
              if(response.data.code=="100"){
                self.$vux.toast.text("发送成功");
                self.state = false;
                //发送成功冒泡
                self.$emit("sendSuccess",response.data);
                self.waitsend();
              }else{
                self.$vux.toast.show({text:response.data.msg,type:'cancel'});
              }
            });
          }else{
            self.$vux.toast.show({text:"请输入正确的手机号",type:'cancel'});
          }
        }else{
          self.$vux.toast.show({text:"请不要频繁点击发送",type:'cancel'});
        }
      },
      devT(){
      	this.$vux.toast.text('测试中不发送验证码，请随意填写','middle');
      },
      waitsend () {
        if(this.second>0){
          this.second--;
          this.msg=this.second+"秒后重试";
          var self=this;
          this.timeout = setTimeout(function(){
            self.waitsend();
          },1000);
        }else{
          this.second=60;
          this.msg="发送验证码";
          this.state=true;
        }
      },
      checkPhone () {
        return /1\d{10}/.test(this.phone);
      }
    }
  }
</script>
