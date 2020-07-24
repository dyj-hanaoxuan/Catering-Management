<template>
	<view>
		<navigator open-type="navigateBack"></navigator>
		<u-navbar :is-back="true" title="支付订单"  class="navbar"></u-navbar>
		<view>
			<view class="image"></view>
			<view class="dis" v-for="(item2,index) in list2">
				<view class="order">
				<!-- 	<view class="test1" @click="testit"> 
						测试{{list2}}
					</view> -->
					<view>订单号：{{item2.order_num}}</view>
					<view>￥{{item2.total_price}}</view>
				</view>
			</view>
			<view>
				<view class="dsf">诚信支付，财富 hold 住！</view>
				<view class="button">
					<button @tap="common" class="pt">微信支付</button>
					<button type="warn" @tap="vip">会员支付</button>
					
				</view>
				
				<view class="sub">
					<u-button type="primary" @tap="del">取消订单</u-button>
				</view>
			</view>
		</view>
		<view id="ewm">
			<image src="../../../static/image/zf.png"></image>
			<text class="stop" @tap="stop">X</text>
		</view>
		
	</view>
</template>

<script>
import { mapGetters,mapActions } from 'vuex'
import store from '../../../store/index.js'

	export default {
		data() {
			return {
				 // v_id:'',
				list2:[],
				getnum:'',
				
				value: '',
				vipArr:[],
				commonArr:[]
			}
		},
		methods: {
			del(){
				uni.request({
				url: "api/reception/delreceporders",
				method:'POST',
				data:{
					num:this.$store.state.num,
				},
				header: {
					'Content-Type': 'application/json',
					'token':uni.getStorageSync('token')
				},
				success: (res) => {
					if(res.data.code === 200){
						console.log('请求成功')
						uni.redirectTo({
							url: '../../index/index/index'
						})
					}else{
						console.log('请求失败')
					}
				},
				})
			},
			vip(){
				console.log(this.$store.state.tel)
				uni.request({
				url: "api/reception/confirmvip",
				method:'POST',
				data:{
					tel:this.$store.state.tel,
					num:this.$store.state.num
				},
				header: {
					'Content-Type': 'application/json',
					'token':uni.getStorageSync('token')
				},
				success: (res) => {
					if(res.data.code === 200){
						this.vipArr = res.data.data
						uni.showToast({
							title: '支付成功',
							icon:'success',
							mask:true,
							duration: 1000,
						});
						setTimeout(()=>{
							uni.redirectTo({
							url: '../../index/index/index'
						})
						},1000)
						console.log('请求成功')
					}else{
						uni.showToast({
							icon:"none",
							title:"会员号错误",
							duration:2000
						})
						setTimeout(()=>{
							uni.redirectTo({
							url: '../order/order'
						})
						},1000)
						
					}
				},
				fail(err) {
					uni.showToast({
						title:"支付失败",
						icon:'loading',
						duration:2000
					})
				}
				})
			},
			common(){
				uni.request({
				url: "api/reception/confirmnormal",
				method:'POST',
				data:{
					num:this.$store.state.num
				},
				header: {
					'Content-Type': 'application/json',
					'token':uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res.data.data)
					if(res.data.code === 200){
						this.commonArr = res.data.data
						this.list = res.data.data
						// let ewm = document.getElementById(ewm)
						// ewm.style.display='block'
						uni.showToast({
							title: '支付成功',
							icon:'success',
							mask:true,
							duration: 1000
						});
							uni.navigateTo({
								url: '../ewm/ewm'
						});
						console.log('请求成功')
					}else{
						console.log('请求失败')
					}
				},
				})
			}
		},
		computed:{...mapGetters['hasNum','hasTel']},
		mounted:function(){
			// this.getnum = this.$store.state.num
			setTimeout(()=>{
			uni.request({
			url: "api/reception/submitbills",
			method:'POST',
			data:{
				num:this.$store.state.num,
				tel:this.$store.state.tel
			},
			header: {
				'Content-Type': 'application/json',
				'token':uni.getStorageSync('token')
				
			},
			success: (res) => {
				console.log(res.data.data)
				if(res.data.code === 200){
					this.list2 = res.data.data
					console.log('请求成功')
				}else{
					console.log('请求失败')
				}
			},
			})
			},500)
		}
		
	}
</script>

<style lang="scss">
@import "uview-ui/index.scss";
.dsf{
	text-align: center;
}
.pt{
	background-color: rgb(2,198,2);
	color: #fff;
}
#ewm{
	position: fixed;position: fixed;top:calc(50% - 250rpx);left: calc(50% - 320rpx);
	width:90%;
	height: 560rpx;
	display: none;
}
#ewm image{
	position: absolute;top:40rpx;
}
.stop{
	font-size: 40rpx;
	font-weight: bolder;
	position: absolute;top:calc(50% - 280rpx);right: calc(50% - 340rpx);
	z-index: 1;
	color: rgb(230,67,64);
}
.image{
	background-image: url(../../../static/image/timg.jpg);
	width: 100%;
	height: 300rpx;
	-webkit-background-size:cover ;
	background-size: cover;
}
.dis{
	display: flex;
	line-height: 100rpx;
	font-size: 40rpx;
	flex-direction: column;
}
.sub{
	position: absolute;bottom: 0;
	width: 100%;
}
.radio{
	font-size: 40rpx;
}
.button{
	margin-top: 100rpx;
}
.button button{
	width: 80%;
	margin-top: 20rpx;
}
</style>
