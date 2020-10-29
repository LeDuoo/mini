import api from '../../api';
const app =  getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxlogin:false,
        userInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var userInfo = wx.getStorageSync('userInfo');
 
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
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        })
        if(userInfo){
            wx.request({
              url: api.apiServer + "?s=Wechat.Auth.GetCustomerInfo",
              method: "GET",
              data: {
                unionid:userInfo.wx_unionid
              },
              header: {
                  'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {

                  if(res.data.data.tag==1){
                    var userInfo = res.data.data.res;
                    wx.setStorage({
                        data: userInfo,
                        key: 'userInfo',
                    })
                    that.setData({
                        userInfo,
                    })
                  }else{
                    wx.showToast({
                      title: res.data.data.res,
                      icon:"none",
                      duration:2000
                    })
                    wx.clearStorage();
                  }
              },
              fail: function (res) {
                
              }
          })
          }else{
            
          }
        if(userInfo){
            this.GetOrderCount();
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
     * 进入订单详情页面
     */
    goOrder(e){
        var userInfo = this.data.userInfo;
        if(userInfo){
            var status = e.currentTarget.dataset.type;
            wx.navigateTo({
              url: '../order_list/order_list?status='+status,
            })
        }else{
            this.setData({
                wxlogin:true
            })
        }
    },
    /**
     * 进入订单详情页面
     */
    orderListRouter(){
        var userInfo = this.data.userInfo;
        if(userInfo){
            wx.navigateTo({
              url: '../order_list/order_list',
            })
        }else{
            this.setData({
                wxlogin:true
            })
        }
    },
    /**
     * 进入提现页面
     */
    postalRoute(){
        var money = this.data.userInfo.sure_profit;
        wx.navigateTo({
          url: '../profitCash/profitCash?money='+money,
        })  
    },
    /**
     * 进入收益详情
     */
    detailAction(){
        wx.navigateTo({
            url: '../cloud-detail/cloud-detail',
          })
    },
    /**
     * 进入地址页
     */
    addressRoute(){
        var userInfo = this.data.userInfo;
        if(userInfo){
            wx.navigateTo({
              url: '../address/address',
            })
        }else{
            this.setData({
                wxlogin:true
            })
        }
    },
    /**
     * 登录
     */
    loginAciton(){
        this.setData({ wxlogin:true})
       
    },
    /**
     * 进入合伙人页面
     */
    partnerRoute(){
       // var partnerUserInfo = wx.getStorageSync('partnerUserInfo');
       var userInfo = wx.getStorageSync('userInfo');
            if(userInfo.cus_id==0){
                wx.navigateTo({
                    url: '../partner/partner',
                  })
            }else{
                wx.showToast({
                  title: '审核中...',
                  icon:"none",
                  duration:2000
                })
            }

        // else{
      
            
        //     wx.navigateTo({
        //         url: '../partner_login/partner_login',
        //       }) 
        // }
    },
    /**
     * 注销操作
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
                        userInfo:""
                    })
                    wx.setStorage({
                        data:1,
                        key: 'undata',
                    }) 
                    wx.switchTab({
                        url: '../index/index'
                    })
                } else if (res.cancel) {

                }
            }
        })
        // wx.clearStorageSync();
        // wx.switchTab({
        //     url: '../index/index'
        //   })
    },
    /**
     * 获取用户未支付订单数量
     */
    GetOrderCount() {
        var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.Order.GetOrderCount",
            method: "POST",
            data: {
                unionid: that.data.userInfo.unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

                if (res.data.ret == 200) {
                    that.setData({
                        orderCount: res.data.data
                    })
                }
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 长按头像清除缓存
     */
    clearStorage(){
        wx.clearStorage()
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
                        console.log("code::",code)
                        wx.setStorage({
                            key: 'code',
                            data: code
                        }) 
                        var rawData = res.rawData;
                        console.log(code)
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
        this.setData({
            wxlogin: false
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