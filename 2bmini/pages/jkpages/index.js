import api from '../../api';
const app =  getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		wxlogin:false,
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
		var userInfo = wx.getStorageSync('userInfo');
		this.setData({
            userInfo
		})
		if(userInfo){
			wx.navigateTo({
				url: '../../package_a/pages/index/index'
			  })
		}else{
			this.setData({
				wxlogin:true
			})
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
                var companyId = app.globalData.c_id;
                wx.getUserInfo({
                    success: function(res) {
                        var rawData = res.rawData;
                        console.log(res.code)
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
                        wx.hideLoading()
                        that.onShow();
                        that.GetCompany();
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
    /**
     * /**
     * 获取商城默认数据
     */
    GetCompany() {
        var that = this;
        var unionid = that.data.userInfo?that.data.userInfo.wx_unionid:"";
        var company_id = wx.getStorageSync('c_id');
        wx.request({
            url: api.apiServer + "?s=Wechat.Customer.GetCompany",
            method: "GET",
            data: {
                unionid,
                company_id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }, 
            success: function (res) {
                if(res.data.ret==200){
                    if(res.data.data.tag!=0){
                   
                    }
                }
            },
            fail: function (res) {

			}
			
        })
	},
	
})