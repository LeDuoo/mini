import api from '../../../api';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxlogin: false,
        jkUserInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var jkUserInfo = wx.getStorageSync('jkUserInfo');

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
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
            jkUserInfo
        })
        if (jkUserInfo) {
            wx.request({
                url: api.jkServer + "?s=Wechat.Auth.GetCustomerInfo",
                method: "GET",
                data: {
                    unionid: jkUserInfo.wx_unionid
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {

                    if (res.data.data.tag == 1) {
                        var jkUserInfo = res.data.data.res;
                        wx.setStorage({
                            data: jkUserInfo,
                            key: 'jkUserInfo',
                        })
                        that.setData({
                            jkUserInfo,
                        })
                    } else {
                        wx.showToast({
                            title: res.data.data.res,
                            icon: "none",
                            duration: 2000
                        })
                        // wx.clearStorage();
                    }
                },
                fail: function (res) {

                }
            })
        } else {

        }
        if (jkUserInfo) {
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
     *modifyUser 进入修改用户信息
     */
    modifyUser(){
        wx.navigateTo({
          url: '../modifyUser/modifyUser',
        })
    },
    /**
     * codeRouter进入邀请二维码
     */
    codeRouter(){
        var jkUserInfo = this.data.jkUserInfo
        console.log(jkUserInfo)
        wx.navigateTo({
          url: '../code/code?pid='+jkUserInfo.id,
        })
    },
    /**
     * 进入订单详情页面
     */
    goOrder(e) {
        var jkUserInfo = this.data.jkUserInfo;
        if (jkUserInfo) {
            var status = e.currentTarget.dataset.type;
            wx.navigateTo({
                url: '../order_list/order_list?status=' + status,
            })
        } else {
            this.setData({
                wxlogin: true
            })
        }
    },
    /**
     * 进入订单详情页面
     */
    orderListRouter() {
        var jkUserInfo = this.data.jkUserInfo;
        if (jkUserInfo) {
            wx.navigateTo({
                url: '../order_list/order_list',
            })
        } else {
            this.setData({
                wxlogin: true
            })
        }
    },
    /**
     * 进入提现页面
     */
    postalRoute() {
        var money = this.data.jkUserInfo.sure_profit;
        wx.navigateTo({
            url: '../profitCash/profitCash?money=' + money,
        })
    },
    /**
     * 进入收益详情
     */
    detailAction() {
        wx.navigateTo({
            url: '../cloud-detail/cloud-detail',
        })
    },
    /**
     * 进入地址页
     */
    addressRoute() {
        var jkUserInfo = this.data.jkUserInfo;
        if (jkUserInfo) {
            wx.navigateTo({
                url: '../address/address',
            })
        } else {
            this.setData({
                wxlogin: true
            })
        }
    },
    /**
     * 登录
     */
    loginAciton() {
        this.setData({
            wxlogin: true
        })

    },
    /**
     * 进入合伙人页面
     */
    partnerRoute() {
        // var partnerUserInfo = wx.getStorageSync('partnerUserInfo');
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        if (jkUserInfo.cus_id == 0) {
            wx.navigateTo({
                url: '../partner/partner',
            })
        } else {
            wx.showToast({
                title: '审核中...',
                icon: "none",
                duration: 2000
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
                        jkUserInfo: ""
                    })
                    wx.setStorage({
                        data: 1,
                        key: 'undata',
                    })
                    wx.switchTab({
                        url: '../../../pages/index/index'
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
            url: api.jkServer + "?s=Wechat.Order.GetOrderCount",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
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
    clearStorage() {
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
                    success: function (res) {
                        var rawData = res.rawData;
                        console.log(res.code)
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
        this.setData({
            wxlogin: false
        })
    },

    /**
     * /**
     * 获取商城默认数据
     */
    GetCompany() {
        var that = this;
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        var company_id = wx.getStorageSync('c_id');
        wx.request({
            url: api.jkServer + "?s=Wechat.Customer.GetCompany",
            method: "GET",
            data: {
                unionid,
                company_id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag != 0) {

                    }
                }
            },
            fail: function (res) {

            }
        })
    },

})