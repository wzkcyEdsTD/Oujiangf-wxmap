<style lang="less" scoped>
	* {
		margin: 0;
		padding: 0;
	}

	html, body {
		width: 100%;
		height: 100%;
		background-color: #85d1df;
		overflow-x: scroll !important;
		overflow-y: scroll !important;
	}

	#zoom-box {
		position: absolute;
		transform: scale(0.7, 0.7);
		transform-origin: 0px 0px;
	}

	.handMap {
		width: 1100px;
		height: 1340px;
		overflow: hidden;
		margin: 0 auto;
		background: url(../../images/handMap2.jpg) 0 0 no-repeat;
		background-size: cover;
		position: relative;
		z-index: 1;
	}

	.handMap > a {
		position: absolute;
		display: block;
		width: 70px;
		height: 36px;
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0);
	}

	.handMap-copy {
		width: 100%;
		padding: 10px 0;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 5;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff;
		font-size: 14px;
		line-height: 20px;
	}

	.handMap-home, .handMap-music {
		position: fixed;
		right: 10px;
		top: 10px;
		width: 30px;
		height: 30px;
		border-radius: 15px;
		z-index: 999;
	}

	.handMap-home {
		background: url(../../images/handMap-home.png) center center no-repeat rgba(0, 0, 0, .3);
		background-size: 25px 25px;
	}

	.handMap-music {
		background: url(../../images/handMap-music.png) center center no-repeat rgba(0, 0, 0, .3);
		background-size: 25px 25px;
		top: 50px;
	}

	.handMap-music.play {
		animation: 8s linear 0s normal none infinite handMap-rotate;
		-webkit-animation: 8s linear 0s normal none infinite handMap-rotate;
	}

	@-webkit-keyframes handMap-rotate {
		from {
			-webkit-transform: rotate(0deg)
		}
		to {
			-webkit-transform: rotate(360deg)
		}
	}

	@-ms-keyframes rotate {
		from {
			-ms-transform: rotate(0deg)
		}
		to {
			-ms-transform: rotate(360deg)
		}
	}
</style>

<template>
	<div style="overflow: scroll">
		<div id="zoom-box">
			<div class="handMap">
				<div class="handMap">
					<!-- 永嘉 -->
					<a @click="ditu('b6625f1512d64c5798d8dcdbbd7dd187')"
					   style="width:130px;height:90px;top: 133px;left: 654px;" title="岩坦楠溪古韵"></a>
					<a @click="ditu('30e11b145b384e4ea704f876e7f258b5')"
					   style="width:140px;height:100px;top: 215px;left: 500px;" title="古韵楠溪游"></a>
					<a @click="ditu('7878d7a2b7244f7e9a6d5fe926ed9771')"
					   style="width: 180px;height: 27px;top: 394px;left: 584px;" title="耕读文化游"></a>
					<a @click="ditu('d8e0645aa49442e8b5529297fc1cb649')"
					   style="width:62px;height:32px;top: 293px;left: 730px;" title="岩头"></a>
					<a @click="ditu('65d91a8716b8449498f4236648285978')"
					   style="width:71px;height:30px;top:366px;left:617px;" title="大若岩"></a>
					<a @click="ditu('01474180a283446180cb067399769557')"
					   style="width:71px;height:30px;top: 254px;left: 762px;" title="鹤盛"></a>
					<a @click="ditu('0eea80ee888e46dbb0808863abc67cdb')"
					   style="width:66px;height:33px;top:433px;left:642px;" title="沙头"></a>

					<a @click="ditu('68243300573046f1826e54c17d56beb3')"
					   style="width:130px;height:113px;top:264px;left:854px;" title="雁山"></a>
					<a @click="ditu('f6bc68f0df194e7c97be2e1b95b74105')"
					   style="width:180px;height:81px;top:508px;left:689px;" title="七都"></a>
					<a @click="ditu('cab4bb2a478f4d778132ae78b24ddcc3')"
					   style="width:69px;height:39px;top:564px;left:915px;" title="大门"></a>
					<a @click="ditu('f5a2cf0aca5c459abf15d17c56309ddb')"
					   style="width:136px;height:122px;top:654px;left:871px;" title="东屏"></a>
					<a @click="ditu('e441c82e8a83440992c2e515660b5fe3')"
					   style="width:192px;height:98px;top:475px;left:449px;" title="泽雅"></a>
					<a @click="ditu('2c6f466900ca494890be5509d3315447')"
					   style="width:63px;height:40px;top:623px;left:623px;" title="丽岙"></a>
					<a @click="ditu('db4368223af142e59a22487e589061ea')"
					   style="width:106px;height:127px;top:608px;left:700px;" title="瑶溪"></a>
					<a @click="ditu('f8b63050ce3f4b7e95b7942078fb22e4')"
					   style="width:128px;height:107px;top:583px;left:230px;" title="百丈漈"></a>
					<a @click="ditu('10f3454726b34f48b990456f93184eb9')"
					   style="width:63px;height:32px;top:622px;left:373px;" title="玉壶"></a>
					<a @click="ditu('61959da403bc49dc878bbe7336a0718a')"
					   style="width:66px;height:40px;top:616px;left:469px;" title="湖岭"></a>
					<a @click="ditu('74c6769197da4a8ab696cf19fa0de998')"
					   style="width:138px;height:102px;top:703px;left:71px;" title="泰顺"></a>
					<a @click="ditu('c7e90a36c19f49b0b200795538b7da05')"
					   style="width:71px;height:33px;top:723px;left:216px;" title="西坑"></a>
					<a @click="ditu('31f14e499f51484f983455571be836dc')"
					   style="width:75px;height:39px;top:722px;left:427px;" title="平阳坑"></a>
					<a @click="ditu('4045534c05454635bb494c7c544c8c53')"
					   style="width:134px;height:112px;top:679px;left:505px;" title="曹村"></a>
					<a @click="ditu('b6384cb51eb040ccbcba3a0181353084')"
					   style="width:169px;height:88px;top:806px;left:385px;" title="南雁"></a>
					<a @click="ditu('4158c7309ace4bd39667be908307becb')"
					   style="width:61px;height:34px;top:883px;left:307px;" title="顺溪"></a>
					<a @click="ditu('68be36f869ae476a8f7521b1b016f01f')"
					   style="width:66px;height:44px;top:936px;left:360px;" title="青街"></a>
					<a @click="ditu('51ee15bf1e394043a3cfdd43c845c330')"
					   style="width:181px;height:95px;top:949px;left:533px;" title="矾都"></a>
					<a @click="ditu('7e103da9132c41dd9561b449a4961363')"
					   style="width:68px;height:44px;top:1011px;left:153px;" title="龟湖"></a>
					<a @click="ditu('8c9a53b7e7394c5ebb4116e2dccb3759')"
					   style="width:61px;height:28px;top:1066px;left:506px;" title="岱岭"></a>
					<a @click="ditu('a2e36a81377641169715da0d7f27f277')"
					   style="width:60px;height:25px;top:1098px;left:547px;" title="马站"></a>
				</div>
			</div>
		</div>
		<!--<div class="handMap-copy">温州市勘察测绘研究院</div>-->
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
				isMuiscPlay: true,
				audio: null,
				musicBtn: null,
				musicIcon: null
			}
		},
		methods: {
			MusicPlay(){
				if (this.isMuiscPlay) {
					this.audio.pause();
					this.isMuiscPlay = false;
					this.musicBtn.style.animationPlayState = "paused"
				} else {
					this.audio.play();
					this.isMuiscPlay = true;
					this.musicBtn.style.animationPlayState = "running"
				}
			},
			ditu(guid){
				localStorage.removeItem("infoItem");
				this.$router.push({name: "nongyeMap", query: {guid: guid, loadmap: 'true'}})
			}
		},
		mounted(){
			const self = this;
			self.audio = document.querySelector("#music");
			self.musicBtn = document.querySelector('#musicBtn')
			self.musicIcon = document.querySelector('#musicBtn')
			self.musicBtn.style.animationPlayState = "true"
			document.addEventListener("WeixinJSBridgeReady", function () {
				self.isMuiscPlay = true;
				self.audio.play();
			}, false);

		}
	}
</script>
