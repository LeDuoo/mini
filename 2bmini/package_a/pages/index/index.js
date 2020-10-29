import api from '../../../api';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [], //轮播
        categories: [], //分类列表
        goodsRecommend: [], //广告展示
        Adlist: [], //横幅广告
        load_ids: "", //排除已加载过的商品  
        goods: [], //精选好品
        mask: true,
        cus_mobile: false,
        cus_name: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        // wx.setNavigationBarTitle({
        //     title: "特拱商城"
        // })
        var userId = e.userId;
        this.setData({
            userId
        })
        var jkUserInfo = wx.getStorageSync('jkUserInfo');

        if (jkUserInfo) {
            this.login();
        } else {
            this.login();
        }
        this.queryPic();
        this.queryCategory();
        this.GetGoodsIndex();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 获取手机号码
     */
    getPhoneNumber(e) {
        console.log(e)
        if (e.detail.errMsg == "getPhoneNumber:ok") {
            var encryptedData = e.detail.encryptedData;
            var iv = e.detail.iv;
            this.setData({
                cus_mobile: false
            })
            this.WeiXinuserMobile(encryptedData, iv)
        }

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        console.log("cus_mobile", jkUserInfo.cus_mobile, jkUserInfo)
        if (jkUserInfo) {
            if (jkUserInfo.cus_mobile && jkUserInfo.cus_mobile.length > 1) {
                console.log("111111")
                this.setData({
                    cus_mobile: false
                })
            } else {
                console.log("2222")
                this.setData({
                    cus_mobile: true
                })
            }
        }

        console.log(jkUserInfo);
        wx.login({
            success(res) {
                if (res.code) {
                    var code = res.code;
                    that.setKey(code);
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
        if (jkUserInfo) {
            this.setData({
                wxlogin: false,
                jkUserInfo
            })
        } else {
            this.setData({
                wxlogin: true,
                jkUserInfo: ""
            })
        }
    },
    setKey(code) {
        this.setData({
            code
        })
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
        this.setData({
            goods: []
        })
        this.onShow();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        if (jkUserInfo) {
            this.GetGoodsIndex();
        } else {

        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        // var company_name =  this.data.company_name;
        var c = this.data.jkUserInfo ? this.data.jkUserInfo.company_id : "0";
        var title = this.data.company ? this.data.company.company.company_name : "特拱商城";
        return {
            title,
            path: '/pages/index/index?c_id=' + c
        }

    },
    //分享到朋友圈
    // onShareTimeline(){
    //     var c = this.data.userInfo ? this.data.userInfo.company_id : "0";
    //     var title = this.data.company ? this.data.company.company.company_name : "特拱商城";
    //     return {
    //         title,
    //         path: '/pages/index/index?c_id=' + c
    //     }
    // },
    /**
     * 轮播广告进去商品详情
     */
    tapBanner(e) {
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    /**
     * 点击推荐广告进入商品详情页
     */
    addetail1(e) {
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    addetail2(e) {
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    addetail3(e) {
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    /**
     * 点击大广告图片进去商品详情页
     */
    adlistDetail(e) {
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    /**
     * 跳转到分类页面
     */
    categoryRoute(e) {
        var id = e.currentTarget.dataset.id;
        wx.reLaunch({
            url: '../category/category?ids=' + id,
        })
    },
    /**
     * 跳转到分类页面
     */
    categoryRouteBig(e) {
        wx.reLaunch({
            url: '../category/category',
        })
    },
    /**
     * 积分签到
     */
    PhoneCall() {
        console.log("签到")
        this.setData({
            mask: false
        })
        this.SignIn();
    },
    /**
     * 隐藏签到信息
     */
    falseMske() {
        this.setData({
            mask: true
        })
    },
    /**
     * 获取图片接口
     */
    queryPic() {
        var that = this;
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        wx.request({
            url: api.jkServer + "?s=Wechat.Pic.Query",
            data: {
                unionid
            },
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    banners: res.data.data[1],
                    goodsRecommend: res.data.data[2],
                    Adlist: res.data.data[3]
                })
            },
            fail: function (res) {

            }
        })
    },
    /**
     * //首页获取产品列表
     */

    queryCategory() {
        var that = this;
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.GetItemIndex",
            method: "POST",
            data: {
                unionid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                that.setData({
                    categories: res.data.data.res
                })
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 获取精选好品
     */
    GetGoodsIndex() {
        var that = this;
        var load_ids = that.data.load_ids;
        this.setData({
            load_ids: 1
        })
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.GetGoodsIndex",
            method: "GET",
            data: {
                unionid,
                limit: "9",
                ids: load_ids
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    var data = res.data.data;
                    var goods = that.data.goods;
                    var ids = "";
                    for (var i = 0; i < data.length; i++) {
                        load_ids += load_ids == "" ? data[i].id : "," + data[i].id;
                    }
                    if (goods.length > 0) {
                        console.log(1)
                        goods = [...goods, ...data]
                        console.log(2)
                    } else {
                        goods = [...data]
                        console.log(3)
                    }
                    console.log(goods)
                    that.setData({
                        load_ids,
                        goods
                    })
                    wx.stopPullDownRefresh();
                    //load_ids += load_ids == "" ? ls.id : "," + ls.id;
                } else {
                    that.setData({
                        ladding: false
                    })
                    // wx.showToast({
                    //     title: res.data.msg,
                    //     icon: "none",
                    //     duration: 2000
                    // })
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
     * 进入列表页面
     */
    bindinput() {
        wx.navigateTo({
            url: '../list/list',
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
    /**
     * 登录健康
     */
  
    login() {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        var pid = that.data.userId ? that.data.userId : "0"
        console.log(userInfo)
        wx.request({
            url: api.jkServer + "?s=Wechat.Auth.login",
            method: "POST",
            data: {
                nickname: userInfo.wx_nickname,
                headimgurl: userInfo.wx_headimgurl,
                unionid: userInfo.wx_unionid,
                openid: userInfo.mini_openid,
                id: userInfo.id,
                pid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        var jkUserInfo = res.data.data.res;
                        console.log("缓存", jkUserInfo)
                        that.setData({
                            jkUserInfo
                        })
                        if (jkUserInfo.cus_mobile && jkUserInfo.cus_mobile.length > 1) {
                            console.log("111111")
                            that.setData({
                                cus_mobile: false
                            })
                        } else {
                            console.log("2222")
                            that.setData({
                                cus_mobile: true
                            })
                        }
                        wx.setStorage({
                            key: 'jkUserInfo',
                            data: jkUserInfo,

                        })
                    }
                }
            },
            fail: function (res) {

            }

        })
    },
    /**
     * 签到接口
     */
    SignIn() {
        var that = this;
        var stime = Math.ceil(new Date().getTime() / 1000);
        console.log(stime)
        wx.request({
            url: api.jkServer + "?s=Wechat.SignIn.SignIn",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                stime: stime
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("签到详情", res)
                if (res.data.code == 200) {
                    that.setData({
                        msg: "积分" + res.data.data
                    })
                } else {
                    that.setData({
                        msg: "不能重复签到"
                    })
                }

            },
            fail: function (res) {

            }
        })
    },
    /**
     * 获取手机号接口
     */
    WeiXinuserMobile(encryptedData, iv) {
        var that = this;
        // console.log("that.data.cus_name", that.data.cus_name)
        
        wx.request({
            url: api.jkServer + "?s=Wechat.Auth.WeiXinuserMobile",
            method: "POST",
            data: {
                code: that.data.code,
                encryptedData,
                iv,
                cus_name: that.data.jkUserInfo.wx_nickname
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log("获取手机号", res)
                if (res.data.code == 200) {
                    console.log(res, res.data)
                    var jkUserInfo = that.data.jkUserInfo;
                    jkUserInfo.cus_mobile = res.data.data
                    that.setData({
                        jkUserInfo
                    })
                    wx.setStorage({
                        key: 'jkUserInfo',
                        data: jkUserInfo,

                    })
                } else {
                    wx.showToast({
                        title: "服务器连接失败",
                        icon: "none",
                        duration: 2000
                    })
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
})