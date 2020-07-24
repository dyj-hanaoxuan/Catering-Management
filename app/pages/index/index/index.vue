<template>
	<view class="container">
		<u-navbar :is-back="true" title="首页"  class="navbar"></u-navbar>
		<view class="head_word">
			<view class="membermmg">
				<view><image src="../../../static/image/logo.png" class="logo"></image></view>
				<!-- <text class="membermmg" @click="gomember">登录</text> -->
				<view class="isLogin">
					<view v-if="!hasLogin" class="noLogin">请登录!</view>  
					<view v-else class="heading">
						<view><image :src="'http://172.16.6.21:8080'+hasuser.e_icon" class="head"></image></view>
						<view>{{hasuser.e_id}}</view>
					</view> 
					<view><text @click="gomember">{{hasLogin ? '退出登录' : '登录'}}</text></view>
				</view>
			</view>
		</view>
		<view class="wrap" v-for="(item, index) in list" :key="index">
			<view class="list">
				<view class="img"><image :src="'http://172.16.6.21:8080'+item.d_pic" lazy-load=true widthFix></image></view>
				<view class="ms">
					<view>{{item.d_name}}</view>
					<view>价格：{{item.d_price}}</view>
					<view>口味：{{item.d_taste}}</view>
					<view>{{item.d_tips}}</view>
				</view>
			</view>
			<u-divider half-width="280"></u-divider>
		</view>
	</view>
</template>

<script>
	 
	  import { mapGetters,mapActions} from 'vuex'
	export default {
		data() {
			return {
				list:[],
				index:0,
				homeSlide: [], // 定义值接收轮播图数据
				token : ''
			}
		},
		computed:{
			...mapGetters(['hasLogin','hasuser','hasToken'])
		},
		methods: {
			
			gomember(){
				if(this.hasLogin) {
					this.$store.dispatch('set_logout')
				}else{
					uni.navigateTo({
						url:'../../shopping/login/login'
					})
				}
			}
		},
		mounted:function(){
			// token = hasuser.token
			uni.request({
			url: "api/reception/queryfood",
			method:'POST',
			data:{

			},
			header: {
				'Content-Type': 'application/json',
				// 'token':uni.getStorageSync("token")
				'token':uni.getStorageSync('token')
			},
			success: (res) => {
				console.log(res)
				if(res.data.code === 200){
					this.list = res.data.data
				}else{
					uni.showToast({
						icon:'loading',
						duration:5000
					})
				}
			},
			})
		}
	}
</script>

<style lang="scss" scoped>
	.isLogin{
		display: flex;
		flex-basis: 70%;
		justify-content: flex-end;
		align-items: center;
	}
	.heading{
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}
	.noLogin{
		color: rgb(39,40,34);
	}
	.logo{
		width: 200rpx;
		height: 100rpx;
		flex-basis: 30%;
	}
	.head{
	width: 90rpx;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 50%;
	}	
	.img{
		flex-basis: 60%;
		height: 400rpx;
	}
	.dd{
		width: 100%;
		height: 100rpx;
	}
	.img image{
		width: 60%;
		height: 60%;
		margin-left: 60rpx;
		border-radius: 50rpx;

	}
	.ms{
		flex-basis: 40%;
		margin-top: 20rpx;
		font-size: 20rpx;
		line-height: 50rpx;
	}
	.ms view:first-child{
		font-size: 30rpx;
		font-weight: bolder;
	}
	.wrap{
		width: 100%;
		height: 90%;
	}
	.list{
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		height: 100%;margin-top: 50rpx;
	}
	.index{
		height: 900rpx;
	}
	
	.head_word {
		width: 100%;
		display: flex;
		align-items: center;
		
	}
	
	.demo-layout {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.demo-layout text{
		float: right;
		margin-right: 30rpx;
		font-size: 32rpx;
	}
	
	.membermmg {
		width: 100%;
		align-items: center;
		display: flex;
		flex-wrap: nowrap;
		padding-right: 40rpx;
		color: #fff;
		justify-content:flex-end;
		align-items: center;
		flex-wrap: nowrap;
		background-color: rgb(232,198,137);
		
	}
	.membermmg text{
		background-color: rgb(232,198,137);
		margin-left: 15rpx;
	}
</style>
