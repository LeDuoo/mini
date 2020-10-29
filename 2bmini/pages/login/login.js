import api from '../../api';
const app =  getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		wxlogin:true,
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
     * 登录
     */
    loginAciton(){
        this.setData({ wxlogin:true})
       
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

                //var companyId = wx.getStorageSync('c_id')?wx.getStorageSync('c_id'):"";
                var companyId = app.globalData.c_id;
                // var companyId = wx.getStorageSync('c_id')
                wx.getUserInfo({
                    success: function(res) {
                        var rawData = res.rawData;
                        that.WeixinminiAuth(code, res.encryptedData, res.iv,res.signature,rawData,companyId)
                    }
                  })
            },
            fail: (res) => {
            }
        })
    },
    /**
     * 暂不登录
     */
    cancelLogin(e) {
        // this.setData({
        //     wxlogin: false
		// })
		wx.showToast({
		  title: '请登录',
		  icon:"none",
		  duration:2000
		})
    },
    /**
     * 小程序登入
     */
    WeixinminiAuth(code, encryptedData, iv,signature,rawData,companyId) {
        wx.showLoading({
            title: '登录中',
          })
        var that = this;
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
                    if(res.data.data.tag==1){
                        var userInfo = res.data.data.res;
                        that.setData({
                            userInfo
                        })
                        wx.setStorage({
                            key: 'userInfo',
                            data: userInfo,
                         
                        }) 
                        wx.setStorage({
                            key: 'undata',
                            data: 1,
                           
                        }) 
                        if(res.data.data.tag==0){
                            wx.showToast({
                              title: res.data.data.res,
                              icon:"none",
                              duration:2000
                            })
                        }
						wx.switchTab({
							url: '../index/index'
						  })
                    }else{
                        wx.showToast({
                            title:res.data.data.res,
                            icon:"none",
                            duration:2000
                          })  
                    }
                  
                }else{
                    wx.hideLoading()
                    wx.showToast({
                        title:"服务器出错",
                        icon:"none",
                        duration:2000
                      })
                 
                }
                
            },
            fail: function (res) {
                wx.hideLoading()
            }
        })
    },
})