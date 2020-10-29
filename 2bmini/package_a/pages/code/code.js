import api from '../../../api';
const app =  getApp();
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
            title: '分享商城'
        })
        this.setData({
            pid:e.pid
        })
        this.GetShareCode();
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
     * 保存图片到系统相册
     */
    saveImageAction(){
        var poster = this.data.GetShareCode;
        console.log(app)
        app.picture(poster,1)
       
    },
       /**
     * 获取商城二维码
     */
    GetShareCode() {
        var that = this;
        wx.showLoading({
          title: '加载中...',
        })
        wx.request({
            url: api.jkServer + "?s=Wechat.Orderimg.GetShareCode",
            method: "GET",
            data: {
                pid: that.data.pid,
                type:1
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    that.setData({
                        GetShareCode: res.data.data
                    })
                }
               
                setTimeout(() => {
                  wx.hideLoading()
                }, 400);
              
            },
            fail: function (res) {
              wx.hideLoading()
            }
        })
    },
})