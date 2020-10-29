import api from '../../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		wx.setNavigationBarTitle({
            title: '修改个人信息'
        })
		var jkUserInfo = wx.getStorageSync('jkUserInfo');
		this.setData({
			jkUserInfo,
			cus_address:jkUserInfo.cus_address?jkUserInfo.cus_address:"暂无地址",
			wx_nickname:jkUserInfo.wx_nickname
		})
	},
	/**
	 * 修改个人信息
	 */
	regAction(){
		this.EditInfo();
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
     * 修改个人信息
     */
    EditInfo(){
		var that = this;
		var cus_address = this.data.cus_address
		if(cus_address=="暂无地址"){
			cus_address = ""
		}else{

		}
        wx.request({
            url: api.jkServer+"?s=Wechat.SignIn.EditInfo",
            method: "POST",
            data: {
				unionid:that.data.jkUserInfo.unionid,
				wx_nickname:that.data.wx_nickname,
				cus_address
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
			   console.log("修改个人信息",res)
			   if(res.data.code=="200"){
				   console.log("1111111111111")

					 wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        duration: 2000
                    })
			   }else{
				wx.showToast({
					title: res.data.msg,
					icon: "none",
					duration: 2000
				})
			   }
            },
            fail: function (res) {
				wx.showToast({
					title: "服务器连接失败",
					icon: "none",
					duration: 2000
				})
            }
        })   
    },

	
})