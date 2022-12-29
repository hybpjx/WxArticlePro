<template>
	<view class="edit">
		<form @submit="onSubmit">

			<!-- 标题 -->
			<view class="item">
				<input type="text" v-model="formValue.title" name="title" placeholder="请输入标题">
			</view>

			<!-- 作者 -->
			<view class="item">
				<input type="text" v-model="formValue.author" name="author" placeholder="请输入作者">
			</view>

			<!-- 主要内容 -->
			<view class="item">
				<textarea name="content" v-model="formValue.content	" placeholder="请输入内容"></textarea>
			</view>


			<!-- 提交 -->
			<view class="item">
				<button form-type="reset">重置</button>
				<button form-type="submit" type="primary" :disabled="isDisabled(formValue)">提交</button>
			</view>

		</form>
	</view>
</template>

<script>
	let id;
	export default {
		data() {
			return {
				formValue: {
					title: "",
					author: "",
					content: ""
				}
			};
		},

		onLoad(e) {
			id = e.id;
			this.getDetail();
		},
	

		methods: {

			// 获取详情页内容
			getDetail() {
				uniCloud.callFunction({
					name: "art_get_row",
					data: {
						id
					}
				}).then((res) => {
					this.formValue = res.result.data[0]
				})
			},



			// 点击提交触发的事件
			onSubmit() {
				uniCloud.callFunction({
					name: "art_put_row",
					data: {
						detail: this.formValue
					},
				}).then((res) => {
					uni.showToast({
						icon: "success",
						title: "修改成功"
					});
					setTimeout(() => {
						uni.navigateBack({

							delta: 1
						})
					}, 800)


				})
			},


			// 用于判断数据有效性
			isDisabled(obj) {
				for (let key in obj) {
					// console.log(obj[key])
					if (!obj[key]) {
						return true;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.edit {
		padding: 30rpx;

		.item {
			padding-bottom: 20rpx;

			input,
			textarea {
				border: 1rpx solid #eee;
				height: 80rpx;
				padding: 0 20rpx;
			}

			textarea {
				height: 200rpx;
				width: 100%;
				box-sizing: border-box;
			}

			button {
				margin-bottom: 25rpx;
			}
		}
	}
</style>
