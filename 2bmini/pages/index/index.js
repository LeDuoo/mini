import api from '../../api';
const app = getApp();
// var app = getApp();
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


        undata: 2, //是否请求新数据   1删除data里面信息  
        ladding: true
    }, 

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        wx.setNavigationBarTitle({
            title: "特拱商城"
        })
       var that = this;
 
        var userInfo = wx.getStorageSync('userInfo');
        if (e.scene) {
           
            var getQueryString = {}
            var strs = decodeURIComponent(e.scene).split('&');
            console.log("strs",strs)
            for (var i = 0; i < strs.length; i++) {
                getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
               
            }
           
            this.setData({
                c_id: getQueryString['c_id'] || '0',
                userId:getQueryString['userId'] || '0',
            })
            console.log("c_id",this.data.c_id)
             console.log("userId",this.data.userId)
             console.log(this.data)
            // wx.setStorage({
            //     data: getQueryString['c_id'] || '0',
            //     key: 'c_id',
            // })
            app.globalData.c_id = getQueryString['c_id'] || '0';
            if(!userInfo){
                wx.reLaunch({
                    url: '../login/login'
                })
            }
        } else if (e.c_id) {
            this.setData({
                c_id: e.c_id || '0'
            })
            app.globalData.c_id = e.c_id || '0';
            if(!userInfo){
                wx.reLaunch({
                    url: '../login/login'
                })
            }
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
        var userInfo = wx.getStorageSync('userInfo');
        var undata = wx.getStorageSync('undata');
        if (undata) {
            if (undata == 1) {
                this.setData({
                    goods: []
                })
                wx.setStorage({
                    data: 2,
                    key: 'undata',
                })
            } else {
            }
        }
        if (userInfo) {
            this.setData({
                wxlogin: false,
                userInfo
            })
        } else {
            this.setData({
                wxlogin: true,
                userInfo: ""
            })
            // this.queryCategory();
            // this.GetGoodsIndex();
            // this.queryPic();   
        }
        this.setData({
            ladding: true
        })
         this.GetCompany();
        this.queryCategory();
        this.GetGoodsIndex();
        this.queryPic();
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
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.GetGoodsIndex();
        } else {

        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        // var company_name =  this.data.company_name;
        var c = this.data.userInfo ? this.data.userInfo.company_id : "0";
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
    tapBanner(e){
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        }) 
    },
    /**
     * 点击推荐广告进入商品详情页
     */
    addetail1(e){
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    addetail2(e){
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    addetail3(e){
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/detail?goodsId=' + goodsId,
        })
    },
    /**
     * 点击大广告图片进去商品详情页
     */
    adlistDetail(e){
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
            url: '../category/category?id=' + id,
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
     * 进入健康
     */
    routerJk(){
        var userInfo = wx.getStorageSync('userInfo');
        if(userInfo){
            var userId = this.data.userId?this.data.userId:0;
            wx.redirectTo({
              url: '../../package_a/pages/index/index?userId='+userId,
            })
        }else{
            wx.showToast({
              title: '请先登录',
              icon:"none",
              duration:1500
            })
        }
    },
    /**
     * 拨打电话 分享生成海报
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
     * 获取图片接口
     */
    queryPic() {
        var that = this;
        var unionid = that.data.userInfo ? that.data.userInfo.unionid : "";
        wx.request({
            url: api.apiServer + "?s=Wechat.Pic.Query",
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
        var unionid = that.data.userInfo ? that.data.userInfo.unionid : "";
        wx.request({
            url: api.apiServer + "?s=Wechat.Item.GetItemIndex",
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
            load_ids:1
        })
        var unionid = that.data.userInfo ? that.data.userInfo.unionid : "";
        wx.request({
            url: api.apiServer + "?s=Wechat.Item.GetGoodsIndex",
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
                        goods = [...goods, ...data]
                    } else {
                        goods = [...data]
                    }

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
     * 获取商城默认数据
     */
    GetCompany() {
        var that = this;
        var unionid = that.data.userInfo ? that.data.userInfo.wx_unionid : "";
        var company_id = that.data.c_id && that.data.c_id > 0 ? that.data.c_id : that.data.userInfo.company_id;
        wx.request({
            url: api.apiServer + "?s=Wechat.Customer.GetCompany",
            method: "GET",
            data: {
                unionid,
                company_id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag != 0) {
                        var company = res.data.data;
                        var company_name = company.company.company_name;
                        wx.setNavigationBarTitle({
                            title: company_name
                        })
                        that.setData({
                            company_name,
                            undata: company.company.undata
                        })

                        wx.setStorage({
                            data: company,
                            key: 'company',
                        })
                        wx.setStorage({
                            data: company.company.undata,
                            key: 'undata',
                        })
                        if (company.company.undata == 1) {
                            //获取新用户信息
                            wx.request({
                                url: api.apiServer + "?s=Wechat.Auth.GetCustomerInfo",
                                method: "GET",
                                data: {
                                    unionid: that.data.userInfo.unionid
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
                                        that.setData({
                                            userInfo,
                                            c_id: userInfo.company_id
                                        })

                                        that.onShow();
                                    } else {
                                        wx.showToast({
                                            title: res.data.data.res,
                                            icon: "none",
                                            duration: 2000
                                        })
                                        wx.clearStorage();
                                    }
                                },
                                fail: function (res) {

                                }
                            })


                        }

                    }
                }
            },
            fail: function (res) {

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
    
})