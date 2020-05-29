<!--
 * @Author: dull_
 * @Date: 2020-05-29 14:47:46
 * @LastEditTime: 2020-05-29 14:59:18
 * @LastEditors: dull_
 * @Description: 
 * @FilePath: \tree_demo\src\pages\index\index.vue
 * @
--> 
<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
