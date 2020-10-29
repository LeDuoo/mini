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
        var userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        })
        var express_order = e.expressorder;
        var order_sn = e.ordersnsmall;
        this.Query(order_sn,express_order);

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
     * 快递信息
     */
    Query(order_sn,express_order) {
        var that = this;
        wx.request({
            url: api.apiServer + "?s=Express.Message.Query",
            method: "POST",
            data: {
                order_sn,
                express_order
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if(res.data.data.res.returnCode==200){
                        for(var i=0;i<res.data.data.res.data.length;i++){
                            var str=res.data.data.res.data[i].time.split(' ');
                            var date = str[0].split('-');
                            var time = str[1].split(':');
                            var arr = [];
                            date = date[1]+'-'+ date[2];
                            time = time[0]+'-'+ time[1];
                            arr.push(date)
                            arr.push(time)
                            res.data.data.res.data[i].str = arr;
                        }
                        that.setData({
                            logistics:res.data.data.res
                        })
                    }else{
                        wx.showToast({
                            title: res.data.data.res.message,
                            icon: 'none',
                            duration: 1000
                        })  
                    }
                  
                } else {
                    wx.showToast({
                        title: res.data.res,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: "服务器异常",
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },

})