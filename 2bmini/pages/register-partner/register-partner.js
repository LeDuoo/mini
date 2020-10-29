import api from '../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxlogin: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var strs = decodeURIComponent(e.q).split('?');
        var arr = decodeURIComponent(strs[1]).split('&');
        var uid = decodeURIComponent(arr[0]).split("=");
        // var type = decodeURIComponent(arr[1]).split("=");
        // var uid = decodeURIComponent(arr[2]).split("=");
        console.log("uid",uid)
        this.setData({
            // cs: cs[1],
            // type: type[1],
            uid: uid[1]
        })
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                userInfo
            })
        } else {
            this.setData({
                wxlogin: true,
            })
        }
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
     * 注册
     */
    formSubmit(e) {
        var userInfo = this.data.userInfo;
        if (!userInfo) {
            this.setData({
                wxlogin: true,
            })
            return false
        }
        var value = e.detail.value;
        var cus_mobile = value.cus_mobile;
        var password = value.password;
        var password1 = value.password1;
        if (cus_mobile == '') {
            wx.showToast({
                title: '注册手机号不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        var reg = /^1[3456789]\d{9}$/;
        if (!reg.test(cus_mobile)) {
            wx.showToast({
                title: '您输入的手机号有误',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (password == '') {
            wx.showToast({
                title: '注册密码不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (password1 == '') {
            wx.showToast({
                title: '注册密码不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (password.length < 6 || password.length > 32) {
            wx.showToast({
                title: '密码长度6-32位',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (password1.length < 6 || password.length1 > 32) {
            wx.showToast({
                title: '密码长度6-32位',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        this.RegisterPartner(cus_mobile, password,password1)
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
                console.log(res)
                var companyId = wx.getStorageSync('c_id') ? wx.getStorageSync('c_id') : "";
                wx.getUserInfo({
                    success: function (res) {
                        var rawData = res.rawData;
                        that.WeixinminiAuth(code, res.encryptedData, res.iv, res.signature, rawData, companyId)
                    }
                })

                // that.WeixinAuth(code, type, companyId);
            },
            fail: (res) => {
                console.log("失败",res)
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
    WeixinminiAuth(code, encryptedData, iv, signature, rawData, companyId) {
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
                    var userInfo = res.data.data.res;
                    that.setData({
                        userInfo
                    })
                    wx.setStorage({
                        data: userInfo,
                        key: 'userInfo',
                    })
                    if (res.data.data.tag == 0) {
                        wx.showToast({
                            title: res.data.data.res,
                            icon: "none",
                            duration: 2000
                        })
                    }
                    wx.hideLoading()
                    that.onShow();
                }
            },
            fail: function (res) {
                wx.hideLoading()
            }
        })
    },
    /**
     * 注册云店主
     */
    RegisterPartner(cus_mobile, password,password1) {
        var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.Partner.RegisterPartner",
            method: "POST",
            data: {
                unionid: that.data.userInfo.unionid,
                username:cus_mobile,
                password,
                repassword:password1,
                uid:that.data.uid,
                wx_nickname:that.data.userInfo.wx_nickname,
                wx_headimgurl:that.data.userInfo.wx_headimgurl,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log("注册返回值",res)
                wx.setStorage({
                    key: 'undata',
                    data: 1,
                }) 
                if (res.data.code == 200) {
                    wx.showToast({
                        title: "注册成功",
                        icon: 'none',
                        duration: 1000
                    })
                    wx.request({
                        url: api.apiServer + "?s=Wechat.Auth.GetCustomerInfo",
                        method: "GET",
                        data: {
                            unionid: that.data.userInfo.unionid,
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            if (res.data.data.tag == 1) {
                                var userInfo = res.data.data.res;
                                wx.setStorage({
                                    data: userInfo,
                                    key: 'userInfo',
                                })
                                setTimeout(() => {
                                    wx.switchTab({
                                        url: '../index/index'
                                    })
                                }, 1100)
                            } else {
                                wx.showToast({
                                    title: res.data.data.res,
                                    icon: "none",
                                    duration: 2000
                                })
                            }
                        },
                        fail: function (res) {

                        }
                    })
                } else if (res.data.code == 201) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1000
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none', 
                        duration: 1000
                    })
                    setTimeout(() => {
                        wx.switchTab({
                            url: '../index/index'
                        })
                    }, 2100)

                }

            },
            fail: function (res) {
                wx.hideLoading()

            }
        })
    },
})