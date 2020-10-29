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
        var partnerUserInfo = wx.getStorageSync('partnerUserInfo');
        if (partnerUserInfo) {
            this.setData({
                partnerUserInfo
            })
            this.Amount();
        } else {
            this.Login();

        }
        
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
     * 进入提现页面
     */
    postalRoute() {
        wx.navigateTo({
            url: './../postal/postal',
        })
    },
    /**
     * 进入收益详情
     */
    detailAction() {
        wx.navigateTo({
            url: './../partner-detail/partner-detail',
        })
    },
    /**
     * 进入客户列表
     */
    customerListRoute() {
        wx.navigateTo({
            url: './../customerList/customerList',
        })
    },
    /**
     * 发展新用户
     */
    juniorRoute() {
        wx.navigateTo({
            url: './../junior/junior',
        })
    },
    /**
     * 进入提现列表
     */
    examineRoute() {
        wx.navigateTo({
            url: './../examine/examine',
        })
    },
    /**
     * 扩展云店主
     */
    expansionPartner(e){
        wx.navigateTo({
            url: './../expansionPartner/expansionPartner',
        })
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
                id: that.data.partnerUserInfo.id,
                unionid:that.data.partnerUserInfo.unionid
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
	 * 登录接口
	 */
	Login(){
        var userInfo = wx.getStorageSync('userInfo');
        var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.Partner.Login",
            method: "POST",
            data: {
				unionid:userInfo.unionid,
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
				  wx.setStorage({
					key: 'partnerUserInfo',
					data: res.data.data,
                }) 
                that.setData({
                    partnerUserInfo:   res.data.data
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