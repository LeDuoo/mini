import api from '../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		num:0,
		page:1,
		
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		var userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
		})
		// this.GetInvitation();
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
		this.GetInvitation();
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
		var page = this.data.page;
        page++;
        this.setData({
			page,
			
        })
        this.GetInvitation();  
	},

	 /**
     * 客户信息
     */
    GetInvitation() {
		var that = this;
		var unionid = that.data.userInfo.unionid;
        wx.request({
            url: api.apiServer + "?s=Wechat.Order.GetInvitation",
            data: {
				unionid,
				page:that.data.page,
				pagesize:20
            },
            method: "POST",
            header: {
				'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
			   if(res.data.ret==200){
				   if(res.data.data.tag==1){
					   that.setData({
						   list:res.data.data.res.list,
						   num:res.data.data.res.num
					   })
				   }
			   }

            },
            fail: function (res) {

            }
        })
    },
})