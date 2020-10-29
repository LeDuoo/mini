import api from '../../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusType: [{
                status: -1,
                label: '全部'
            },
            {
                status: 0,
                label: '待支付'
            },
            {
                status: 2,
                label: '已支付'
            },
            {
                status: 99,
                label: '待审核'
            },
            {
                status: 4,
                label: '已出库'
            },
            {
                status: 5,
                label: '已完成'
            },
        ],
        status: -1,
        page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
            jkUserInfo
        })
       
        if (e.status) {
            var status = e.status;
            this.setData({
                status
            })
        }

        // this.OrderQuery()
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
        var jkUserInfo = this.data.jkUserInfo;
        var that = this;
        if(jkUserInfo){
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
        }
        this.setData({
            page: 1
        })
        this.OrderQuery()
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
        var page = this.data.page;
        page++
        this.setData({
            page
        })
        this.OrderQuery();
    },

    statusTap: function (e) {
        const status = e.currentTarget.dataset.status;

        this.setData({
            status,
            orderList: []
        });
        this.OrderQuery();
    },
    /***
     * 查看物流
     */
    queryExpress(e) {
        var expressorder = e.currentTarget.dataset.expressorder;
        var ordersnsmall = e.currentTarget.dataset.ordersnsmall;
        wx.navigateTo({
            url: '../express-information/express-information?expressorder=' + expressorder + '&ordersnsmall=' + ordersnsmall,
        })
    },
    /**
     * 确认收货
     */
    confirmReceipt(e) {
        var order_small_id = e.currentTarget.dataset.id;
        this.confirmOrderSmall(order_small_id);
    },
    /**
     * 取消订单
     */
    actionCancel(e) {
        var order_sn = e.currentTarget.dataset.ordersn;
        var that = this;
        wx.showModal({
            title: '系统提示',
            content: '你确定要取消订单吗？',
            success(res) {
                if (res.confirm) {
                    that.Cancel(order_sn);
                } else if (res.cancel) {

                }
            }
        })

    },
    /**
     * 立即支付
     */
    jsApiCall(e) {
        var out_trade_no = e.currentTarget.dataset.ordersn;
        var body = e.currentTarget.dataset.name;
        this.WxMiniPay(out_trade_no, body)
    },
    /**
     * 申请退款
     */
    refund(e) {
        var tel = wx.getStorageSync('company');
        tel = tel.company.kf_tel;
        wx.showModal({
            title: '系统提示',
            content: '是否联系客服退款',
            success(res) {
                if (res.confirm) {
                    wx.showActionSheet({
                        itemList: ['呼叫', '复制', '添加到手机通讯录'],
                        success(res) {
                            if (res.tapIndex == 0) {
                                wx.makePhoneCall({
                                    phoneNumber: tel

                                })
                            }
                            if (res.tapIndex == 1) {
                                wx.setClipboardData({
                                    data:tel,
                                    success(res) {
                                        wx.getClipboardData({
                                            success(res) {

                                            },
                                            fail(res) {

                                            }
                                        }) 
                                    },
                                    fail(res) {

                                    }
                                })
                            }
                            if (res.tapIndex == 2) {
                                wx.addPhoneContact({
                                    firstName: "特拱商城",
                                    mobilePhoneNumber: tel
                                })
                            }
                        },
                        fail(res) {

                        }
                    })
                } else if (res.cancel) {

                }
            }
        })

    },
    /**
     * 退款审核
     */
    refundApply(e) {

    },
    /**
     * 申请发票
     */
    applyInvoice(e) {

    },
    /**
     * 查看发票
     */
    getInvoice(e) {


    },
    /**
     * 获取用户所有订单
     */
    OrderQuery() {
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        var status = that.data.status;
        wx.request({
            url: api.jkServer + "?s=Wechat.Order.Query",
            method: "GET",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                status,
                page: that.data.page
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    var orderList = that.data.orderList;
                    var newList = res.data.data.list;
                    if (status == 77) {
                        for (var i = 0; i < newList.length; i++) {
                            newList[i].userType = 77;
                        }
                    }
                    if (orderList && orderList.length > 0) {
                        orderList = [...orderList, ...newList];
                        that.setData({
                            orderList
                        })
                        wx.hideLoading();
                    } else {
                        that.setData({
                            orderList: newList,
                            page: 1
                        })
                        wx.hideLoading();
                    }
                    if(that.data.page==1){
                        that.setData({
                            orderList: res.data.data.list
                        })
                    }
                }
            },
            fail: function (res) {
                wx.hideLoading();
            }
        })
    },
    /**
     * 确认收货
     */
    confirmOrderSmall(order_small_id) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Order.confirmOrderSmall",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                order_small_id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        that.OrderQuery();
                    } else {
                        wx.showToast({
                            title: res.data.data.res,
                            icon: 'none',
                            duration: 1000
                        })
                    }

                } else {
                    wx.showToast({
                        title: "服务器异常",
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
    /**
     * 取消订单
     */
    Cancel(order_sn) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Order.Cancel",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                order_sn
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        wx.showToast({
                            title: res.data.data.res,
                        })
                        that.setData({
                            page: 1,
                            orderList: []
                        })
                        that.OrderQuery();
                    }
                } else {
                    wx.showToast({
                        title: "服务器异常",
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
    /**
     * 支付接口
     */
    WxMiniPay(out_trade_no, body) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.WxPay.WxMiniPay",
            method: "POST",
            data: {
                out_trade_no,
                body: "特拱商城微信小程序支付",

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var data = res.data.data.res;
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: 'prepay_id=' + data.prepay_id,
                    signType: 'MD5',
                    paySign: data.paySign,
                    success(res) {
                        that.onShow();
                    },
                    fail(res) {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            },

            fail: function (res) {

            }
        })
    },
})