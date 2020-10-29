import api from '../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address:{},//用户收货地址
        isIpx:0,//是否为苹果x xr 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        })
        var that = this;
        //判断用户设备是否为异型屏苹果
        wx.getSystemInfo({
          complete: (res) => {
              if(res.safeArea.top>40){
                  that.setData({
                    isIpx:1
                  })
              }
          }
        })
        this.QueryAddress();
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
        this.QueryAddress();
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
     * 设为默认地址
     */
    setDefAction(e){
        var openid= "o3aJ2wG8sm3NnTO0N44bO-QVahWc";
        var address_id = e.currentTarget.dataset.id;
        this.SetDefaultAddress(openid,address_id);
    },
    /**
     * 进入新进修改地址页面
     */
    addressInfoRoute(e){
     
        wx.navigateTo({
            url: '../address-info/address-info?type=1', //type=1为新建地址
        })
    },
    /**
     * 进入修改地址页面
     */
    updJdAddressRoute(e){
        var address = this.data.address;
        var index = e.currentTarget.dataset.id;
        var obj = address[index];
        obj = JSON.stringify(obj);
        wx.navigateTo({
            url: '../address-info/address-info?type=2&obj='+obj, //type=2为修改地址
        }) 
    },
    /**
     * 获取用户收货地址
     */
    QueryAddress() {
        wx.showLoading({
            title: '加载中',
          })
        var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.Customer.QueryAddress",
            method: "GET",
            data: {
                unionid: that.data.userInfo.unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    that.setData({
                        address: res.data.data
                    })
                }
                wx.hideLoading();
            },
            fail: function (res) {
                wx.hideLoading();
            }
        })
    },
    /**
     * 设为默认地址接口
     */
    SetDefaultAddress(openid,address_id) {
        var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.Customer.SetDefaultAddress",
            method: "POST",
            data: {
                unionid: that.data.userInfo.unionid,
                address_id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var address = that.data.address;
                wx.showToast({
                    title: res.data.data.res,
                    icon: 'none',
                    duration: 2000
                  })
                  for(var i=0;i<address.length;i++){
                    address[i].is_default='0';
                      if(address[i].id==address_id){
                        address[i].is_default='1';
                      }
                  }
                 
                  that.setData({
                    address 
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                //   setTimeout(function(){
                //     wx.navigateBack({
                //         delta: 1
                //       })
                //   },2000)
                  
            },
            fail: function (res) {

            }
        })
    },
})