import api from '../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		wxlogin: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		var userInfo = wx.getStorageSync('userInfo');
		if (userInfo) {
			this.setData({
				wxlogin: false,
				userInfo
			})
		} else {
			this.setData({
				wxlogin: true
			})
		}
		var id = decodeURIComponent(decodeURIComponent(decodeURIComponent(e.q).split('?')[1]).split('&')[0]).split("=");
        this.setData({
            id: id[1]
        })
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                userInfo
			})
			this.editCustomer();
        } else {
            this.setData({
                wxlogin: true,
			})
			
		}
		console.log(this.data)
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
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	/**
	 * 授权登录
	 */
	processLogin(e) {
		var that = this;
		this.setData({
			wxlogin: false
		})
		wx.login({
			success: (res) => {
				var code = res.code;
				// var companyId = wx.getStorageSync('c_id')?wx.getStorageSync('c_id'):"";
				var companyId = that.data.c_id;
				wx.getUserInfo({
					success: function (res) {
						var rawData = res.rawData;
						that.WeixinminiAuth(code, res.encryptedData, res.iv, res.signature, rawData, companyId)
					}
				})
			},
			fail: (res) => {}
		})
	},
	/**
	 * 暂不登录
	 */
	cancelLogin(e) {
		wx.showToast({
			title: '请登录',
			icon: "none",
			duration: 2000
		})
	},
	/**
	 * 小程序登入
	 */
	WeixinminiAuth(code, encryptedData, iv, signature, rawData, companyId) {
		var that = this;
		wx.showLoading({
			title: '登录中',
		})
		wx.request({
			url: api.apiServer + "?s=Wechat.Auth.WeixinminiAuth",
			method: "POST",
			data: {
				code,
				encryptedData,
				iv,
				signature,
				rawData,
				companyId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				if (res.data.ret == 200) {
					var userInfo = res.data.data.res;
					that.setData({
						userInfo,
						wxlogin: false
					})
					wx.setStorage({
						data: userInfo,
						key: 'userInfo',
					})
					wx.setStorage({
						data: 1,
						key: 'undata',
					})
					wx.hideLoading()
					that.editCustomer()
				}
			},
			fail: function (res) {
				wx.hideLoading()
			}
		})
	},
	/**
	 * 云店主绑定微信
	 */
	editCustomer() {
		var that = this;
		wx.request({
			url: api.apiServer + "?s=Wechat.customer.editCustomer",
			method: "POST",
			data: {
				id:that.data.id,
				wx_openid:that.data.userInfo.wx_openid,
				wx_headimgurl:that.data.userInfo.wx_headimgurl,
				wx_nickname:that.data.userInfo.wx_nickname,
				mini_openid:that.data.userInfo.mini_openid,
				wx_unionid:that.data.userInfo.wx_unionid,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				console.log("绑定微信",res)
				if(res.data.ret==200){
					if(res.data.data.tag==1){
						wx.showToast({
						  title: '绑定成功',
						  icon:"none",
						  duration:1500
						})
						var timer = setTimeout(function(){
							wx.switchTab({
								url: '../index/index'
							  })
						},1501)
						
					}else{
						wx.showToast({
							title: res.data.data.res,
							icon:"none",
							duration:1500
						  })
						  var timer = setTimeout(function(){
							wx.switchTab({
								url: '../index/index'
							  })
						},1501)
					}
				}
			},
			fail: function (res) {
				wx.showToast({
					title: "网络不稳定",
					icon:"none",
					duration:1500
				  })
			}
		})
	},
})