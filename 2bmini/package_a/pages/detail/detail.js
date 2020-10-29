import api from '../../../api';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIpx: 0, //1为苹果
        detailInfo: false, //显示商品属性
        addressIshow: false, //地址选择栏
        num: 1, //选择数量
        buyIshow: false, //蒙蔽
        clickFlag: true, //判断是否有货
        goodsDetail: {
            cus_price: 0,
            price_default: 0
        }, //给一个默认价格
        wxlogin: false,
        posterIshow: false,
        address: [],
        goodsDetailIndex: 0, //轮播图下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
         wx.setNavigationBarTitle({
            title: '商品详情'
        })
        var that = this
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        if (e.scene) {
            var getQueryString = {};
            var strs = decodeURIComponent(e.scene).split('&');
            for (var i = 0; i < strs.length; i++) {
                getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
            }
            this.setData({
                c_id: getQueryString['c_id'] || '',
                goodsId: getQueryString['g_id'] || '',
                share: 1,
            })
            if (jkUserInfo) {
                this.setData({
                    wxlogin: false,
                    jkUserInfo
                })
                this.GetItemDetails();
            } else {
                // this.setData({
                //     wxlogin: true
                // })
                this.GetItemDetails()
            }
            wx.getSystemInfo({
                complete: (res) => {
                    if (res.safeArea.top > 40) {
                        that.setData({
                            isIpx: 1
                        })
                    }
                }
            })
        } else {
            var goodsId = e.goodsId;
            var that = this;
            this.setData({
                goodsId
            })
            if (jkUserInfo) {
                this.setData({
                    wxlogin: false,
                    jkUserInfo
                })
                this.GetItemDetails();
            } else {
                // this.setData({
                //     wxlogin: true
                // })
                this.GetItemDetails();
            }
            wx.getSystemInfo({
                complete: (res) => {
                    if (res.safeArea.top > 40) {
                        that.setData({
                            isIpx: 1
                        })
                    }
                }
            })
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
        var jkUserInfo = this.data.jkUserInfo;
        if (jkUserInfo) {
            this.QueryAddress();
        }
        this.setData({
            buyIshow: false, //蒙蔽
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    /**
     * 跟换goodsDetailIndex
     */
    bindchangeAction(e) {
        this.setData({
            goodsDetailIndex: e.detail.current
        })
    },
    /**
     * 拨打电话
     */
    PhoneCall() {
        if (!this.data.jkUserInfo) {
            this.setData({
                wxlogin: true,
            })
            return false
        }
        var that = this;
        var poster = this.data.poster;
        if (poster) {
            this.setData({
                posterIshow: true
            })
        } else {
            wx.showLoading({
                title: '图片生成中...',
            })
            that.Sun();

        }


        //取消拨打电话改为生成分享图片
        return false
        var tel = wx.getStorageSync('company');
        tel = tel.kf_tel ? kf_tel : "4000091966";
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
                        firstName: "积彩",
                        mobilePhoneNumber: "17811952861"
                    })
                }
            },
            fail(res) {

            }
        })

    },

    /**
     * 隐藏海报
     */
    closePoster() {
        this.setData({
            posterIshow: false
        })
    },
    /**
     * 保存图片到系统相册
     */
    saveImageAction() {
        var poster = this.data.poster;
        app.picture(poster,1)

    },
    /**
     * 预览图片
     */
    previewImage() {
        var poster = this.data.poster;
        var urls = [];
        urls.push(poster)
        wx.previewImage({
            current: poster,
            urls,
            success(res) {

            },
            fail(res) {

            }
        })
    },
    /**
     * 显示商品规格
     */
    showDetailInfo() {
        this.setData({
            detailInfo: true,
        })
    },
    /**
     * 隐藏商品规格
     */
    hideDetailInfo() {
        this.setData({
            detailInfo: false,
        })
    },
    /**
     * 选择新地址
     */
    addressAction() {
        this.setData({
            addressIshow: true
        })
    },
    /**
     * 隐藏地址选择
     */
    closeAction() {
        this.setData({
            addressIshow: false
        })
    },
    /**
     * 点击蒙蔽隐藏地址选择栏
     */
    addressIshowAction() {
        this.setData({
            addressIshow: false
        })
    },
    /**
     * 返回首页
     */
    indexRoute() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    /**
     * 进入新增地址页
     */
    addressInfo() {
        var jkUserInfo = this.data.jkUserInfo;
        if (jkUserInfo) {
            wx.navigateTo({
                url: '../address-info/address-info?type=1',
            })
        } else {
            this.setData({
                wxlogin: true
            })
        }

    },
    /**
     * 商品数量++
     */
    numJiaTap() {
        if (this.data.num < 10000) {
            var num = this.data.num;
            num++;
            this.setData({
                num
            })
        }
    },
    /**
     * 商品数量--
     */
    numJianTap() {
        if (this.data.num > 1) {
            var num = this.data.num;
            num--;
            this.setData({
                num
            })
        }

    },
    /**
     * input修改num值
     */
    numInput(e) {
        var val = e.detail.value;
        if (val) {
            this.setData({
                num: val
            })
        }
    },
    /**
     * 关闭蒙版隐藏加入购物车和立即购买功能
     */
    closeBuy() {
        this.setData({
            buyIshow: false
        })
    },
    /**
     * 点击加入购物车蒙蔽显示
     */
    addCartShow() {
        var jkUserInfo = this.data.jkUserInfo;
        if (jkUserInfo) {
            this.setData({
                buyIshow: true,
                addCart: true,
                purchase: false

            })
        } else {
            this.setData({
                wxlogin: true
            })
        }

    },
    /**
     * 点击立即购买蒙蔽显示
     */
    purchaseShow() {
        var jkUserInfo = this.data.jkUserInfo;
        if (jkUserInfo) {
            this.setData({
                buyIshow: true,
                purchase: true,
                addCart: false

            })
        } else {
            this.setData({
                wxlogin: true
            })
        }

    },
    /**
     * 加入购物车将商品存入缓存
     */
    addCart() {
        var goods_id = this.data.goodsInfo.id;
        var goods_num = this.data.num;
        var ctime = new Date().getTime();
        var goodsDetail = this.data.goodsDetail;
        if (goods_num < goodsDetail.lowest_buy) {
            wx.showToast({
                title: goodsDetail.lowest_buy + "件起购",
                icon: 'none',
                duration: 1000
            })
        } else {

            this.CreateCart(goods_id, goods_num, ctime);
        }
    },
    /**
     * 选择收货地址
     */
    rejAddressAction(e) {
        var id = e.currentTarget.dataset.id;
        var address = this.data.address;
        for (var i = 0; i < address.length; i++) {
            address[i].is_default = '0';
            if (address[i].id == id) {
                address[i].is_default = "1";
            }
        }
        this.setData({
            address
        })
    },
    /**
     * 进入下单页面
     */
    confirmorderRoute() {
        var shoppingCart = [];
        var goodsInfo = this.data.goodsInfo
        var goodsDetail = this.data.goodsDetail;
        goodsInfo.goods_number = this.data.num;
        var goods_num = this.data.num;
        shoppingCart.push(goodsInfo)
        if (goods_num < goodsDetail.lowest_buy) {
            wx.showToast({
                title: goodsDetail.lowest_buy + "件起购",
                icon: 'none',
                duration: 1000
            })
        } else {
            wx.setStorage({
                key: "shoppingCart",
                data: shoppingCart
            })
            wx.navigateTo({
                url: '../confirmorder/confirmorder',
            })
        }

    },
    /**
     * 获取商品详细
     * 参数: 
     * openid 必填
     * goodsId 商品ID必填
     */
    GetItemDetails() {
        wx.showLoading({
            title: '加载中',
        })
        var share = this.data.share ? this.data.share : '';
        var that = this;
        var unionid = that.data.jkUserInfo ? that.data.jkUserInfo.wx_unionid : "";
        var companyId = this.data.c_id ? this.data.c_id : "";
        wx.request({
            url: api.jkServer + "?s=Wechat.Item.GetItemDetails",
            method: "GET",
            data: {
                unionid,
                goodsId: that.data.goodsId,
                share,
                companyId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        that.setData({
                            goodsInfo: {
                                ...res.data.data.res
                            }
                        })
                        var goodsDetail = res.data.data.res;
                        var arr = [];
                        var picPlay = res.data.data.res.pic_play == '' || res.data.data.res.pic_play == null ? res.data.data.res.pic_index : res.data.data.res.pic_play;
                        if (picPlay.indexOf('|') != -1) {
                            arr = picPlay.split('|');
                        } else {
                            arr['0'] = picPlay;
                        }

                        var detail_arr = [];
                        var pic_detail = res.data.data.res.pic_detail == '' || res.data.data.res.pic_detail == null ? res.data.data.res.pic_index : res.data.data.res.pic_detail;
                        if (pic_detail.indexOf('|') != -1) {
                            detail_arr = pic_detail.split('|');
                        } else {
                            detail_arr['0'] = pic_detail;
                        }
                        var detail_arr1 = [];
                        for (var i = 0; i < detail_arr.length; i++) {
                            if (detail_arr[i].length > 10) {
                                detail_arr1.push(detail_arr[i])
                            }
                        }
                        console.log(detail_arr1)
                        goodsDetail.arr = arr;
                        goodsDetail.detail_arr = detail_arr1;
                        that.setData({
                            goodsDetail,

                        })
                        // that.QueryAddress()
                    } else if (res.data.data.tag == 2) {
                        wx.showToast({
                            title: res.data.data.res,
                            icon: 'none',
                            duration: 1000
                        })
                        setTimeout(function () {
                            wx.reLaunch({
                                url: '../index/index',
                            })
                        }, 1000)
                    } else {
                        wx.showToast({
                            title: res.data.data.res,
                            icon: 'none',
                            duration: 1000
                        })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1
                            })

                        }, 1000)

                    }
                }
                setTimeout(function () {
                    wx.hideLoading()
                }, 500)


            },
            fail: function (res) {
                wx.hideLoading()
            }
        })
    },
    /**
     * 获取用户收货地址
     */
    QueryAddress() {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Customer.QueryAddress",
            method: "GET",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    that.setData({
                        address: res.data.data
                    })
                    var address_id;
                    for (var i = 0; i < res.data.data.length; i++) {
                        if (res.data.data[i].is_default == 1) {
                            address_id = res.data.data[i].id
                        }
                    }
                    that.CheckJdGoodsStock(address_id);
                }
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 确定是否有货
     * 参数: 
     * openid 必填
     * info 商品及数量JSON
     * address_id 地址ID必填
     */
    CheckJdGoodsStock(address_id) {
        var stock_state_1 = 33;
        var stock_state_2 = 39;
        var stock_state_3 = 40;
        var that = this;
        var info = this.data.goodsInfo;
        var skuNums = [];
        if (info) {
            if (info.source == "1") {
                var skuId = info.goods_type;
                var num = this.data.num;
                var skuNumsObj = {
                    "skuId": skuId,
                    "num": num
                };
                skuNums.push(skuNumsObj);
                skuNums = JSON.stringify(skuNums);
                wx.request({
                    url: api.jkServer + "?s=Wechat.Order.CheckJdGoodsStock",
                    method: "GET",
                    data: {
                        unionid: that.data.jkUserInfo.wx_unionid,
                        info: skuNums,
                        address_id
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        if (res.data.ret == 200) {
                            if (res.data.data.tag == 1) {
                                var data = res.data.data.res;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].stockStateId != stock_state_1 && data[i].stockStateId != stock_state_2 && data[i].stockStateId != stock_state_3) {
                                        that.setData({
                                            clickFlag: false, //无货
                                        })

                                    } else {
                                        that.setData({
                                            clickFlag: true, //有货
                                        })

                                    }
                                }
                            } else {

                            }
                        }

                    },
                    fail: function (res) {

                    }
                })
            } else {

            }
        }

        return false

    },
    /**
     * 加入购物车接口
     * 参数:
     * openid
     * goods_id 商品ID
     * goods_num 商品数量
     * ctime 加入购物车时间
     */
    CreateCart(goods_id, goods_num, ctime) {
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
                    wx.showModal({
                        content: '添加成功',
                        cancelText: "继续购物",
                        cancelColor: "#f60",
                        confirmText: "去结算",
                        confirmColor: "#e6012",
                        success(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                  url: '../cart/cart',
                                })
                            } else if (res.cancel) {
                                that.setData({
                                    buyIshow: false
                                })
                            }
                        }
                    })
                }

            },
            fail: function (res) {

            }
        })
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
                var companyId = wx.getStorageSync('c_id') ? wx.getStorageSync('c_id') : "";
                wx.getUserInfo({
                    success: function (res) {
                        var rawData = res.rawData;
                        that.WeixinminiAuth(code, res.encryptedData, res.iv, res.signature, rawData, companyId)
                    }
                })
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
        var that = this;
        wx.showLoading({
            title: '登录中',
        })
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
                        jkUserInfo,
                        wxlogin: false
                    })
                    wx.setStorage({
                        data: jkUserInfo,
                        key: 'jkUserInfo',
                    })
                    wx.setStorage({
                        data: 1,
                        key: 'undata',
                    })
                    wx.hideLoading()
                    that.GetItemDetails();
                }
            },
            fail: function (res) {
                wx.hideLoading()
            }
        })
    },
    /**
     * 生成分享图片
     */
    Sun() {
        var that = this;
        var id = that.data.jkUserInfo ? that.data.jkUserInfo.id : "";
        wx.request({
            url: api.jkServer + "?s=Wechat.Orderimg.Sun",
            method: "GET",
            data: {
                goods_id: that.data.goodsDetail.id,
                customer_id: id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        that.setData({
                            poster: res.data.data.res,
                            posterIshow: true
                        })
                        wx.hideLoading();
                    }

                }
            },
            fail: function (res) {

            }
        })
    },
})