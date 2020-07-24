<template>
	<view class="wrap">
		<u-navbar :is-back="true" title="注册会员"></u-navbar>
		<view class="top">
			<u-top-tips ref="uTips"></u-top-tips>
		</view>
		<view class="content">
			<u-form :model="form" ref="uForm">
				<u-form-item label="姓名" prop="name">
					<u-input type="text" v-model="form.name" />
				</u-form-item>
				<u-form-item label="密码" prop="password">
					<u-input type="text" v-model="form.password" />
				</u-form-item>
				<u-form-item label="性别">
					<!-- <u-input v-model="form.sex" type="select" /> -->
					<u-input v-model="value1" :type="type1" :border="border1" @click="show1 = true" />
					<u-action-sheet :list="actionSheetList" v-model="show1" @click="actionSheetCallback"></u-action-sheet>
				</u-form-item>
				<u-form-item label="手机号码" prop="tel">
					<u-input type="number" v-model="form.tel" />
				</u-form-item>
				<u-form-item label="身份证号" prop="idCard">
					<u-input type="number" v-model="form.id_card" />
				</u-form-item>
			</u-form>
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">注册</button>
		</view>
		<view class="buttom">
			<view class="head_word">
				<u-row gutter="16">
					<u-col span="48">
						<view class="demo-layout">
							
						</view>
					</u-col>
					<u-col span="4">
						<view class="demo-layout">
							<u-icon @click="goindex" name="home" color="#387e96" size="50"></u-icon>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				// index: '',
				value1: '',
				type1: 'select',
				show1: false,
				border1: false,
				actionSheetList: [
					{
						text: '男'
					},
					{
						text: '女'
					}
				],
				memberList: [],
				form: {
					// id: '',
					name: '',
					password: '',
					sex: '',
					tel: '',
					id_card: ''
				},
				rules: {
					name: [
						// 必填规则
						{
							required: true,
							message: '此为必填字段',
							// blur和change事件触发检验
							trigger: ['blur', 'change'],
						},
						// 6-8个字符之间的判断
						{
							min: 2,
							max: 8,
							message: '长度在2-8个字符之间'
						},
						// 自定义规则判断是否包含字母"A"
						{
							validator: (rule, value, callback) => {
								if(this.$u.test.contains(value, "党")){
									callback(new Error('包含非法字段，请重新输入'))
								}
								// message: '必须包含字母"A"'
								return value;
							},
						},
					],
					tel: [
						{
							required: true, 
							message: '请输入手机号',
							trigger: ['change','blur'],
						},
					]
				}
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				// if(this.form.name && this.form.password && this.form.sex && 
				// this.form.tel && this.form.idcard && this.form.userId) {
				if(this.form.name && this.form.password && this.form.sex &&
				this.form.tel && this.form.id_card) {
					style.color = "#fff";
					style.backgroundColor = "#387e96";
				}
				return style;
			}
		},
		methods: {
			goindex: function () {
				uni.switchTab({
					url: '../index/index'
				})
			},
			submit() {
				// this.name && this.pwd && this.sex && this.tel && this.idcard && this.userId
				if(this.form.name && this.form.password && this.form.sex &&
				this.form.tel && this.form.id_card) {
					// this.form.id = this.memberList[this.memberList.length-1].id +1;
					this.$u.post('/api/EmployeeSwaggerController/regesterUser',this.form).then(res => {
						if(res.error) {
							callback(new Error('数据获取出错'));
						} else {
							this.$refs.uTips.show({
								title: '注册成功',
								type: 'success',
								duration: '600'
							})
						}
					})
					
					setTimeout(() => {
						uni.navigateTo({
							url: '../login/login',
						});
					}, 1000);
				}
			},
			// 点击actionSheet回调
			actionSheetCallback(index) {
				this.value1 = this.actionSheetList[index].text;
				this.form.sex = this.actionSheetList[index].text;
			}
		},
		mounted() {
			uni.request({
				method: "post",
				// method: "get",
				// url: "/api/dc/querySeats",
				url: "/api/EmployeeSwaggerController/allMember",
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
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
			font-size: 28rpx;
			.content {
				width: 600rpx;
				margin: 80rpx auto 0;
		
				.iheight {
					height: 70rpx;
				}
				
				.title {
					text-align: left;
					font-size: 60rpx;
					font-weight: 500;
					margin-bottom: 100rpx;
				}
				input {
					text-align: left;
					margin-bottom: 10rpx;
					padding-bottom: 6rpx;
				}
				.tips {
					color: $u-type-info;
					margin-bottom: 60rpx;
					margin-top: 8rpx;
				}
				.getCaptcha {
					// background-color: rgb(253, 243, 208);add8e6
					background-color: #add8e6;
					color: $u-tips-color;
					border: none;
					font-size: 30rpx;
					padding: 12rpx 0;
					margin-top: 80rpx;
					
					&::after {
						border: none;
					}
				}
				.alternative {
					color: $u-tips-color;
					display: flex;
					justify-content: space-between;
					margin-top: 30rpx;
				}
			}
			.buttom {
				position: fixed;
				bottom: 80rpx;
				
				.head_word {
					height: 120rpx;
					line-height: 120rpx;
				}
				
				.demo-layout {
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					border-radius: 8rpx;
					// overflow: hidden;
				}
				
				.demo-layout text{
					// float: right;
					margin-right: 30rpx;
					font-size: 32rpx;
				}
				
				.membermmg {
					padding-right: 40rpx;
					color: #387e96;
				}
			}
		}
</style>
