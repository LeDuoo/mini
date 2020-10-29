import api from '../../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusType: [{
			type: 0,
			label: '积分明细'
		},
		{
			type: 1,
			label: '兑换纪录'
		}
	],
	type:0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {

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
		var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
            jkUserInfo
		})

		this.SignDetail();
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

	statusTap: function (e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            type,
        });
	},
	/**
     * 获取积分详情
     */
    SignDetail() {
		var that = this;
		console.log("获取积分详情")
        wx.request({
            url: api.jkServer + "?s=Wechat.SignIn.SignDetail",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
				console.log(res)
				if(res.data.code==200){
					that.setData({
						SignDetail:res.data.data
					})
				}
            },
            fail: function (res) {
			console.log(res)
            }
        })
    },
})