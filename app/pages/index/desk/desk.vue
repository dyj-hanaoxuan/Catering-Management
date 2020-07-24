<template>
	<view>
		<u-navbar :is-back="true" title="餐桌设置"></u-navbar>
		<view class="desk_type">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index1" :range="array">
							<view class="uni-input">{{array[index1]}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange1" :value="index2" :range="array1">
							<view class="uni-input">{{array1[index2]}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange2" :value="index3" :range="array2">
							<view class="uni-input">{{array2[index3]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!hasLogin" class="noLogin"> <text>请登录</text>!
			<button class="login" @tap="login">登录</button>
		</view>  
		<view v-else>
			<view class="desk_list">
			<view v-for="(item, index) in deskList" :key="item.num">
				<view v-if="((item.state == array2[index3]) && (item.state == '可用') && (item.people_num == parseInt(array1[index2])) && (item.type == array[index1])) ? true : false" class="desk_available" @click="getit(item)" :style="[deskStyle]">{{item.num}}</view>
				<view v-if="((item.state == array2[index3]) && (item.state == '占用') && (item.people_num == parseInt(array1[index2])) && (item.type == array[index1])) ? true : false" class="desk_inuse">{{item.num}}</view>
			</view>
		</view>
		<view class="foot_bar" >
			<view class="foot_box desk_num" :style="[viewStyle]">
				<text>{{getnum}}</text>号
			</view>
			<view class="foot_box desk_people" :style="[viewStyle]">
				<u-input v-model="totalp" placeholder=" " />
			</view>
			<view class="foot_box desk_ok" :style="[viewStyle]">
				<text @click="gomenu">确认</text>
			</view>
		</view>
		</view>
		
<!-- 		<view class="testdata">
			<button @click="testit" type="default">测试</button>
		</view> -->
	</view>
</template>
	
<script>
	import { mapGetters,mapActions } from 'vuex'
	// computed:{
	// 	...mapState(['num'])
	// },
	export default {
		data() {
			return {
				xianshi: false,
				array: ['大厅', '包间'],
				// array1: ['1人次', '2人次', '3人次', '4人次'],
				array1: [1,2,4,8],
				array2: ['可用', '占用'],
				index1: 0,
				index2: 0,
				index3: 0,
				placeholder: '请选择位置',
				deskList: [],
				getnum: '',
				totalp: ''
			}
		},
		methods: {
			login(){
				uni.navigateTo({
					url: '../../shopping/login/login'
				});
			},
			// ...mapActions['set_num'],
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index1 = e.target.value
			},
			bindPickerChange1: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index2 = e.target.value
			},
			bindPickerChange2: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index3 = e.target.value
			},
			getit(deskit) {
				// console.log(deskit)
				// console.log(deskit.num);
				this.getnum = deskit.num;
				
			},
			gomenu() {
				// this.getnum
				if(this.getnum){
					this.$store.dispatch('set_num',this.getnum)
					uni.request({
						method: "post",
						url: "/api/reception/select",
						header: {
							'Content-Type': 'application/json',
							'token':uni.getStorageSync('token')
						},
						data: {
							num: this.getnum,
							people_num: this.totalp
							
						},
						success: (res) => {	
							if(res.data.code === 200){
								console.log(res);
							console.log('成功')
								uni.navigateTo({
									url: '../../shopping/index/index'
								});
						
							}
							
							
							// this.memberList = res.data
						},
						fail:(err)=>{
							console.log(err)
						}
					});
				}
			},
			goindex() {
				uni.switchTab({
					url: '../index/index'
				})
			}
		},
		computed:{
			...mapGetters(['hasLogin','hasuser','hasNum']),
			viewStyle() {
				let style = {};
				if(this.totalp){
					style.color = "#fff";
					style.backgroundColor = "#fddd90";
					// style.backgroundColor = "#fddd90";
				}
				return style;
			},
			deskStyle() {
				let style = {};
				if(this.totalp){
					style.color = "#fff";
					style.backgroundColor = "#52a7d1";
				}
				return style;
			},
			
		},
		mounted: function () {
			// this.$store.state.num = this.hasNum;
			uni.request({
				method: "post",
				// method: "get",
				url: "/api/reception/seat",
				header: {
					'Content-Type': 'application/json',
					'token':uni.getStorageSync("token")
				},
				data: {
					
				},
				success: (res) => {
					// console.log(res.data.data);
					this.deskList = res.data.data
				},
				fail:(err)=>{
					console.log(err)
				}
			})
		}
		// methods:[...mapActions('set_num')]
	}
</script>

<style lang="scss" scoped>
	.login{
		background-color:rgb(0,122,255);
		margin-top: 100rpx;
		width: 70%;
	}
	.noLogin{
		text-align: center;
	}
	.membermmg {
		padding-right: 40rpx;
		color: #387e96;
	}
	
	.u-icon {
		margin-left: 40rpx;
	}
	
	.u-row {
		margin: 40rpx 0;
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
	
	view {
		line-height: 30rpx;
	}
	
	button {
		background-color: rgb(230,66,64);
		color: #F0F0F0;
	}
	
	switch {
		text-indent: 40rpx;
	}
	
	.head_word {
		height: 120rpx;
		line-height: 120rpx;
	}
	
	.uni-list {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
	
	.uni-list-cell {
		color: #a6733e;
	}
	
	.uni-list-cell:hover {
		color: #add8e6;
	}
	
	.desk_type {
		margin-top: 40rpx;
	}
	
	.desk_list {
		// background-color: #add8e6;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-around;
		// align-content: space-between;
		flex-wrap: wrap;
	}
	
	.desk_item {
	}
	
	.desk_available {
		margin: 36rpx 30rpx;
		width: 170rpx;
		height: 170rpx;
		line-height: 170rpx;
		text-align: center;
		// margin: 36rpx 20rpx;
		font-size: 42rpx;
		color: white;
		border-radius: 16rpx;
		background-color: #add9e6;
		// background-color: #ffbdbd;
		// background-color: #ffc6bd;
	}
	
	.desk_inuse {
		margin: 36rpx 30rpx;
		width: 170rpx;
		height: 170rpx;
		line-height: 170rpx;
		text-align: center;
		// margin: 36rpx 20rpx;
		font-size: 42rpx;
		color: white;
		border-radius: 16rpx;
		background-color: #fdbcc1;
		// background-color: #aed5e6;
		// background-color: #d1eaf3;
	}
	
	.foot_bar {
		position: fixed;
		bottom: 0;
	}
	
	.foot_box {
		position: fixed;
		bottom: 110rpx;
		width: 130rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background-color: #ffefbd;
		color: #5f5f5f;
		font-size: 32rpx;
		// font-weight: bolder;
	}
	
	.desk_num {
		left: 0rpx;
		border-radius: 0 16rpx 16rpx 0;
	}
	
	.desk_ok {
		right: 0rpx;
		border-radius: 16rpx 0 0 16rpx;
	}
	
	.desk_people {
		right: 310rpx;
		border-radius: 16rpx;
	}
</style>
