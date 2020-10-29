import api from '../../../api';
const app =  getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // index:0,//判断跳转
        price: 0, //总价
        isDefault: false, //全选
        type: 1, //1：管理 2:完成 
        items: [],
        noGoods: 1,
        wxlogin: false,
        bottom:100
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var that = this;
        wx.getSystemInfo({
            complete: (res) => {
                console.log(":::::::::::",res)
                if(res.safeArea.top>40){
                    that.setData({
                        bottom:180
                    })
                }
            }
          })
        wx.setNavigationBarTitle({
            title: '购物车'
        })
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
            api,
            jkUserInfo
        })
        if (e.q) {
            var strs = decodeURIComponent(e.q).split('?');
            var strs1 = decodeURIComponent(strs[1]).split('&');
            var id = decodeURIComponent(strs1[0]).split('=');
            var num = decodeURIComponent(strs1[1]).split('=');
            var goods_id = id[1];
            var goods_num = num[1]
            this.setData({
                goods_id,
                goods_num
            })
            if(jkUserInfo){
                if(goods_id&&goods_num){
                    this.CreateCart(goods_id, goods_num)
                }
              
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
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        if (jkUserInfo) {
            this.setData({
                wxlogin: false,
                jkUserInfo
            })
            this.QueryList();
            
        } else {
            this.setData({
                wxlogin: true,
                items:[],
                jkUserInfo:{}
            })
        }
        this.setData({
            price: 0, //总价
            isDefault: false, //全选
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
        // this.onShow();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 选择商品
     */
    itemAction(e) {
        var id = e.currentTarget.dataset.id;
        var items = this.data.items;
        var isDefault = true;
        for (var i = 0; i < items.length; i++) {
            if (id == items[i].id) {
                items[i].isDefault = !items[i].isDefault;
            }
            if (!items[i].isDefault) {
                isDefault = false
            }
        }
        //算总价
        var price = 0;
        for (var i = 0; i < items.length; i++) {
            if (items[i].isDefault) {
                price += items[i].price_default * items[i].goods_number;
            }
        }
        this.setData({
            items,
            isDefault,
            price
        })
    },
    /**
     * 全选 全取消
     */
    allAction() {
        var items = this.data.items;
        if (items) {
            var isDefault = this.data.isDefault;
            var price = 0;
            if (!isDefault) {
                for (var i = 0; i < items.length; i++) {
                    items[i].isDefault = true;
                    price += items[i].price_default * items[i].goods_number;
                }
                isDefault = true;
            } else {
                for (var i = 0; i < items.length; i++) {
                    items[i].isDefault = false
                }
                price = 0;
                isDefault = false;
            }
            this.setData({
                isDefault,
                items,
                price
            })
        }


    },
    /**
     * 点击管理
     */
    adminIstration() {
        var items = this.data.items;
        for (var i = 0; i < items.length; i++) {
            items[i].isDefault = false
        }
        this.setData({
            type: 2,
            isDefault: false,
            items,
            price: 0
        })
    },
    /**
     * 点击完成
     */
    complete() {
        var items = this.data.items;
        var goods_id = "";
        var goods_num = "";
        for (var i = 0; i < items.length; i++) {
            items[i].isDefault = false,
                goods_id += items[i].id + ','
            goods_num += items[i].goods_number + ','
        }
        goods_id = goods_id.substring(0, goods_id.length - 1);
        goods_num = goods_num.substring(0, goods_num.length - 1);
        this.EditNum(goods_id, goods_num);
        this.setData({
            type: 1,
            isDefault: false,
            items,
            price: 0
        })
    },
    /**
     * 删除购物车
     */
    deleteAction() {
        var goods_id = 0;
        var items = this.data.items;
        var goods_id = "";
        for (var i = 0; i < items.length; i++) {
            if (items[i].isDefault) {
                goods_id += items[i].id + ','
            }
        }
        goods_id = goods_id.substring(0, goods_id.length - 1);
        var that = this;
        if(goods_id){
            wx.showModal({
                content: '确定要删除商品？',
                success(res) {
                    if (res.confirm) {
                        that.DeleteCart(goods_id);
                    } else if (res.cancel) {
                    }
                }
            })
        }else{
            wx.showToast({
              title: '请先选择需要删除的商品',
              icon:'none',
              duration:2000
            })
        }
      

    },
    /**
     * 进入结算页面
     */
    settlementRoute() {
        var items = this.data.items;
        var obj = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].isDefault) {
                obj.push(items[i])
            }
        }
        if (obj.length < 1) {
            wx.showToast({
                title: '请先选择商品',
                icon: 'none'
            })
        } else {
            //obj = JSON.stringify(obj)
            wx.setStorage({
                data: obj,
                key: 'shoppingCart',
            })
            wx.navigateTo({
                url: '../confirmorder/confirmorder',
            })
        }

    },
    /**
     * 授权登录
     */
    processLogin(e) {
        var that = this;
        this.setData({
            wxlogin: false
        })
        wx.login({
            success: (res) => {
                var code = res.code;
                // var companyId = wx.getStorageSync('c_id') ? wx.getStorageSync('c_id') : "";
                var companyId = app.globalData.c_id;
                wx.getUserInfo({
                    success: function (res) {
                        var rawData = res.rawData;
                        that.WeixinminiAuth(code, res.encryptedData, res.iv, res.signature, rawData, companyId)
                    }
                })
                // that.WeixinAuth(code, type, companyId);
            },
            fail: (res) => {}
        })
    },
    /**
     * 暂不登录
     */
    cancelLogin(e) {
        this.setData({
            wxlogin: false
        })
    },
    /**
     * 小程序登入
     */
    WeixinminiAuth(code, encryptedData, iv, signature, rawData, companyId) {
        wx.showLoading({
            title: '登录中',
        })
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Auth.WeixinminiAuth",
            method: "POST",
            data: {
                code,
                encryptedData,
                iv,
                signature,
                rawData,
                companyId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    var jkUserInfo = res.data.data.res;
                    that.setData({
                        jkUserInfo
                    })
                    wx.setStorage({
                        data: jkUserInfo,
                        key: 'jkUserInfo',
                    })
                    wx.setStorage({
                        data: 1,
                        key: 'undata',
                    })
                    wx.hideLoading();
                    that.CreateCart(that.data.goods_id, that.data.goods_num);
                    that.QueryList();
                }
            },
            fail: function (res) {
                wx.hideLoading()
            }
        })
    },
    /**
     * 获取用户购物车信息 
     */
    QueryList() {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.QueryList",
            method: "GET",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        var data = res.data.data.res;
                        for (var i = 0; i < data.length; i++) {
                            data[i].isDefault = false;
                            if (data[i].pic_index.indexOf("//") != -1) {

                            } else {
                                data[i].pic_index = that.data.api.imgServer + data[i].pic_index
                            }
                        }
                        that.setData({
                            items: data,
                            noGoods: 2
                        })
                    } else {
                        that.setData({
                            noGoods: 1,
                            items:[]
                        })

                    }
                    if (res.data.data.tag == 0) {
                        //   wx.showToast({
                        //     title: res.data.data.res,
                        //     icon: 'none',
                        //     duration: 2000
                        //   })
                    }


                }

            },
            fail: function (res) {

            }
        })
    },
    /**
     * 删除购物车接口
     */
    DeleteCart(goods_id) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.Delete_cart",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                goods_id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    that.onShow();
                }
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 商品数量减减
     */
    jianBtnTap(e) {
        var goods_id = e.currentTarget.dataset.id;
        var items = this.data.items;
        for (var i = 0; i < items.length; i++) {
            if (goods_id == items[i].id) {
                if (items[i].goods_number > 1) {
                    items[i].goods_number--;
                } else {
                    items[i].goods_number = 1;
                }
            }
        }
        this.setData({
            items
        })
    },
    /**
     * 商品数量加加
     */
    jiaBtnTap(e) {
        var goods_id = e.currentTarget.dataset.id;
        var items = this.data.items;
        for (var i = 0; i < items.length; i++) {
            if (goods_id == items[i].id) {
                if (items[i].goods_number < 9999) {
                    items[i].goods_number++;
                } else {
                    items[i].goods_number = 9999;
                }
            }
        }
        this.setData({
            items
        })
    },
    /**
     * 修改商品数量
     */
    EditNum(goods_id, goods_num) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.EditNum",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                goods_id,
                goods_num
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    that.QueryList();

                }

            },
            fail: function (res) {

            }
        })
    },
    /**
     * 加入购物车接口
     * 参数:
     * openid
     * goods_id 商品ID
     * goods_num 商品数量
     * ctime 加入购物车时间
     */
    CreateCart(goods_id, goods_num) {
        var ctime = new Date().getTime();
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.CreateCart",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                goods_id,
                goods_num,
                ctime
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                           wx.showToast({
                                title: res.data.data.res,
                                icon: 'none',
                                duration: 2000
                              })
                    }else{
                        wx.showToast({
                            title: res.data.data.res,
                            icon: 'none',
                            duration: 2000
                          })  
                    }
                    that.onShow();

                }

            },
            fail: function (res) {

            }
        })
    },
    /**
     * 判断是否获取授权
     */
    // bindloadRoute(){
    //     var index= this.data.index;
    //     if(index>1){
    //         setTimeout(() => {
    //             wx.navigateTo({
    //                 url: '../list/list',
    //               })
    //         }, 5000);

    //     }else{
    //         index++;
    //         this.setData({
    //             index 
    //         })
    //     }

    // }
})