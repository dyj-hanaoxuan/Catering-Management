<template>
	<view>
		<navigator open-type="navigateBack"></navigator>
		<u-navbar :is-back="true" title="订单"  class="navbar"></u-navbar>
		<view class="bg">
			<text>品质联盟</text>
		</view>
		<view class="huiyuan">
			<text>会员号：</text><input type="text" v-model="v_id" placeholder="请输入会员号"/>
		</view>
		<view v-for="(item,index) in list" :key="index">
			<view>
				<view class="mes">
					<view class="img"><image :src="'http://172.16.6.21:8080'+item.photo" lazy-load=true widthFix></image></view>
					<view class="cm">
						<text>{{item.d_name}}</text>
						<view>x{{item.o_num}}</view>
					</view>
					<view class="price">￥{{item.total_price}}</view>
				</view>
			</view>
			<view class="order">
				<view class="image">
					小计：
				</view>
				<text>￥{{item.all_price}}</text>
				<view class="button"><button plain type="primary" @tap="sub">提交订单</button></view>
			</view>
		</view>
		<view class="beizhu">
			<view>备注：</view>
			<view><jyf-parser :html="html" ref="article"></jyf-parser></view>
		</view>
		<view class="db"></view>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	// import {XButton} from 'vux'
	import { mapGetters,mapActions } from 'vuex'
	import store from '../../../store/index.js'
	export default {
		components: {
		    // XButton,
			jyfParser
		 },
		data() {
			return {
				getnum:'',
				html: '',
				list:[],
				sum:'',
				v_id:'',
			}
		},
		 onReady() {
			// 方式 1
			// this.html = '<div>Hello World!</div>';
			// 方式 2
			this.$refs.article.setContent('<div>富文本框</div>');
		  },
		
		methods: {
			sub(){
				this.$store.dispatch('set_tel',this.v_id)
				
				setTimeout(()=>{
				uni.request({
				url: "api/reception/submitbills",
				method:'POST',
				data:{
					num:this.$store.state.num,
					tel:this.v_id
				},
				header: {
					'Content-Type': 'application/json',
					'token':uni.getStorageSync('token')
				},
				success: (res) => {
					console.log(res.data.data)
					if(res.data.code === 200){
						this.list = res.data.data
						uni.navigateTo({
							url: '../set/set'
						});
						console.log('请求成功')
					}else{
						console.log('请求失败')
					}
				},
				})
				},500)
			}
		},
		mounted:function(){
			// this.v_id = this.$store.state.tel
			setTimeout(()=>{
			uni.request({
			url: "api/reception/payment",
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
					this.list = res.data.data
					
					console.log('请求成功')
				}else{
					console.log('请求失败')
				}
			},
			})
			},500)
		},
		computed:{
			...mapGetters['hasNum','hasTel']
		},
	}
</script>

<style lang="less">
.huiyuan{
	flex-direction: row;
	flex-wrap: nowrap;
	width: 100%;
	height: 60rpx;
	line-height: 60rpx;
	display: flex;
	margin-left: 20rpx;
	align-items: center;
	flex: row;
	input {
		width: 260rpx;
		display: inline;
	}
	text {
		width: 150rpx;
	}
}
.test1{
	background-color: red;
	height: 120rpx;
}
.db{
	width: 100%;
	height: 150rpx;
}
.bg text{
	font-size: 40rpx;
	position: absolute;top:calc(50% - 20rpx);right: calc(50% - 200rpx);
	   background-image:-webkit-linear-gradient(bottom,rgb(227,226,222),rgb(218,158,4),rgb(253,211,69)); 
	    -webkit-background-clip:text; 
	    -webkit-text-fill-color:transparent; 
	font-weight: bold;
}
.bg{
	position: relative;
	background-image: url(../../../static/image/order.jpg);
	width: 100%;
	height: 300rpx;
	-webkit-background-size:cover ;
	background-size: cover;
	background-position: -150rpx -100rpx;
}
.order .button{
	flex-basis: 30%;
	margin-left: 300rpx;
}
.image{
	flex-basis: 15%;
	margin-left: 20rpx;
	
}
.order text{
	color: red;
	font-weight: bold;
}
.image image{
	width: 100%;
	height: 100rpx;
}
.order{
	position: fixed;bottom: 0;
	display: flex;
	width: 100%;
	align-items: center;
	align-items: center;

}
.beizhu{
	margin-left: 20rpx;

}
.price{
	flex-basis: 25%;
}
.cm{
	line-height: 80rpx;
	margin-left: 40rpx;
	font-size: 30rpx;
}
.mes{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 30rpx;
}
.cm:nth-child(2){
	flex-basis: 50%;
}
.img image{
	width: 100%;
	height: 150rpx;
	margin-left: 20rpx;
	border-radius: 15rpx;
}
.img{
	
	flex-basis: 20%;
}
</style>
