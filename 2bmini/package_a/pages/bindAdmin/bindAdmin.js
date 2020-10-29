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
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
            jkUserInfo 
        })
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
        console.log( this.data.jkUserInfo.unionid)
        var cus_mobile = e.detail.value.cus_mobile;
        var cus_pwd = e.detail.value.cus_pwd;
        this.BindAdmin(cus_mobile, cus_pwd)
    },

    /**
     * 注册云店主
     */
    BindAdmin(cus_mobile, cus_pwd) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.SignIn.BindAdmin",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo .unionid,
                cus_mobile,
                cus_pwd
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.code == 200) {
                    wx.showToast({
                        title: "绑定成功",
                        icon: 'none',
                        duration: 1000
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta:1
                          })
                    }, 2100)
                } else if (res.data.code == 201) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1000
                    })
                } else {
                  
                    

                }

            },
            fail: function (res) {
                wx.hideLoading()

            }
        })
    },
})