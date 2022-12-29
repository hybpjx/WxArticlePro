<template>
	<view class="home">
		<view class="content">
			<view class="item" @click="goDetail(item._id)" v-for="item in listArr" :key="item._id">
				<view class="text">
					<view class="title">
						{{item.title}}
					</view>

					<view class="info">
						<text>{{item.author}}</text>
						<uni-dateformat :date="item.posttime" :threshold="[60000, 3600000]" format="MM-dd">
						</uni-dateformat>
					</view>

				</view>

				<view class="pic">
					<image src="../../static/logo.png" mode="aspectFill"></image>
				</view>
			</view>

		</view>


		<!-- 编辑 -->
		<view class="goAdd" @click="goAdd">
			<uni-icons type="plusempty" size="30" color="#fff"></uni-icons>
		</view>

		<view class="loading" v-if="listArr">
			<view v-if="loading==1">
				数据加载中...
			</view>
			<view v-else if="loading==2">
				没有更多数据了
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				listArr: [],
				// 定义loading加载的状态
				loading: 0, // 0:默认 1:加载中 2:没有更多了
			}
		},
		onLoad() {
			this.getData()
		},
		onShow() {
			this.getData()
		},
		// 触底的方法
		onReachBottom() {
			// 如果已经触底没有更多了 就需要再发起请求了
			if (this.loading == 2) {
				return;
			}

			this.getData()
			this.loading = 1;
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.listArr = [];
			this.getData();
			// 一滑动就把loding 的状态赋值
			this.loading = 1;

		},

		methods: {
			// 获取数据库列表数据
			getData() {
				uniCloud.callFunction({
					name: "art_get_all",
					data: {
						// 过滤的是获取的数据长度 第一次是0
						skip: this.listArr.length
					}
				}).then((res) => {
					if (res.result.data.length == 0) {
						this.loading = 2;
					};

					// 上一次获取的列表数据
					let oldList = this.listArr;
					// 拼接两次数据
					let nsList = [...this.listArr, ...res.result.data];
					this.listArr = nsList;

					uni.stopPullDownRefresh()
				})
			},



			// 点击跳转到新增页面
			goAdd() {
				uni.navigateTo({
					url: "/pages/add/add"
				})
			},

			// 点击跳转详情页
			goDetail(e) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + e,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home {

		// 内容板块
		.content {
			padding: 30rpx;


			.item {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0;
				border-bottom: 1prx solid #eee;

				.pic {
					width: 260rpx;
					height: 180rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					text-align: justify;
					padding-right: 20rpx;

					.title {
						font-size: 34rpx;
						color: #333;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden; //溢出内容隐藏
						text-overflow: ellipsis; //文本溢出部分用省略号表示
						display: -webkit-box; //特别显示模式
						-webkit-line-clamp: 2; //行数
						line-clamp: 2;
						-webkit-box-orient: vertical; //盒子中内容竖直排列	
						//  如果遇到了问题 第二号省略号，第三行依然显示字 需要额外加个view  把上述样式加入新的view 就可以解决
					}

					.info {
						font-size: 28rpx;
						color: #888;

						text {
							padding-left: 20rpx;
							padding-right: 20rpx;
						}
					}
				}
			}
		}


		// 去编辑
		.goAdd {
			width: 120rpx;
			height: 120rpx;
			background: #41cfff;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			font-size: 50rpx;
			position: fixed;
			right: 60rpx;
			bottom: 100rpx;
			box-shadow: 0 0 20rpx rgba(73, 208, 253, 0.8);
		}

		.loading {
			text-align: center;
			font-size: 26rpx;
			color: #888;
			line-height: 2em;
		}
	}
</style>
