import api from '../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isIpx: 0,
		partnerUserInfo: {
			sure_profit: 0
		},
		flag: 1,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		var partnerUserInfo = wx.getStorageSync('partnerUserInfo');
		var that = this;
		if (partnerUserInfo) {
			this.setData({
				partnerUserInfo
			})
		} else {
			wx.reLaunch({
				url: './../partner_login/partner_login'
			})
		}
		wx.getSystemInfo({
			complete: (res) => {
				if (res.safeArea.top > 40) {
					that.setData({
						isIpx: 1
					})
				}
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.Amount();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},
	/**
	 * 注销
	 */
	cancellationAction() {
		var that = this;
		wx.showModal({
			title: '系统提示',
			content: '是否注销商城',
			success(res) {
				if (res.confirm) {
					wx.clearStorageSync();
					that.setData({
						partnerUserInfo: ""
					})
					wx.reLaunch({
						url: '../user/user'
					})
				} else if (res.cancel) {

				}
			}
		})
	},
	/**
	 * 提现按钮
	 */
	formSubmit(e) {
		var sure_profit = this.data.partnerUserInfo.sure_profit;
		var val = e.detail.value
		var user_name = val.user_name;
		var mobile = val.mobile;
		var money = val.money;
		var payment = val.payment;
		if (user_name == '') {
			wx.showToast({
				title: '收款人姓名必填',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		if (mobile == '') {
			wx.showToast({
				title: '联系电话必填',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		var reg = /^1[3456789]\d{9}$/;
		if (!reg.test(mobile)) {
			wx.showToast({
				title: '您输入的手机号有误',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		if (money == '') {
			wx.showToast({
				title: '提现金额必填',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		if (money <= 0) {
			wx.showToast({
				title: '提现金额必须大于0',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		if ((money*100) > sure_profit ) {
			wx.showToast({
				title: '提现金额不能大于可提现总额',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		if (payment == '') {
			wx.showToast({
				title: '收款方式必填',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		if (this.data.flag == 0) {
			wx.showToast({
				title: '请不要频繁提交',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		this.Withdrawal(user_name, mobile, money, payment);
	},
	/**
	 * 更新数据
	 */
	Amount() {
		var that = this;
		wx.request({
			url: api.apiServer + "?s=Wechat.drawal.Amount",
			method: "GET",
			data: {
				id: that.data.partnerUserInfo.id
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				if (res.data.code == 200) {
					wx.setStorage({
						key: 'partnerUserInfo',
						data: res.data.data,
					})
					that.setData({
						partnerUserInfo: res.data.data
					})

				} else {
					// wx.showToast({
					// 	title: res.data.msg,
					// 	icon: 'none',
					// 	duration: 2000
					//   }) 
				}
				//    wx.hideLoading()

			},
			fail: function (res) {
				// wx.hideLoading()

			}
		})
	},
	/**
	 * 提现接口
	 */
	Withdrawal(user_name, mobile, money, payment) {
		var that = this;
		wx.request({
			url: api.apiServer + "?s=Wechat.drawal.Withdrawal",
			method: "POST",
			data: {
				id: that.data.partnerUserInfo.id,
				user_name,
				mobile,
				money,
				payment
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				if (res.data.code == 200) {
					that.setData({
						flag: 0
					})
					//    wx.hideLoading();
					wx.showToast({
						title: '申请已提交',
						icon: "none",
						duration: 1000
					})
					that.Amount();
					setTimeout(() => {
						that.setData({
							flag: 1
						})
						wx.navigateTo({
						  url: '../examine/examine',
						})
					}, 1000)
				} else {}

			},
			fail: function (res) {

			}
		})
	},
})