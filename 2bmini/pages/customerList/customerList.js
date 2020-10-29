import api from '../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		page:1,
		list:[]
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
		var that = this;
        if(partnerUserInfo){
            this.setData({
                partnerUserInfo 
            })
        }else{
            wx.reLaunch({
                url: './../login/login'
              })
		}  
		wx.getSystemInfo({
			complete: (res) => {
				if(res.safeArea.top>40){
					that.setData({
					  isIpx:1
					})
				}
			}
		  })
		this.GetJoin()
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
        this.GetJoin();  
	},
	 /**
     * 客户信息
     */
    GetJoin() {
		var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.Partner.GetJoin",
            data: {
				id:that.data.partnerUserInfo.id,
				page:that.data.page,
				pagesize:20
            },
            method: "POST",
            header: {
				'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
			   if(res.data.ret==200){
				   	that.setData({
						   list:res.data.data.res.list
					   })
			   }else{

			   }

            },
            fail: function (res) {

            }
        })
	},
	/**
     * 注销
     */
    cancellationAction(){
        var that = this;
        wx.showModal({
            title: '系统提示',
            content: '是否注销商城',
            success(res) {
                if (res.confirm) {
                    wx.clearStorageSync();
                    that.setData({
                        partnerUserInfo:""
                    })
                    wx.reLaunch({
                        url: '../login/login'
                    })
                } else if (res.cancel) {

                }
            }
        }) 
    },
})