import api from '../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],//商品列表
        stau:1, //选中推荐 销量 价格
        order:2,//价格排序默认等于1
        iShow:1,
        value:"",//搜索的值
        iSst:1,//展示搜索记录
        page:1,//页数
        field:"id"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        var userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        })
        var storage = wx.getStorageSync('storage');
        if(storage.length&&storage.length>0){
        }else{
            this.setData({
                iSst:2
            })
            storage = [];
        }
        wx.setStorage({
          data: storage,
          key: 'storage',
        })
        this.setData({
            storage
        })
        this.GetHotKeywords()
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
        this.GetList();   
    },
    /**
     * 返回上一页
     */
    returnPage(){
        wx.navigateBack({
            delta: 1
        })
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
                if (res.tapIndex ==1) {
                    wx.setClipboardData({
                        data: tel,
                        success (res) {
                          wx.getClipboardData({
                            success (res) {

                            },
                            fail(res){

                            }
                          })
                        },
                        fail(res){

                        }
                      })
                }
                if (res.tapIndex ==2) {
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
     * 综合推荐
     */
    recommendAction(){
        this.setData({
            stau:1,
            order:2 ,
            list:[],
            field:"id",
            order:2,
            page:1,
            list:[]

        })
        this.GetList();
        
    },
     /**
     * 销量排序
     */
    salesAction(){
        var field = "sales"
        var order = 2;
        this.setData({
            stau:2,
            order:2 ,
            list:[],
            field,
            order:2,
            page:1,
            list:[]
        })
        this.GetList();
    },
    /**
     * 价格排序
     */
    priceAction(){
        var field = "price"
        var order = this.data.order;
        if(order==2){
            order=1
        }else if(order==1){
            order=2 

        }
        this.setData({
            stau:3,
            order,
            list:[],
            field,
            page:1,
        })
        this.GetList();
    },
    /**
     * 
     * 实时获取inp值 
     */
    bindinputAction(e){
        var value = e.detail.value;
        if(value==""&&value==undefined&&value==null){
            
        }else{
            this.setData({
                value,
              
            })
        }
       
    },

    /**
     * 点击放大镜
     */
    searchAction(e){
        var storage = wx.getStorageSync('storage');
        var a = 1;
        for(var i=0;i<storage.length;i++){
            var a = 1;
            if(this.data.value==storage[i]){
                a=2;
                break;
            }
        }
        if(a==1){
            storage.push(this.data.value);
        }
        if(storage.length>10){
            storage.shift() 
        }
        wx.setStorage({
            key:"storage",
            data:storage
          })
          this.setData({
            storage
        })
        if(this.data.value!=""&&this.data.value!=null){
            this.setData({
                iShow:2,
                page:1,
                list:[]

            })
            this.GetList();   
        }
    },
    bindconfirmAction(e){
        var storage = wx.getStorageSync('storage');
        var a = 1;
        for(var i=0;i<storage.length;i++){
            var a = 1;
            if(this.data.value==storage[i]){
                a=2;
                break;
            }
        }
        if(a==1){
            storage.push(this.data.value);
        }
        if(storage.length>10){
            storage.shift() 
        }
        wx.setStorage({
            key:"storage",
            data:storage
          })
          this.setData({
            storage
        })
        if(this.data.value!=""&&this.data.value!=null){
            this.setData({
                iShow:2
            })
            this.setData({
                list:[]
            })
            this.GetList();   
        }
    },
    /**
     * 
     * 点击热门搜索
     */
    itemAction(e){
        var goodsName = e.currentTarget.dataset.id;
        this.setData({
            value:goodsName,
            iShow:2,
            list:[]
        })
        this.GetList(); 
    },
    /**
     * 
     * 点击浏览继续搜索
     */
    /**
     * 删除搜索缓存
     */
    deleteAction(e){
        var storage = [];
        wx.setStorage({
          data:storage ,
          key: 'storage',
        })
        this.setData({
            storage,
            iSst:2
        })
    },
    regAction(e){
        var id  = e.currentTarget.dataset.id;
        this.setData({
            value:id,
            iShow:2,
            list:[]
        })
        this.GetList()
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
    GetList(){
        var that = this;
        var unionid = that.data.userInfo? that.data.userInfo.unionid:"";
        var goodsName = that.data.value;
        if(goodsName==""&&goodsName==null&&goodsName==undefined){
            wx.showToast({
              title: '搜索不能为空',
              icon:"none",
              duration:200
            })
            return false
        }else{
            wx.showLoading({
                title: '数据努力加载中...',
              })
            wx.request({
                url: api.apiServer+"?s=Wechat.Item.GetList",
                method: "GET",
                data: {
                    goodsName,
                    unionid,
                    field:that.data.field,
                    order:that.data.order,
                    page:that.data.page
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var data = res.data.data.list;
                    var list = that.data.list;
                    if(res.data.ret==200){
                        if(data.length){
                            that.setData({
                                list:[...list,...data],
                                total:res.data.data.total
                            })
                            setTimeout(function () {
                                wx.hideLoading()
                               }, 200)
                        }else{
                            wx.hideLoading();
                            if(res.data.data.total<1){
                                wx.showToast({
                                    title: '您搜索的商品不存在',
                                    icon: 'none',
                                    duration: 2000
                                  })
                            }else{
                                wx.showToast({
                                    title: '到底啦~',
                                    icon: 'none',
                                    duration: 2000
                                  })  
                            }
                            
                        }   
                    }                   
                },
                fail: function (res) {
    
                }
            })  
        }
       
    },
    /**
     * 获取热门搜索
     */
    GetHotKeywords(){
        var that = this;
        var unionid = that.data.userInfo? that.data.userInfo.unionid:""
        wx.request({
            url: api.apiServer+"?s=Wechat.Customer.GetHotKeywords",
            method: "GET",
            data: {
                unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if(res.data.data.tag==0){
                    return false
                }
                that.setData({
                    setList:res.data.data.res
                })
            },
            fail: function (res) {

            }
        })   
    },
    /**
     * 进入商品详情页面
     */
    toDetailsTap(e){
        var goodsId = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../detail/detail?goodsId='+goodsId,
        })
    }
})