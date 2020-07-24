<template>
	<view>
		<u-navbar :is-back="true" title="会员充值"></u-navbar>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper :activeColor="activeColor" :bar-width="barWidth" ref="tabs" :height="height" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				 <!-- 余额充值开始 -->
				 <swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<view class="u-demo-area">
								<!-- <u-search v-model="value" @change="change" 
								@search="search" :shape="shape" :clearabled="clearabled" 
								:show-action="showAction" :input-align="inputAlign"></u-search> -->
								<u-form :model="form" ref="uForm">
									<u-form-item label="卡号" prop="number" :label-width="lwidth">
										<u-input type="number" v-model="form.number" />
									</u-form-item>
									<u-form-item label="电话号码" prop="tel" :label-width="lwidth">
										<u-input type="number" v-model="form.tel" />
									</u-form-item>
									<u-form-item label="充值金额" prop="money" :label-width="lwidth">
										<u-input type="number" v-model="form.money" />
									</u-form-item>
								</u-form>
								<button @tap="submit1" :style="[inputStyle1]" class="getCaptcha1">充值</button>
							</view>
						</view>
					</scroll-view>
				 </swiper-item>
				 <!-- 余额充值结束 -->
				 <!-- 开通VIP开始 -->
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<u-form :model="form1" ref="uForm">
								<u-form-item label="搜索电话" prop="tel1" :label-width="lwidth">
									<u-input type="text" v-model="form1.tel1" />
								</u-form-item>
							</u-form>
						</view>
					</scroll-view>
				 </swiper-item>
				 <!-- 开通VIP结束 -->
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lwidth: 140,
				form: {
					tel: '',
					money: '',
					num: ''
				},
				form1: {
					tel1: ''
				},
				rules: {
					tel: [
						// 必填规则
						{
							required: true,
							message: '此为必填字段',
							// blur和change事件触发检验
							trigger: ['blur', 'change'],
						},
						// 6-8个字符之间的判断
						{
							min: 1,
							max: 11,
							message: '长度在1-11个字符之间'
						},
						// 校验电话号码是否已存在
						{
							asyncValidator: (rule, value, callback) => {
								value = value.trim();
								// this.$u.get('/api/addMember'+'?name='+value).then(res => {
									this.$u.post('/api/EmployeeSwaggerController/memberDetailed',{tel: value}).then(res => {
									if(res.error) {
										callback(new Error('数据获取出错'));
									} else {
										if (!res[0]) {
											console.log(res)
										} else {
											if (res[0].tel == value) {
												// 如果校验通过，也要执行callback()回调
												callback(new Error('电话号码重复'));
											}
										}
									}
								})
							},
							// 如果是异步校验，无需写message属性，错误的信息通过Error抛出即可
							// message: 'xxx'
						}
					],
				},
				value: '',
				shape: 'round',
				clearabled: true,
				showAction: true,
				inputAlign: 'left',
				orderList: [[], []],
				memberList: [],
				list: [
					{
						name: '余额充值'
					},
					{
						name: '礼品兑换'
					}
				],
				current: 0,
				height: 110,
				barWidth: 70,
				activeColor: "#387e96",
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0
			};
		},
		computed: {
			inputStyle1() {
				let style = {};
				if(this.form.tel && this.form.money) {
					style.color = "#fff";
					style.backgroundColor = "#ff9fa4";
					style.bottom = "400rpx";
					style.left = "500rpx";
					style.width = "120rpx";
					style.height = "120rpx";
					style.lineHeight = "120rpx";
					style.borderRadius = "50%"
				}
				return style;
			}
		},
		methods: {
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
			},
			transition({ detail: { dx } }) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({ detail: { current } }) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			submit1() {
				this.form.number = this.form.number.trim();
				this.form.tel = this.form.tel.trim();
				this.form.money = this.form.money.trim();
				// this.name && this.pwd && this.sex && this.tel && this.idcard && this.userId
				if(this.form.number && this.form.tel && this.form.money) {
					this.$u.post('/api/EmployeeSwaggerController/updateMemberByUserId',this.form).then(res => {
						if(res.error) {
							
						} else {
							console.log('成功')
							this.form.number = '';
							this.form.tel = '';
							this.form.money = '';
						}
					})
				}
			},
		},
		mounted () {
			uni.request({
				method: "post",
				// method: "get",
				url: "/api/EmployeeSwaggerController/allMember",
				// url: "/api/addMember",
				header: {
					'Content-Type': 'application/json',
					'token':uni.getStorageSync("token")
				},
				success: (res) => {
					console.log(res);
					// this.memberList = res.data
				},
				fail:(err)=>{
					console.log(err)
				}
			});
		}
	}
</script>

<style>
/* #ifndef H5 */
page {
	height: 100%;
	/* background-color: #f2f2f2; */
	background-color: #FFFFFF;
}
/* #endif */
</style>

<style scoped lang="scss">
	.u-form-item {
			width: 98%;
			margin-left: 1%;
		}
		.getCaptcha1 {
			// background-color: rgb(253, 243, 208);add8e6
			position: fixed;
			bottom: 200rpx;
			left: 50rpx;
			width: 120rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #fdbcc1;
			color: #a8e1db;
			// color: $u-tips-color;
			border: none;
			font-size: 32rpx;
			// padding: 12rpx 0;
			margin-top: 80rpx;
			
			&::after {
				border: none;
			}
		}
		.wrap {
				padding: 24rpx;
		}
		
		.u-tabs-box {
			margin: 30rpx 0;
		}
	
		.u-row {
			margin: 40rpx 0;
			height: 60rpx;
			line-height: 60rpx;
		}
	
		.demo-layout {
			border-radius: 8rpx;
		}
		
		.u-td {
			font-size: 20rpx;
		}
		
		.order {
			width: 710rpx;
			background-color: #ffffff;
			margin: 20rpx auto;
			box-sizing: border-box;
			padding: 20rpx;
			font-size: 28rpx;
			.top {
				display: flex;
				justify-content: space-between;
				.left {
					display: flex;
					align-items: center;
					.store {
						margin: 0 10rpx;
						font-size: 32rpx;
						font-weight: bold;
					}
				}
				.right {
					color: $u-type-warning-dark;
				}
			}
			.item {
				display: flex;
				margin: 20rpx 0 0;
				.left {
					margin-right: 20rpx;
					image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 10rpx;
					}
				}
				.content {
					.title {
						font-size: 28rpx;
						line-height: 50rpx;
					}
					.type {
						margin: 10rpx 0;
						font-size: 24rpx;
						color: $u-tips-color;
					}
					.delivery-time {
						color: #e5d001;
						font-size: 24rpx;
					}
				}
				.right {
					margin-left: 10rpx;
					padding-top: 20rpx;
					text-align: right;
					.decimal {
						font-size: 24rpx;
						margin-top: 4rpx;
					}
					.number {
						color: $u-tips-color;
						font-size: 24rpx;
					}
				}
			}
			.total {
				margin-top: 20rpx;
				text-align: right;
				font-size: 24rpx;
				.total-price {
					font-size: 32rpx;
				}
			}
			.bottom {
				display: flex;
				margin-top: 40rpx;
				padding: 0 10rpx;
				justify-content: space-between;
				align-items: center;
				.btn {
					line-height: 52rpx;
					width: 160rpx;
					border-radius: 26rpx;
					border: 2rpx solid $u-border-color;
					font-size: 26rpx;
					text-align: center;
					color: $u-type-info-dark;
				}
				.evaluate {
					color: $u-type-warning-dark;
					border-color: $u-type-warning-dark;
				}
			}
		}
		.centre {
			text-align: center;
			margin: 200rpx auto;
			font-size: 32rpx;
			image {
				width: 164rpx;
				height: 164rpx;
				border-radius: 50%;
				margin-bottom: 20rpx;
			}
			.tips {
				font-size: 24rpx;
				color: #999999;
				margin-top: 20rpx;
			}
			.btn {
				margin: 80rpx auto;
				width: 200rpx;
				border-radius: 32rpx;
				line-height: 64rpx;
				color: #ffffff;
				font-size: 26rpx;
				background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
			}
		}
		.wrap {
			display: flex;
			flex-direction: column;
			height: calc(100vh - var(--window-top));
			width: 100%;
		}
		.swiper-box {
			flex: 1;
		}
		.swiper-item {
			height: 100%;
			margin-top: 40rpx;
			.u-demo-area {
				width: 80%;
				margin-left: 10%;
			}
		}
</style>
