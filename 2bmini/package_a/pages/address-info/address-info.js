import api from '../../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        provinceList: [],
        cityShow: false, //选择城市 false隐藏 true 显示
        countShow: false, //选择区域  false隐藏 true 显示
        townShow: false, //选择街道  false隐藏 true 显示
        obj:{},
        door:0,//开关门
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        wx.setNavigationBarTitle({
            title: '地址管理'
        })
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
            jkUserInfo
        })
        if (e.type && e.type == 1) {
            this.province();
            this.setData({
                type: 1
            })
        } else {
            var obj = JSON.parse(e.obj)
            this.setData({
                type: 2,
                receiver: obj.receiver,
                mobile: obj.mobile,
                address: obj.address,
                cityShow: true,
                countShow: true,
                townShow: true,
                obj
            })
            var provinceId = obj.provinceId;
            var cityId = obj.cityId;
            var areaId = obj.areaId;
            var townId = obj.townId;
            this.province(provinceId);
            var action = "city";
            var param = {
                id: provinceId
            };
            param = JSON.stringify(param);
            this.city(action, param, cityId);
            action = "county";
            param = {
                id: cityId
            }
            param = JSON.stringify(param);
            this.count(action, param, areaId);

            if (obj.town) {
                action = "town";
                param = {
                    "id": Number(areaId),
                }
                this.setData({
                    townShow: true,
                })
                param = JSON.stringify(param);
                this.town(action, param, townId)
            } else {
                this.setData({
                    townShow: false,
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
     * 选择省
     */
    bindRegionChange: function (e) {
        this.setData({
            index: e.detail.value,
            cityShow: true,
            countShow: false,
            townShow: false,
            cityList: [],
            countList: [],
            townList: [],

        })
        var provinceList = this.data.provinceList;
        var action = "city";
        var param = {
            id: provinceList[e.detail.value].id
        };
        param = JSON.stringify(param);
        var areaId = "";
        this.city(action, param, areaId)
    },
    /**
     * 选择市
     */
    bindRegionChangeCity(e) {
        this.setData({
            cityIndex: e.detail.value,
            countShow: true,
            townShow: false,
            countList: [],
            townList: [],
        })
        var action = "county"
        var cityList = this.data.cityList;
        var param = {
            id: cityList[e.detail.value].id
        };
        param = JSON.stringify(param);
        this.count(action, param)
    },
    /**
     * 选择区
     */
    bindRegionChangeCount(e) {
        var obj = this.data.obj;
        obj.town = " ";
        obj.townId = " ";
        this.setData({
            countIndex: e.detail.value,
            townShow: false,
            townList: [],
            obj

        })
        var action = "town";
        var countList = this.data.countList;
        var param = {
            id: countList[e.detail.value].id
        };
        param = JSON.stringify(param);
        this.town(action, param)
    },
    /**
     * 选择街道
     */
    bindRegionChangeTown(e) {
        this.setData({
            townIndex: e.detail.value,

        })

    },
    /**
     * 删除地址
     */
    deleteAction() {
        var that = this;
        wx.showModal({
            title: '信息',
            content: '确定删除该地址？',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: api.jkServer + "?s=Wechat.Customer.DelAddress",
                        method: "POST",
                        data: {
                            unionid: that.data.jkUserInfo.wx_unionid,
                            address_id: that.data.obj.id
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            if (res.data.ret == 200) {
                                if (res.data.data.tag == 0) {
                                    wx.showToast({
                                        title: res.data.data.res,
                                        icon: 'none',
                                        duration: 1000
                                    })
                                } else {
                                    wx.showToast({
                                        title: res.data.data.res,
                                        icon: 'none',
                                        duration: 1000
                                    })
                                    var timer = setTimeout(function () {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }, 1000)
                                }
                            }
                        },
                        fail: function (res) {

                        }
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    /**
     * 设为默认地址
     */
    setDefAction() {
        var that = this;
        if (this.data.obj.is_default == 1) {
            wx.showToast({
                title: "该地址已经市默认地址",
                icon: 'none',
                duration: 1000
            })
            return false
        }
        wx.request({
            url: api.jkServer + "?s=Wechat.Customer.SetDefaultAddress",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                address_id: that.data.obj.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    wx.showToast({
                        title: res.data.data.res,
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },
    /**
     * 保存地址
     */
    formSubmit(e) {
        var value = e.detail.value;
        var openid = "o3aJ2wG8sm3NnTO0N44bO-QVahWc";
        var data = this.data;
        var receiver = value.receiver;
        var mobile = value.mobile;
        var provinceList = data.provinceList;
        var index = data.index;
        if (provinceList.length > 0 && index != undefined) {
            var province = provinceList[index].provinceitem;
            var provinceId = provinceList[index].id;
        }
        var cityList = data.cityList;
        var cityIndex = data.cityIndex;
        if (cityIndex != undefined && cityList != undefined) {
            var city = cityList[cityIndex].provinceitem;
            var cityId = cityList[cityIndex].id;
        }
        var address = value.address;
        var countList = data.countList;
        var countIndex = data.countIndex;
        if (countList != undefined && countIndex != undefined && countList.length > 0) {
            var area = countList[countIndex].provinceitem;
            var areaId = countList[countIndex].id;
        }

        var townList = data.townList;
        var townIndex = data.townIndex;
        if (townList != undefined && townIndex != undefined && townList.length > 0) {
            var town = townList[townIndex].provinceitem;
            var townId = townList[townIndex].id;
        }

        if (receiver == '') {
            wx.showToast({
                title: '收货人不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (mobile == '') {
            wx.showToast({
                title: '联系电话不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        var reg = /^1[3456789]\d{9}$/;
        if(!reg.test(mobile)){
            wx.showToast({
                title: '您输入的手机号有误',
                icon: 'none',
                duration: 1000
            })
            return false; 
        }
        if (province == undefined) {
            wx.showToast({
                title: '省份/直辖市不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (area == undefined) {
            wx.showToast({
                title: '区/县不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if(townList==undefined){
            town = '';
            townId = "";
        }
        if (townList&&townList.length < 1) {
            town = '';
            townId = "";
        } else if (townList&&townList.length > 0 && town == undefined) {
            wx.showToast({
                title: '乡/镇不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        if (address == '') {
            wx.showToast({
                title: '详细地址不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        var door = this.data.door;
        if(door==0){
            if(this.data.type==1){
                this.AddJdAddress(openid, receiver, mobile, province, city, area, town, provinceId, cityId, areaId, townId, address)
            }else if(this.data.type==2){
                var address_id = this.data.obj.id;
                this.UpdJdAddress(openid, receiver, mobile, province, city, area, town, provinceId, cityId, areaId, townId, address, address_id)
            }
        }else{
            wx.showToast({
              title: '请不要频繁点击',
              icon:"none",
              duration:2000
            })
        }
       
      
      
    },
    /** 
     * 获取省份
     */
    province(provinceId) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Jdapi.Query",
            method: "POST",
            data: {
                action: "province",
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var province = res.data.data.res;
                if (res.data.ret == 200) {
                    var provinceList = [];
                    for (var i in province) {
                        var id = province[i];
                        var provinceitem = i;
                        var obj = {
                            id,
                            provinceitem
                        }
                        provinceList.push(obj)
                    }
                    if (provinceId) {
                        var index = "";
                        for (var i = 0; i < provinceList.length; i++) {
                            if (provinceId == provinceList[i].id) {
                                index = i;
                            }
                        }
                        that.setData({
                            index
                        })
                    }
                    that.setData({
                        provinceList
                    })
                }

            },
            fail: function (res) {

            }
        })
    },
    /**
     * 获取市
     */
    city(action, param, cityId) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Jdapi.Query",
            method: "POST",
            data: {
                action,
                param
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    var province = res.data.data.res;
                    var cityList = [];
                    for (var i in province) {
                        var id = province[i];
                        var provinceitem = i;
                        var obj = {
                            id,
                            provinceitem
                        }
                        cityList.push(obj)
                    }
                    if (cityId) {
                        var cityIndex = '';
                        for (var i = 0; i < cityList.length; i++) {
                            if (cityId == cityList[i].id) {
                                cityIndex = i
                            }
                        }
                        that.setData({
                            cityIndex
                        })
                    }
                    that.setData({
                        cityList
                    })
                    // that.setData({
                    //     province
                    // })
                }

            },
            fail: function (res) {

            }
        })
    },
    /**
     * 获取区
     */
    count(action, param, areaId) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Jdapi.Query",
            method: "POST",
            data: {
                action,
                param
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    var province = res.data.data.res;
                    var countList = [];
                    for (var i in province) {
                        var id = province[i];
                        var provinceitem = i;
                        var obj = {
                            id,
                            provinceitem
                        }
                        countList.push(obj)
                    }
                    if (areaId) {
                        var countIndex = '';
                        for (var i = 0; i < countList.length; i++) {
                            if (areaId == countList[i].id) {
                                countIndex = i
                            }
                        }
                        that.setData({
                            countIndex
                        })
                    }
                    that.setData({
                        countList
                    })
                    // that.setData({
                    //     province
                    // })
                }

            },
            fail: function (res) {

            }
        })
    },
    /**
     * 获取街道
     */
    town(action, param, townId) {
       
        var that = this;
        that.setData({
            townShow: false
        })
        wx.request({
            url: api.jkServer + "?s=Wechat.Jdapi.Query",
            method: "POST",
            data: {
                action,
                param
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        that.setData({
                            townShow: true
                        })
                        var province = res.data.data.res;
                        var townList = [];
                        for (var i in province) {
                            var id = province[i];
                            var provinceitem = i;
                            var obj = {
                                id,
                                provinceitem
                            }
                            townList.push(obj)
                        }
                        if (townId) {
                            var townIndex = '';
                            for (var i = 0; i < townList.length; i++) {
                                if (townId == townList[i].id) {
                                    townIndex = i
                                }
                            }
                            that.setData({
                                townIndex,
                                townShow: true
                            })
                        }
                        that.setData({
                            townList
                        })
                    } else {
                        that.setData({
                            townShow: false
                        })
                    }

                    // that.setData({
                    //     province
                    // })
                }

            },
            fail: function (res) {
            }
        })
    },
    /**
     * 保存地址
     */
    AddJdAddress(openid, receiver, mobile, province, city, area, town, provinceId, cityId, areaId, townId, address) {
        var that = this;
        that.setData({
            door:1
        })
        wx.request({
            url: api.jkServer + "?s=Wechat.Customer.AddJdAddress",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                receiver,
                mobile,
                province,
                city,
                area,
                town,
                provinceId,
                cityId,
                areaId,
                townId,
                address,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        wx.showToast({
                            title: '地址添加成功',
                            icon: 'none',
                            duration: 1000
                        })
                        var timer = setTimeout(function () {
                            that.setData({
                                door:0
                            })
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 1000)
                       
                    }
                }
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 修改
     */
    UpdJdAddress(openid, receiver, mobile, province, city, area, town, provinceId, cityId, areaId, townId, address, address_id) {
        var that = this;
        that.setData({
            door:1
        })
        wx.request({
            url: api.jkServer + "?s=Wechat.Customer.UpdJdAddress",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                receiver,
                mobile,
                province,
                city,
                area,
                town,
                provinceId,
                cityId,
                areaId,
                townId,
                address,
                address_id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if (res.data.data.tag == 1) {
                        wx.showToast({
                            title: '地址修改成功',
                            icon: 'none',
                            duration: 1000
                        })
                       
                        var timer = setTimeout(function () {
                            that.setData({
                                door:0
                            })
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 1000)
                    }else{
                        wx.showToast({
                            title: res.data.data.res,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }
            },
            fail: function (res) {

            }
        })
    },

})