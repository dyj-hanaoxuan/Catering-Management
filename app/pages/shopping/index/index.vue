<template>
	
	<view>
		<navigator open-type="navigateBack"></navigator>

		<u-navbar :is-back="true" title="菜品"  class="navbar"></u-navbar>
			<view>
				<view class="nav">
					<scroll-view class="scroll-view_H"
					 scroll-x="true"
					  refresher-enabled="true"
					    
					  >
						<view class="slide_type_list">
							<view v-for="(item, index2) in list2" :key="index2" class="slide_type_list_view" :class="{is_selected:active==index2}"  @click="dj(item.d_type,index2)" >
								<view class="c">{{item.d_type}}</view>
							</view>
						</view>
					</scroll-view>
					
					<!-- <tab :line-width=2 active-color='#fc378c' v-model="index" >
						<tab-item class="vux-center" :selected="demo === item.d_type" v-for="(item, index) in list2" @on-item-click="dj(item.d_type)" :key="index">{{item.d_type}}</tab-item>
					</tab> -->
				</view>
				<!-- 图片瀑布流 -->
				 <view class="wrap" v-for="(item, index) in list" :key="index">
					<view class="list">
						<view class="img">
							<slot></slot>
							<image :src="'http://172.16.6.21:8080'+item.d_pic" lazy-load=true widthFix></image></view>
						<view class="ms">
							<view>{{item.d_name}}</view>
							<view>价格：{{item.d_price}}</view>
							<view>口味：{{item.d_taste}}</view>
							<view>{{item.d_tips}}</view>
							<view class="button">
								<button @tap="del(item.d_name,item.d_price,index)">-</button>
								<text v-text="number[index]"></text>
								<button @tap="add(item,index)">+</button>
							</view>
						</view>
					</view>
					<u-divider half-width="280"></u-divider>
				</view>
				<!-- 底部 -->
				<u-divider half-width="280">到顶了</u-divider>
					<view class="dd"></view>
			</view>
			<!-- 返回顶部 -->
		<view class="back" :style="{'display':(flag===true? 'block':'none')}">
			<u-icon name="arrow-up" color="rgb(255,255,255)" size="80" class="top"  @click="top">111</u-icon>
			</view>
			<!-- 结账 -->
		<view  class="set">
			<u-icon name="shopping-cart-fill" color="rgb(255,255,255)" size="70" :custom-style="bgc"></u-icon>
			<text>总价：￥<text v-text="qian"></text></text>
			<u-button :custom-style="customStyle" ripple @click="sub">查看订单</u-button>
		</view>
	</view>
</template>



<script>


import { mapGetters,mapActions } from 'vuex'
import store from '../../../store/index.js'
export default {
	
	data() {
		return {
			current:0,
			active:0,
			getnum:'',
			type:'',
			flag:false,
			qian:0,
			demo: '全部',
			list2:[
				
			],
			number:[],
			list:[],
			 // messageSwitch: false,
    //          message: '',
			customStyle: {
				"background-color": 'rgb(99,99,99)',
				"color" : "rgb(255,255,255)",
				"flex-basis": "30%",
				"height" : "100%"
			},
			bgc: {
				"padding" : "15rpx",
				"border-radius": "50%",
				"background-color": "rgb(166,166,166)",
			},
			  list2:[],
			  index:0,
			  index2:0,
			  
		}
	},
	methods:{
		dj(item,index2){
			this.active =index2;
			uni.request({
			url: "api/reception/sortfood",
			method:'POST',
			data:{
				d_type:item
			},
			header: {
				'Content-Type': 'application/json',
				'token':uni.getStorageSync("token")
			},
			success: (res) => {
				console.log(res)
				if(res.data.code === 200){
					// this.$store.dispatch('set_login',res.data)
					uni.showToast({
						icon:'loading',
						duration:1000
					}),
					this.list = res.data.data
					this.number=new Array(this.list.length);
					for(var i = 0 ; i<this.number.length ; i++){
						this.number[i] = 0 
					}
					
				}else{
					uni.showToast({
						icon:'loading',
						title:'暂无商品',
						duration:2000
					})
				}
			},
			})
		},
		//减
		del(d_name,d_price,index){

			// console.log(item)
			if (!(this.number[index] <= 0)) {
				this.number[index]--
				this.qian-=d_price
				// this.qian=(this.number[index])*d_price
            }
			uni.request({
				url: "api/reception/del",
				method:'POST',
				data:{
					d_name:d_name,
					num:this.$store.state.num
				},
				header: {
					// 'content-type':'application/x-www-form-urlencoded'
					'Content-Type': 'application/json',
					'token':uni.getStorageSync("token")
				},
				success: (res) => {
					console.log(res)
					if(res.data.code === 200){
						// this.list2 = res.data.data
						console.log("请求成功")
					}else{
						console.log('请求失败')
					}	
				}
			})
		},
		//查看
		sub(){

			uni.request({
				url: "api/reception/payment",
				method:'POST',
				data:{
					num:this.$store.state.num
				},
				header: {
					// 'content-type':'application/x-www-form-urlencoded'
					'Content-Type': 'application/json',
					'token':uni.getStorageSync("token")
				},
				success: (res) => {
					console.log(res)
					if(res.data.code === 200){
						// this.list2 = res.data.data
						console.log("请求成功")
						uni.showToast({
							title: '查询成功',
							icon:'success',
							mask:true,
							duration: 1000
						});
						setTimeout(()=>{
							uni.navigateTo({
								url: '../order/order'
						});
						},1000)
					}else{
						console.log('请求失败')
					}	
				}
			})
		},
		
		// 加
		add(item,index) {
			console.log("wwwwwww",this.$store.state.num);
			// console.log(item)
			if(!(this.number[index] < 0)){
				this.number[index]++
				// this.qian=item.d_price*(this.number[index]+1)
				this.qian+=item.d_price
				// this.number[index]++
			}
			uni.request({
				url: "api/reception/submit",
				method:'POST',
				data:{
					d_name:item.d_name,
					d_price:item.d_price,
					// num:store.getters.hasNum.num
					num:this.$store.state.num
				},
				header: {
					// 'content-type':'application/x-www-form-urlencoded'
					'Content-Type': 'application/json',
					'token':uni.getStorageSync("token")
				},
				success: (res) => {
					console.log(this.getnum)
					console.log(res)
					if(res.data.code === 200){
						console.log("请求成功")
					}else{
						console.log('请求失败')
					}	
				}
			})
		},
		
		// 返回顶部
		
		top() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 200
			})
		},
		onPageScroll(e){ 
			if(e.scrollTop>600){
				this.flag=true
			}else {
				this.flag=false
			}
		}, 
		
	
   },

	// computed:{...mapGetters['hasNum']},
	mounted:function(){
		this.getnum = this.$store.state.num
		uni.request({
		url: "api/reception/sortfood",
		method:'POST',
		data:{
			// d_type:''
		},
		header: {
			'Content-Type': 'application/json',
			'token':uni.getStorageSync("token")
		},
		success: (res) => {
			console.log(res)
			if(res.data.code === 200){

				this.list = res.data.data
				this.number=new Array(this.list.length);
				for(var i = 0 ; i<this.number.length; i++){
					this.number[i] = 0 
				}
				
			}else{
				uni.showToast({
					icon:'loading',
					title:'服务器出差',
					duration:10000
				})
			}
		},
		})
		uni.request({
		url: "api/reception/querytype",
		method:'POST',
		data:{
			// d_type:'酒水'
		},
		header: {
			'Content-Type': 'application/json',
			'token':uni.getStorageSync("token")
		},
		success: (res) => {
			console.log(res)
			if(res.data.code === 200){
				this.list2 = res.data.data
				console.log('请求成功')
			}else{
				console.log('请求失败')
			}
		}
		})
	}
}
</script>

<style lang="scss">
	.scroll-view_H{
		background-color: #FFFFFF;
		.slide_type_list{
			display: flex;
			padding: 20upx 30upx;
			.slide_type_list_view{
				padding-bottom: 10upx;
				font-size: 28upx;
				color: #83839f;
				margin-right: 30upx;
				view{
					width: 150upx;
					text-align: center;
				}
			}
			.is_selected{
				color: #252529;
				font-weight: bold;
				position: relative;
			}
			.is_selected:before{
				content: '';
				position: absolute;
				width: 62upx;
				height: 4upx;
				left: 50%;
				margin-left: -31upx;
				bottom: -20upx;
				background-color: #ff5857;
			}
		}
		}

	.button{
		display: flex;
		width: 200rpx;
		align-items: center;
	}
	.button button{
		font-size: 30rpx;
		line-height: 50rpx;
		height: 50rpx;
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
		justify-content: space-around;
		height: 100%;margin-top: 50rpx;
	}
	.index{
		height: 900rpx;
	}
	.set{
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;bottom: 0;
		width: 100%;	
	}
	.set text{
		color: rgb(0,0,0);
		font-size: 40rpx;
		font-weight: bolder;
		flex-basis: 50%;
		margin-left: 20rpx;
	}
	.back{
		position: relative;
		display: none;
	}
	.top{
		position: fixed;bottom: 0;right: 0;top:80%;
		background-color: rgba(144,147,153,0.7);
		border-radius: 50%;
		width: 100rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

</style>
