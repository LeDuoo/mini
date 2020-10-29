import api from '../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	
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
     *登录
     */
    formSubmit(e){
        var value = e.detail.value;
        var username = value.username;
        var password = value.password;
        if (username == '') {
            wx.showToast({
                title: '账号不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (password == '') {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
		}
        this.Login(username,password)
	},
	/**
	 * 登录接口
	 */
	Login(username,password){
        wx.request({
            url: api.apiServer + "?s=Wechat.Partner.Login",
            method: "POST",
            data: {
				username,
                password
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
			   if(res.data.code==200){
				wx.showToast({
					title: res.data.msg,
					icon: 'none',
					duration: 1000
				  }) 
				  setTimeout(() => {
					wx.reLaunch({
						url: './../partner/partner'
					  })  
				  }, 1001);
				  wx.setStorage({
					key: 'partnerUserInfo',
					data: res.data.data,
				}) 
			   }else{
				wx.showToast({
					title: res.data.msg,
					icon: 'none',
					duration: 2000
				  }) 
			   }
			//    wx.hideLoading()
             
            },
            fail: function (res) {
                // wx.hideLoading()

            }
        })
	},
})