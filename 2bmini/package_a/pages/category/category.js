import api from '../../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        categories: [], //一级分类
        categorySelected: {}, //默认第一个类别
        onLoadStatus: [], //二级分类

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log("e",e)
        var id = e.ids;
        var categorySelected = this.data.categorySelected;
        categorySelected.id = id
        console.log("categorySelected",categorySelected)
        this.setData({
            categorySelected
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
    onShow: function (e) {
        this.setData({
            jkUserInfo: ""
        })

        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        if (jkUserInfo) {
            this.setData({
                jkUserInfo
            })

        } else {
            this.setData({
                wxlogin: true
            })
        }
        this.getFirstCategorys();
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
     * 
     * 进入商品列表页面
     */
    categoryListRoute(e) {
        var catId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../category_list/category_list?catId=' + catId,
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
     * 点击一级分类
     */
    onCategoryClick(e) {
        var id = e.currentTarget.dataset.id;
        var categorySelected = this.data.categorySelected;
        categorySelected.id = id;
        this.setData({
            categorySelected
        })
        this.getChildCategorys(id)
    },
    /**
     * 一级分类接口
     */
    getFirstCategorys() {
        var that = this;
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        wx.request({
            url: api.jkServer + "?s=Wechat.Category.GetFirstCategorys",
            method: "GET",
            data: {
                unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var data = res.data.data;
                var categorySelected = that.data.categorySelected;
                var pid;
                if (res.data.ret == 200) {
                    console.log(categorySelected)
                    if (categorySelected.id) {
                        that.setData({
                            categories: data,
                            
                        })
                        pid = categorySelected.id;
                    } else {
                        that.setData({
                            categories: data,
                            categorySelected: data[0]
                        })
                        pid = data[0].id;
                    }
                    that.getChildCategorys(pid)
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: "服务器连接失败",
                    icon: "none",
                    duration: 2000
                })
            }
        })
    },
    /**
     * 二级分类接口
     */
    getChildCategorys(pid) {
        var that = this;
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        wx.request({
            url: api.jkServer + "?s=Wechat.Category.GetChildCategorys",
            method: "GET",
            data: {
                unionid,
                pid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var data = res.data.data;
                if (res.data.ret == 200) {
                    that.setData({
                        onLoadStatus: data,

                    })
                }
            },
            fail: function (res) {

            }
        })
    },

})