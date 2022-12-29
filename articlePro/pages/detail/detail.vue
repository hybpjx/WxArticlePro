<template>
	<view class="detail">
		<view v-if="loadingStatus">
			<view class="title">
				{{detail.title}}
			</view>

			<view class="info">
				<text>{{detail.author}}</text>

				<uni-dateformat :date="detail.posttime" format='yyyy年MM月dd日 hh:mm:ss'></uni-dateformat>
			</view>


			<view class="content">
				{{detail.content}}
			</view>

			<view class="btnGroup">

				<!-- 修改 -->
				<button size="mini" @click="goEdit">
					<uni-icons type="compose" size="20"></uni-icons>
				</button>

				<!-- 删除 -->
				<button size="mini" type="warn" @click="onRemove">
					<uni-icons type="closeempty" size="20"></uni-icons>
				</button>
			</view>


		</view>

		<view v-else>
			<uni-load-more status="loading"></uni-load-more>

		</view>

	</view>
</template>

<script>
	let id;
	export default {
		data() {
			return {
				detail: {},
				loadingStatus: false,
			};
		},

		onLoad(e) {
			id = e.id;
			this.getDetail()
		},
		onShow() {
			this.getDetail();
		},
		methods: {
			// 跳转到首页
			turnToIndex() {
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}, 800)
			},
			// 跳转到修改页面
			goEdit() {
				uni.navigateTo({
					url: "/pages/edit/edit?id=" + id
				})
			},



			// 删除某条记录
			onRemove() {
				uni.showModal({
					content: "是否确认删除？",
					success: res => {
						if (res.confirm) {
							this.removeFunc();
						}
					}
				})
				return
			},

			// 删除的方法
			removeFunc() {
				uniCloud.callFunction({
					name: "art_remove_row",
					data: {
						id
					}
				}).then(res => {
					uni.showToast({
						icon: "success",
						title: "删除成功"
					});
					this.turnToIndex()
				})
			},


			// 获取详情页内容
			getDetail() {
				uniCloud.callFunction({
					name: "art_get_row",
					data: {
						id
					}
				}).then((res) => {
					this.detail = res.result.data[0];
					this.loadingStatus = true;
					uni.setNavigationBarTitle({
						title: res.result.data[0].title
					})
				}).catch(() => {
					uni.showToast({
						icon: 'error',
						title: "参数有误"
					});
					this.turnToIndex()
				})
			},



		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding: 30rpx;

		.title {
			font-size: 50rpx;
			color: #000;
			text-align: justify;
			line-height: 1.4em;
		}

		.info {
			font-size: 30rpx;
			color: #666;
			padding: 30rpx 0 60rpx;

			text {
				padding-right: 30rpx;
			}
		}

		.content {
			font-size: 36rpx;
			line-height: 1.7em;
		}

		.btnGroup {
			padding: 50rpx 10rpx;

			button {
				margin-right: 30rpx;

			}
		}
	}
</style>
