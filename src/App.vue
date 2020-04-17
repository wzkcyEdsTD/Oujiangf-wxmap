<template>
	<div style="height:100%;position: relative;" id="tContainer">
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template>
<script>
	//import esriLoader from 'esri-loader';
	//import {Pointx, Pointy, dojoConfig, ESRI_URL, ARCGIS_SERVICE_HOST, WZKCY_ServerConfig} from '@/components/libs/tianditu/config';
	import Util from '@/libs/util';
	export default {
		name: 'app',
		components: {},
		data () {
			return {}
		},
		methods: {},
		created(){
			if (Util.isIOS()) {
				const wx = this.$wechat;
				const param = new URLSearchParams();
                param.append('url', window.location.href.split('#')[0]);
      			param.append("token", window.localStorage.getItem("token"));
		      	Util.ajax.post("http://115.223.34.189:8099/xypt/wx/getsign", param).then(function (data) {
			        wx.config({
			          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			          appId: 'wx7eeb4eea87cf3ce6', // 必填，公众号的唯一标识
			          timestamp: data.data.timestamp, // 必填，生成签名的时间戳
			          nonceStr: data.data.noncestr, // 必填，生成签名的随机串
			          signature: data.data.signature,// 必填，签名
			          jsApiList: ['getLocation','openLocation','previewImage'
			            ,'updateAppMessageShareData','updateTimelineShareData'
			            ,'onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表
			        });
		      	});
			}
		},
		mounted () {
			var tips = localStorage.getItem('tdtTip');
			const self = this;
			var str= navigator.userAgent.toLowerCase();
			var ver=str.match(/cpu iphone os (.*?) like mac os/);
			console.log(str);
			if(!ver){
				ver = str.match(/android (.*?);/);
				console.log(ver[1]);
				var version = Number(ver[1].replace(" ",""));
				console.log(version);
				if(version<7){
					console.log(version);
					alertTips();
				}
			}else{
				var version = Number(ver[1].replace(/_/g,"."));
				if(version<12){
					alertTips(true);
				}
			}
			function alertTips(isIOS) {
				if(!tips){
					self.$vux.alert.show({
						title: '温馨提示',
						buttonText:'关闭',
						content: '使用'+(isIOS?'苹果 iOS 12.0 以下系统':'Android 7.0 以下系统')+'的设备，运行地图可能存在异常，为了更好的使用体验，请升级到最新系统版本',
						onHide () {
							localStorage.setItem('tdtTip','1');
						}
					})
				}
			}
			if (Util.isIOS()) {
				jQuery(document).delegate('select', 'change', function(){

					setTimeout(function(){

						// did not work for me straight away without a small timeout ಠ_ಠ

						jQuery('html').animate({height: '100.1vh'}, 100, function(){

							// did not work for me with just one instruction with 100vh  ಠ_ಠ

							// the easing smooth doesn't work all the time properly ಠ_ಠ

							jQuery(this).animate({height: '100vh'}, 1);

						});
					},100);
				});
				jQuery(document).delegate('input, textarea', 'blur', function(){

					setTimeout(function(){

						// did not work for me straight away without a small timeout ಠ_ಠ

						jQuery('html').animate({height: '100.1vh'}, 100, function(){

							// did not work for me with just one instruction with 100vh  ಠ_ಠ

							// the easing smooth doesn't work all the time properly ಠ_ಠ

							jQuery(this).animate({height: '100vh'}, 1);

						});
					},100);
				});
			}
		}
	}
</script>

<style lang="less">
	@import './images/weui.min.less';
	@import '~vux/src/styles/reset.less';
	@import './styles/public.less';
	@import './images/css.less';

	body, html {
		background: #fff;
		width: 100%;
		height: 100%;
		font-size: 14px;
	}

	.weui-dialog{
		z-index:9999 !important;
	}

</style>
