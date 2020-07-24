<template>
	<view>
		<u-navbar :is-back="true" title="登录"></u-navbar>
		<view class="content">
			<view class="form">
				<view class="title">欢迎登录Idove小店！</view>
				<u-cell-group>
					<u-field
						required
						v-model="user"
						label="账号"
						placeholder="请输入账号"
					>
					</u-field>
					<u-field
						required
						password
						v-model="pwd"
						label="密码"
						placeholder="请输入密码"
					>
					</u-field>	
					<button type="primary" @tap="login">登录</button>
				</u-cell-group>
			</view>
	
		</view>
	</view>
</template>

<script>
	
	import {mapGetters, mapActions} from 'vuex'
	export default {
		data() {
			return {
				user:'',
				pwd:'',
				list:[],
				background: {
					backgroundColor: 'rgb(255,255,255)',
				},
				customStyle: {
					backgroundColor: 'rgb(255,83,59)',
					color: "rgb(255,255,255)"
				}
			};
		},
		// computed:mapActions(['set_login']),
		methods:{
			login(){
				console.log()
				if(this.user.length<=0 || this.pwd.length<=0){
					uni.showToast({
						title: '账号或用户名不能为空',
						icon:'none',
						mask:true,
						duration: 2000
					});
				}else{
					uni.request({
						url: "api/employee/login",
						method:'POST',
						data:{
							e_id:this.user,
							e_password:this.pwd,
						},
						header: {
							'Content-Type': 'application/json',
							// 'token':uni.getStorageSync("token")
							
						},
						success: (res) => {
							console.log('登录')
							if(res.data.code === 200){
								this.list = res.data.data
								// console.log("请求成功",res)

								// this.$store.dispatch('set_login',res.data.token)
								this.$store.dispatch('set_login',res.data)
						
								uni.showToast({
									title: '登录成功',
									icon:'success',
									mask:true,
									duration: 2000
								});
									uni.switchTab({
										url: '../../index/index/index'
								});
							}
							else if(res.data.code === 500){
									uni.showToast({
										title: '用户名或密码错误',
										icon:'none',
										mask:true,
										duration: 2000
									});
							}
							else{
								uni.showToast({
									icon:'loading',
									duration:10000
								})
							}
							
						},
						fail(res) {
							console.log(res)
						}
						
					})
				}
			},
			
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	.content{
		width: 100%;
		display: flex;
		justify-content:center;
		margin-top: 70rpx;
		line-height: 80rpx;
	}
	.form{
		width: 70%;
	}
	.title{
		font-size: 40rpx;
		font-weight: bolder;
		text-indent: 20rpx;
		line-height: 100rpx;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		}

</style>
