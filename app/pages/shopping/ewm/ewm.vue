<template>
	<view>
		<u-navbar :is-back="true" title="微信扫码支付"></u-navbar>
		<view class="image"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.image{
	background-image: url(../../../static/image/zf.png);
	width: 600rpx;
	height: 600rpx;
	position: fixed;top:300rpx;left: 80rpx;
}
</style>
