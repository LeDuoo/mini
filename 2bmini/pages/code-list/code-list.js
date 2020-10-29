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
    onLoad: function () {
        var userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        })
        this.QueryCompany();
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
     * 查看商城二维码
     */
    userCodeRouter(e){
        wx.navigateTo({
          url: '../code/code?id='+e.currentTarget.dataset.id,
        })
    },
       /**
     * 获取用户商城列表
     */
    QueryCompany() {
        var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.Customer.QueryCompany",
            method: "GET",
            data: {
                cusId: that.data.userInfo.id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if(res.data.data.tag==1){
                        that.setData({
                            QueryCompany: res.data.data.res
                        })
                    }else{
                        wx.showToast({
                          title: res.data.data.res,
                          icon:"none",
                          duration:2000
                        })
                    }
                    
                }
            },
            fail: function (res) {

            }
        })
    },
})