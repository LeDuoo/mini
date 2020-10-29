import api from '../../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [], //商品列表
        stau: 1, //选中推荐 销量 价格
        order: 2, //价格排序默认等于1
        page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        // wx.setNavigationBarTitle({
        //     title: '商品列表'
        // })
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
            jkUserInfo
        })
        var catId = e.catId;
        var field = "id"
        var order = 2;
        this.setData({
            catId,
            field,
            order,
            page: 1
        })
        this.GetItemList()
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
        var page = this.data.page;
        page++;
        this.setData({
            page
        })
        this.GetItemList();
    },
    /**
     * 拨打电话
     */
    PhoneCall() {
        var tel = wx.getStorageSync('company');
        tel = tel.company.kf_tel;
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
                        data: tel,
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

    },
    /**
     * 进入列表页面
     */
    bindinput() {
        wx.navigateTo({
            url: '../list/list',
        })
    },
    /**
     * 综合推荐
     */
    recommendAction() {
        var field = "id"
        var order = 2;
        this.setData({
            stau: 1,
            order,
            field,
            page: 1,
            list: []
        })
        this.GetItemList();

    },
    /**
     * 销量排序
     */
    salesAction() {
        var field = "sales"
        var order = 2;
        this.setData({
            stau: 2,
            order,
            field,
            page: 1,
            list: []
        })
        this.GetItemList();
    },
    /**
     * 价格排序
     */
    priceAction() {
        var field = "price"
        var order = this.data.order;
        if (order == 2) {
            order = 1
        } else if (order == 1) {
            order = 2
        }
        this.setData({
            stau: 3,
            order,
            field,
            page: 1,
            list: []
        })
        this.GetItemList();
    },
    /**
     * 获取商品列表
     * 参数: 
     * catId 必填 产品分类ID
     * openid 必填
     * field 选填 排序字段 默认值：id
     * order 选填 排序方式 默认值：2
     * 综合推荐 id,2 销量sales,2   价格price,1   price,2
     */
    GetItemList() {
        var that = this;
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        wx.showLoading({
            title: '数据努力加载中...',
        })
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.GetItemList",
            method: "GET",
            data: {
                unionid,
                catId: that.data.catId,
                field: that.data.field,
                order: that.data.order,
                page: that.data.page
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        var data = res.data.data.list;
                        if (data.length) {
                            var list = that.data.list;
                            list = [...list, ...data]
                            that.setData({
                                list,
                                total:res.data.data.total
                            })
                            setTimeout(function () {
                                wx.hideLoading()
                            }, 200)
                        }


                    } else {
                        wx.hideLoading();
                        var page = that.data.page;
                        page--
                        that.setData({
                            page
                        })
                        wx.showToast({
                            title: '到底啦~',
                            icon: "none",
                            duration: 2000
                        })
                    }
                } else if (res.data.data.tag == 2) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '当前分类无商品信息',
                        icon: "none",
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            url: "1"
                        })
                    }, 2100)
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '到底啦~',
                        icon: "none",
                        duration: 2000
                    })
                }
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 进入商品详情页面
     */
    toDetailsTap(e) {
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },

})